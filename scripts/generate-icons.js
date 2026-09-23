import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';

const outDir = path.resolve('public');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function generateIcon(size, isMaskable = false) {
  const png = new PNG({ width: size, height: size });
  const center = size / 2;
  const radius = isMaskable ? size * 0.42 : size * 0.46;

  // Colors
  // Deep slate background: #0f172a (15, 23, 42)
  // Indigo: #4f46e5 (79, 70, 229)
  // Cyan: #06b6d4 (6, 182, 212)
  // White: (255, 255, 255)

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (size * y + x) << 2;
      const dx = x - center;
      const dy = y - center;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Default background
      let r = 15, g = 23, b = 42, a = 255;

      if (!isMaskable) {
        // Rounded squircle badge
        const cornerR = size * 0.22;
        const inX = Math.abs(x - center) <= (center - cornerR);
        const inY = Math.abs(y - center) <= (center - cornerR);
        let inSquircle = false;
        if (inX || inY) {
          inSquircle = (Math.abs(x - center) <= center * 0.95 && Math.abs(y - center) <= center * 0.95);
        } else {
          const cornerDist = Math.hypot(
            Math.abs(x - center) - (center - cornerR),
            Math.abs(y - center) - (center - cornerR)
          );
          inSquircle = cornerDist <= cornerR;
        }

        if (inSquircle) {
          // Gradient from brand indigo to cyan
          const t = (x + y) / (2 * size);
          r = Math.round(79 * (1 - t) + 6 * t);
          g = Math.round(70 * (1 - t) + 182 * t);
          b = Math.round(229 * (1 - t) + 212 * t);
          a = 255;
        } else {
          a = 0; // transparent outside rounded rect
        }
      } else {
        // Maskable has full bleed background with gradient
        const t = (x + y) / (2 * size);
        r = Math.round(20 * (1 - t) + 40 * t);
        g = Math.round(30 * (1 - t) + 50 * t);
        b = Math.round(70 * (1 - t) + 120 * t);
      }

      // Draw stylized brain hemispheres & synapse dots in the center
      const nx = dx / radius;
      const ny = dy / radius;

      // Outer lobes
      const leftLobe = Math.hypot(nx + 0.32, ny + 0.05) < 0.48;
      const rightLobe = Math.hypot(nx - 0.32, ny + 0.05) < 0.48;
      const topLobe = Math.hypot(nx, ny + 0.28) < 0.38;
      const bottomLobe = Math.hypot(nx, ny - 0.22) < 0.42;

      const isBrain = (leftLobe || rightLobe || topLobe || bottomLobe) && Math.abs(nx) > 0.04;

      // Brain folds pattern
      const wave = Math.sin(nx * 14) * Math.cos(ny * 14);
      if (isBrain && wave > -0.55 && (nx * nx + ny * ny < 0.65)) {
        r = 255;
        g = 255;
        b = 255;
        a = 255;
      }

      // Central glowing node
      if (Math.hypot(nx, ny) < 0.14) {
        r = 56;
        g = 189;
        b = 248; // sky-400
        a = 255;
      }

      png.data[idx] = r;
      png.data[idx + 1] = g;
      png.data[idx + 2] = b;
      png.data[idx + 3] = a;
    }
  }

  return PNG.sync.write(png);
}

fs.writeFileSync(path.join(outDir, 'pwa-192x192.png'), generateIcon(192, false));
fs.writeFileSync(path.join(outDir, 'pwa-512x512.png'), generateIcon(512, false));
fs.writeFileSync(path.join(outDir, 'pwa-maskable-512x512.png'), generateIcon(512, true));
fs.writeFileSync(path.join(outDir, 'apple-touch-icon.png'), generateIcon(180, false));

// Also generate high-definition SVG
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <rect width="100" height="100" rx="24" fill="url(#bgGrad)"/>
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4f46e5"/>
      <stop offset="100%" stop-color="#0891b2"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  <!-- Brain Icon -->
  <path d="M48 24C41 24 35 28 33 33C29 34 26 38 26 43C26 48 29 52 33 54C32 58 34 63 38 66C41 68 45 68 48 67M52 24C59 24 65 28 67 33C71 34 74 38 74 43C74 48 71 52 67 54C68 58 66 63 62 66C59 68 55 68 52 67" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Central Synapse Pulse -->
  <circle cx="50" cy="46" r="5" fill="#38bdf8" filter="url(#glow)"/>
  <path d="M44 38L50 46L56 38M42 52L50 46L58 52M50 28V46V64" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"/>
</svg>`;

fs.writeFileSync(path.join(outDir, 'icon.svg'), svgContent);
console.log('Icons generated successfully!');
