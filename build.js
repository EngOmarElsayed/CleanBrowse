import { build } from 'esbuild';

const targets = [
  ['extension-src/content/main.js', 'extension/content.js'],
  ['extension-src/background/main.js', 'extension/background.js'],
];

for (const [entry, outfile] of targets) {
  await build({ entryPoints: [entry], bundle: true, format: 'iife', outfile });
}

console.log('extension/ built');
