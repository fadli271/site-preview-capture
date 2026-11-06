#!/usr/bin/env node

const path = require('path');
const { captureSitePreviews } = require('./capture');
const { DEVICES } = require('./devices');

function showHelp() {
  console.log(`
Penggunaan:
  site-preview <url> [opsi]
  node cli.js <url> [opsi]

Opsi:
  --out <dir>            Direktori penyimpanan file screenshot (default: ./output)
  --full                 Mengambil screenshot seluruh halaman (full page)
  --delay <ms>           Jeda tunggu sebelum screenshot dalam milidetik (default: 500)
  --devices <list>       Daftar perangkat dipisahkan koma (default: desktop,tablet,mobile)
  --chrome <path>        Path kustom eksekusi Google Chrome
  -h, --help             Menampilkan panduan ini

Daftar perangkat yang tersedia:
  ${Object.keys(DEVICES).join(', ')}

Contoh:
  site-preview https://example.com
  site-preview https://example.com --out ./previews --devices mobile,desktop --full
`);
}

function parseArgs(args) {
  const options = {
    url: null,
    outDir: './output',
    fullPage: false,
    delayMs: 500,
    deviceNames: ['desktop', 'tablet', 'mobile'],
    chromePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  };

  let i = 0;
  while (i < args.length) {
    const arg = args[i];

    if (arg === '-h' || arg === '--help') {
      showHelp();
      process.exit(0);
    } else if (arg === '--out') {
      options.outDir = args[++i];
    } else if (arg === '--full') {
      options.fullPage = true;
    } else if (arg === '--delay') {
      options.delayMs = parseInt(args[++i], 10) || 500;
    } else if (arg === '--devices') {
      options.deviceNames = args[++i].split(',').map((s) => s.trim()).filter(Boolean);
    } else if (arg === '--chrome') {
      options.chromePath = args[++i];
    } else if (!arg.startsWith('-') && !options.url) {
      options.url = arg;
    }
    i++;
  }

  return options;
}

async function run() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    showHelp();
    process.exit(1);
  }

  const options = parseArgs(args);

  if (!options.url) {
    console.error('Kesalahan: URL website belum ditentukan.');
    showHelp();
    process.exit(1);
  }

  console.log(`Mengambil tangkapan layar untuk: ${options.url}`);
  console.log(`Target perangkat: ${options.deviceNames.join(', ')}`);
  console.log(`Tampilan penuh: ${options.fullPage ? 'Ya' : 'Tidak'}`);

  try {
    const results = await captureSitePreviews(options);
    console.log('\nTangkapan layar berhasil dibuat:');
    for (const res of results) {
      console.log(`  [${res.device}] ${res.filePath} (${res.durationMs}ms)`);
    }
  } catch (error) {
    console.error('\nTerjadi kesalahan:', error.message);
    process.exit(1);
  }
}

run();
