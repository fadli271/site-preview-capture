const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { captureSitePreviews } = require('./capture');

async function verify() {
  console.log('Menjalankan uji verifikasi tangkapan layar...');
  const testUrl = 'data:text/html;charset=utf-8,' + encodeURIComponent(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { font-family: -apple-system, sans-serif; margin: 0; padding: 2rem; background: #0f172a; color: #f8fafc; }
          h1 { color: #38bdf8; font-size: 2.5rem; }
          .card { background: #1e293b; padding: 1.5rem; border-radius: 8px; border: 1px solid #334155; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Test Preview Capture</h1>
          <p>Uji render multi-device Retina DPR.</p>
        </div>
      </body>
    </html>
  `);

  const outDir = path.resolve(__dirname, './test-output');
  const results = await captureSitePreviews({
    url: testUrl,
    outDir,
    fullPage: false,
    delayMs: 100,
    deviceNames: ['desktop', 'tablet', 'mobile']
  });

  assert.strictEqual(results.length, 3, 'Harus menghasilkan 3 capture');

  for (const item of results) {
    assert(fs.existsSync(item.filePath), `File ${item.filePath} harus ada di disk`);
    const stat = fs.statSync(item.filePath);
    assert(stat.size > 1000, `Ukuran file ${item.filePath} harus valid (> 1KB)`);
    console.log(`Verifikasi berhasil untuk [${item.device}]: ${item.filePath} (${stat.size} bytes)`);
  }

  console.log('\nSeluruh pengujian verifikasi lolos.');
}

verify().catch((err) => {
  console.error('Pengujian gagal:', err);
  process.exit(1);
});
