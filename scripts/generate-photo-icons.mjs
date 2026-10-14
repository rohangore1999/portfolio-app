import { readFile, writeFile } from 'node:fs/promises';
import { createElement } from 'react';
import { ImageResponse } from 'next/og.js';

// Render the existing homepage photo into square site icons. The source photo
// stays untouched; this layout frames the face for a small favicon.
const photo = await readFile(new URL('../public/images/home/hero-section-web.jpg', import.meta.url));
const src = `data:image/jpeg;base64,${photo.toString('base64')}`;
const crop = { left: 540, top: 590, size: 520 };

for (const [filename, size] of [['icon.png', 512], ['apple-icon.png', 180]]) {
  const scale = size / crop.size;
  const response = new ImageResponse(
    createElement('div', {
      style: { display: 'flex', position: 'relative', width: size, height: size, overflow: 'hidden', backgroundColor: '#080808' },
    }, createElement('img', {
      src,
      width: 1440 * scale,
      height: 1920 * scale,
      style: { position: 'absolute', left: -crop.left * scale, top: -crop.top * scale },
    })),
    { width: size, height: size },
  );
  await writeFile(new URL(`../src/app/${filename}`, import.meta.url), Buffer.from(await response.arrayBuffer()));
  console.log(`Generated ${filename}: ${size} × ${size}`);
}
