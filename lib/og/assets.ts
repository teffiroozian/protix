import { readFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

// Read public assets directly: no dependency on the deployment's public URL.
// Decode photography before handing it to Satori so corrupt/unsupported images
// take the same placeholder path as missing images. Remote requests are bounded.
export async function loadOgImage(src?: string): Promise<string | undefined> {
  if (!src) return undefined;
  try {
    let bytes: Buffer;
    if (src.startsWith('/') && !src.startsWith('//')) {
      const root = path.join(process.cwd(), 'public');
      const file = path.resolve(root, src.slice(1));
      if (!file.startsWith(`${root}${path.sep}`)) return undefined;
      bytes = await readFile(file);
    } else {
      const url = new URL(src);
      if (url.protocol !== 'https:') return undefined;
      const response = await fetch(url, { signal: AbortSignal.timeout(4000), next: { revalidate: 86400 } });
      if (!response.ok) return undefined;
      bytes = Buffer.from(await response.arrayBuffer());
    }
    const png = await sharp(bytes, { limitInputPixels: 20_000_000 }).resize(800, 500, { fit: 'inside', withoutEnlargement: true }).png().toBuffer();
    return `data:image/png;base64,${png.toString('base64')}`;
  } catch {
    return undefined;
  }
}

export async function loadOgFonts() {
  const [regular, bold, heading] = await Promise.all([
    readFile(path.join(process.cwd(), 'public/fonts/Outfit-Regular.ttf')),
    readFile(path.join(process.cwd(), 'public/fonts/Outfit-Bold.ttf')),
    readFile(path.join(process.cwd(), 'public/fonts/Unbounded-Bold.ttf')),
  ]);
  return [
    { name: 'Outfit', data: regular, weight: 400 as const, style: 'normal' as const },
    { name: 'Outfit', data: bold, weight: 700 as const, style: 'normal' as const },
    { name: 'Unbounded', data: heading, weight: 700 as const, style: 'normal' as const },
  ];
}
