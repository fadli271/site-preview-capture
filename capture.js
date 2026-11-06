const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');
const { getDeviceProfile } = require('./devices');

function sanitizeFilename(inputUrl) {
  return inputUrl
    .replace(/^https?:\/\//i, '')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .slice(0, 60);
}

async function captureSitePreviews(options) {
  const {
    url,
    outDir = './output',
    fullPage = false,
    delayMs = 1000,
    deviceNames = ['desktop', 'tablet', 'mobile'],
    chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  } = options;

  if (!url) {
    throw new Error('Opsi url wajib diisi.');
  }

  if (!fs.existsSync(chromePath)) {
    throw new Error(`Google Chrome tidak ditemukan di path: ${chromePath}`);
  }

  const resolvedOutDir = path.resolve(process.cwd(), outDir);
  if (!fs.existsSync(resolvedOutDir)) {
    fs.mkdirSync(resolvedOutDir, { recursive: true });
  }

  const profiles = deviceNames.map(getDeviceProfile);
  const baseName = sanitizeFilename(url);

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--hide-scrollbars'
    ]
  });

  const results = [];

  try {
    for (const profile of profiles) {
      const page = await browser.newPage();
      const startTime = Date.now();

      try {
        await page.setViewport({
          width: profile.width,
          height: profile.height,
          deviceScaleFactor: profile.deviceScaleFactor,
          isMobile: profile.isMobile,
          hasTouch: profile.hasTouch
        });

        if (profile.userAgent) {
          await page.setUserAgent(profile.userAgent);
        }

        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

        try {
          await page.evaluateHandle('document.fonts.ready');
        } catch (_) {}

        if (delayMs > 0) {
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }

        const fileName = `${baseName}_${profile.name}.png`;
        const filePath = path.join(resolvedOutDir, fileName);

        await page.screenshot({
          path: filePath,
          fullPage
        });

        const durationMs = Date.now() - startTime;

        results.push({
          device: profile.name,
          filePath,
          width: profile.width * profile.deviceScaleFactor,
          height: fullPage ? 0 : profile.height * profile.deviceScaleFactor,
          durationMs
        });
      } finally {
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }

  return results;
}

module.exports = {
  captureSitePreviews
};
