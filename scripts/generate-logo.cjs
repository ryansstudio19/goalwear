const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// High-fidelity SVG recreation of the uploaded GoalWear metallic logo
const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <defs>
    <!-- Background Vignette -->
    <radialGradient id="bgGlow" cx="50%" cy="50%" r="65%">
      <stop offset="0%" stop-color="#0b0e14" />
      <stop offset="70%" stop-color="#020305" />
      <stop offset="100%" stop-color="#000000" />
    </radialGradient>

    <!-- Bottom subtle neon glow -->
    <radialGradient id="bottomNeonGlow" cx="50%" cy="98%" r="40%">
      <stop offset="0%" stop-color="rgba(0, 255, 136, 0.25)" />
      <stop offset="60%" stop-color="rgba(0, 255, 136, 0.05)" />
      <stop offset="100%" stop-color="rgba(0,0,0,0)" />
    </radialGradient>

    <!-- Chrome Metallic Gradients -->
    <linearGradient id="chromeTop" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f8fafc" />
      <stop offset="20%" stop-color="#cbd5e1" />
      <stop offset="45%" stop-color="#64748b" />
      <stop offset="55%" stop-color="#94a3b8" />
      <stop offset="80%" stop-color="#f1f5f9" />
      <stop offset="100%" stop-color="#475569" />
    </linearGradient>

    <linearGradient id="chromeBevel" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="30%" stop-color="#94a3b8" />
      <stop offset="70%" stop-color="#334155" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>

    <linearGradient id="chromeDark" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#64748b" />
      <stop offset="50%" stop-color="#334155" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>

    <linearGradient id="chromeBottom" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#475569" />
      <stop offset="25%" stop-color="#94a3b8" />
      <stop offset="50%" stop-color="#f8fafc" />
      <stop offset="75%" stop-color="#cbd5e1" />
      <stop offset="100%" stop-color="#334155" />
    </linearGradient>

    <!-- Electric Neon Lime / Volt Accent Gradients -->
    <linearGradient id="neonVolt" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ccff00" />
      <stop offset="50%" stop-color="#00ff88" />
      <stop offset="100%" stop-color="#00cc66" />
    </linearGradient>

    <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <filter id="metalShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#000000" flood-opacity="0.9" />
    </filter>
  </defs>

  <!-- Deep Black Canvas -->
  <rect width="1000" height="1000" fill="#000000" />
  <circle cx="500" cy="500" r="480" fill="url(#bgGlow)" />
  <rect y="700" width="1000" height="300" fill="url(#bottomNeonGlow)" />

  <!-- Main Emblem Group: Stylized Metallic G with Aerodynamic Slits -->
  <g id="emblem" transform="translate(490, 430) skewX(-14) scale(1.05)" filter="url(#metalShadow)">
    <!-- 1. Top Beveled Roof of G -->
    <!-- Outer base shadow block for depth -->
    <path d="M -180,-140 L 170,-140 C 230,-140 260,-100 240,-50 L 195,50 C 185,75 160,95 130,95 L -20,95 C -30,95 -40,90 -45,80 L -80,10 L 40,10 C 60,10 75,0 80,-15 L 105,-75 C 110,-90 95,-100 80,-100 L -120,-100 Z"
          fill="#111827" />

    <!-- Top Roof Chrome Body -->
    <path d="M -190,-150 L 175,-150 C 235,-150 265,-110 245,-60 L 200,40 C 190,65 165,85 135,85 L -10,85 L -35,35 L 45,35 C 65,35 80,25 85,10 L 110,-50 C 115,-65 100,-75 85,-75 L -130,-75 Z"
          fill="url(#chromeTop)" stroke="url(#chromeBevel)" stroke-width="4" stroke-linejoin="round" />

    <!-- Top Left Aerodynamic Speed Fin -->
    <path d="M -210,-150 L -60,-150 L -130,-75 L -260,-75 Z"
          fill="url(#chromeTop)" stroke="url(#chromeBevel)" stroke-width="3" />

    <!-- 2. The Electric Neon Volt Notch Accent inside the G -->
    <path d="M -200,-15 L -60,-15 L -95,25 L -235,25 Z"
          fill="url(#neonVolt)" filter="url(#neonGlow)" />

    <!-- 3. Bottom Claw / Lower Spine of G -->
    <path d="M -270,45 L -75,45 L -20,135 L 150,135 C 210,135 240,175 220,225 L 190,285 C 175,315 140,335 100,335 L -170,335 C -240,335 -270,295 -245,245 L -180,115 L -320,115 Z"
          fill="#0f172a" />

    <!-- Lower Spine Chrome Body -->
    <path d="M -260,35 L -65,35 L -10,125 L 160,125 C 220,125 250,165 230,215 L 200,275 C 185,305 150,325 110,325 L -160,325 C -230,325 -260,285 -235,235 L -170,105 L -310,105 Z"
          fill="url(#chromeBottom)" stroke="url(#chromeBevel)" stroke-width="4" stroke-linejoin="round" />

    <!-- Inner Cutout Reflection Plate -->
    <path d="M -130,255 L 70,255 C 95,255 110,240 115,225 L 130,195 C 135,180 125,170 110,170 L -40,170 L -90,255 Z"
          fill="#090d16" stroke="url(#chromeBevel)" stroke-width="2" />

    <!-- Lower Accent Blade Highlight -->
    <path d="M -180,325 L 110,325 L 85,290 L -140,290 Z"
          fill="url(#chromeDark)" />
    
    <!-- Metallic Specular Edge Shimmers -->
    <line x1="-200" y1="-150" x2="180" y2="-150" stroke="#ffffff" stroke-width="4" stroke-linecap="round" opacity="0.9" />
    <line x1="-260" y1="35" x2="-65" y2="35" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.8" />
    <line x1="-310" y1="105" x2="-170" y2="105" stroke="#ffffff" stroke-width="3" opacity="0.85" />
    <line x1="-160" y1="325" x2="110" y2="325" stroke="#ffffff" stroke-width="4" opacity="0.9" />
  </g>

  <!-- Wordmark "GOALWEAR" with Chrome Finish & Neon 'A' Accent -->
  <g id="wordmark" transform="translate(500, 665)" filter="url(#metalShadow)">
    <text x="0" y="0"
          font-family="'Outfit', 'Inter', 'Arial Black', sans-serif"
          font-size="78"
          font-weight="900"
          letter-spacing="0.12em"
          font-style="italic"
          text-anchor="middle"
          fill="url(#chromeTop)"
          stroke="#1e293b"
          stroke-width="3"
          stroke-linejoin="round">
      GOALWEAR
    </text>
    
    <!-- Top specular shine over letters -->
    <text x="0" y="0"
          font-family="'Outfit', 'Inter', 'Arial Black', sans-serif"
          font-size="78"
          font-weight="900"
          letter-spacing="0.12em"
          font-style="italic"
          text-anchor="middle"
          fill="none"
          stroke="url(#chromeBevel)"
          stroke-width="1.5">
      GOALWEAR
    </text>

    <!-- Neon Volt Triangular Dot inside the letter 'A' (A is at approx x=108, y=-18) -->
    <polygon points="106,-16 117,-16 112,-28" fill="url(#neonVolt)" filter="url(#neonGlow)" />
    <polygon points="-120,-16 -109,-16 -114,-28" fill="url(#neonVolt)" filter="url(#neonGlow)" opacity="0.85" />
  </g>

  <!-- Subtle bottom neon energy line -->
  <path d="M 350,715 L 650,715" stroke="url(#neonVolt)" stroke-width="3" stroke-linecap="round" filter="url(#neonGlow)" opacity="0.8" />
  <circle cx="500" cy="715" r="4" fill="#ffffff" filter="url(#neonGlow)" />
</svg>`;

const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <radialGradient id="iconBg" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#0c1017" />
      <stop offset="100%" stop-color="#000000" />
    </radialGradient>
    <linearGradient id="iconChrome" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="25%" stop-color="#cbd5e1" />
      <stop offset="50%" stop-color="#64748b" />
      <stop offset="75%" stop-color="#f1f5f9" />
      <stop offset="100%" stop-color="#334155" />
    </linearGradient>
    <linearGradient id="iconNeon" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#d9f99d" />
      <stop offset="50%" stop-color="#00ff88" />
      <stop offset="100%" stop-color="#059669" />
    </linearGradient>
    <filter id="iconGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <!-- Dark Rounded Square / App Icon Badge -->
  <rect width="512" height="512" rx="112" fill="url(#iconBg)" stroke="rgba(0,255,136,0.3)" stroke-width="6" />

  <!-- Stylized G Emblem -->
  <g transform="translate(250, 255) skewX(-14) scale(0.72)">
    <!-- Top Roof -->
    <path d="M -190,-150 L 175,-150 C 235,-150 265,-110 245,-60 L 200,40 C 190,65 165,85 135,85 L -10,85 L -35,35 L 45,35 C 65,35 80,25 85,10 L 110,-50 C 115,-65 100,-75 85,-75 L -130,-75 Z"
          fill="url(#iconChrome)" stroke="#ffffff" stroke-width="4" stroke-linejoin="round" />

    <!-- Top Fin -->
    <path d="M -210,-150 L -60,-150 L -130,-75 L -260,-75 Z"
          fill="url(#iconChrome)" stroke="#94a3b8" stroke-width="3" />

    <!-- Electric Neon Notch -->
    <path d="M -200,-15 L -60,-15 L -95,25 L -235,25 Z"
          fill="url(#iconNeon)" filter="url(#iconGlow)" />

    <!-- Lower Claw -->
    <path d="M -260,35 L -65,35 L -10,125 L 160,125 C 220,125 250,165 230,215 L 200,275 C 185,305 150,325 110,325 L -160,325 C -230,325 -260,285 -235,235 L -170,105 L -310,105 Z"
          fill="url(#iconChrome)" stroke="#ffffff" stroke-width="4" stroke-linejoin="round" />

    <!-- Cutout Plate -->
    <path d="M -130,255 L 70,255 C 95,255 110,240 115,225 L 130,195 C 135,180 125,170 110,170 L -40,170 L -90,255 Z"
          fill="#06090e" stroke="#64748b" stroke-width="3" />
  </g>
</svg>`;

async function main() {
  const publicDir = path.join(__dirname, '..', 'public');
  
  // Write SVG files
  fs.writeFileSync(path.join(publicDir, 'goalwear-logo.svg'), logoSvg.trim());
  fs.writeFileSync(path.join(publicDir, 'goalwear-icon.svg'), iconSvg.trim());
  console.log('Written SVG files');

  // Generate PNGs with Sharp
  await sharp(Buffer.from(logoSvg))
    .resize(1024, 1024)
    .png({ quality: 95 })
    .toFile(path.join(publicDir, 'goalwear-logo.png'));
  console.log('Generated goalwear-logo.png');

  await sharp(Buffer.from(iconSvg))
    .resize(512, 512)
    .png({ quality: 95 })
    .toFile(path.join(publicDir, 'goalwear-icon-512.png'));
  console.log('Generated goalwear-icon-512.png');

  // Favicon 64x64 PNG
  await sharp(Buffer.from(iconSvg))
    .resize(64, 64)
    .png()
    .toFile(path.join(publicDir, 'favicon.png'));
  console.log('Generated favicon.png');

  // 1200x630 OpenGraph link preview image with GoalWear Logo & tagline
  const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
    <defs>
      <radialGradient id="ogBg" cx="50%" cy="50%" r="75%">
        <stop offset="0%" stop-color="#0f141c" />
        <stop offset="60%" stop-color="#05070a" />
        <stop offset="100%" stop-color="#000000" />
      </radialGradient>
      <linearGradient id="ogNeon" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ccff00" />
        <stop offset="50%" stop-color="#00ff88" />
        <stop offset="100%" stop-color="#00cc66" />
      </linearGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#ogBg)" />
    
    <!-- Outer subtle neon border glow -->
    <rect x="20" y="20" width="1160" height="590" rx="24" fill="none" stroke="rgba(0,255,136,0.25)" stroke-width="2" />
    
    <!-- Centered Logo -->
    <g transform="translate(100, -80)">
      ${logoSvg.replace('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">', '').replace('</svg>', '')}
    </g>

    <!-- Subtitle / Tagline -->
    <text x="600" y="560" font-family="'Outfit', 'Inter', sans-serif" font-size="20" font-weight="700" letter-spacing="0.25em" fill="#94a3b8" text-anchor="middle">
      PREMIER FOOTBALL JERSEYS •#8226; AUTHENTIC KITS •#8226; BANGLADESH
    </text>
  </svg>`;

  await sharp(Buffer.from(ogSvg))
    .resize(1200, 630)
    .png({ quality: 90 })
    .toFile(path.join(publicDir, 'goalwear-og-preview.png'));
  console.log('Generated goalwear-og-preview.png');
}

main().catch(err => {
  console.error('Error generating assets:', err);
  process.exit(1);
});
