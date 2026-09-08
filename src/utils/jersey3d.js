import * as THREE from 'three';

/**
 * GoalWear 3D Authentic Jersey Engine
 * 
 * Physically accurate anatomical garment geometry and ultra-high-resolution
 * 2048x2048 texture generator for:
 * 1. Argentina 2026 World Cup Edition (3-Star Gold Crest, FIFA World Champions Shield, Adidas Gold)
 * 2. Real Madrid 25/26 Royal Edition (Emirates Fly Better, Real Madrid Crest, Gold Flank Piping, Houndstooth)
 * 3. FC Barcelona 25/26 Special Edition (Blaugrana Lightning Stripes, Yellow Spotify Emblem, Barca Crest)
 * 4. Brazil 2026 World Cup Edition (Canarinho Jacquard, 5-Star CBF Brasil Crest, Mint/Navy Wave Flanks)
 */

export function createRealisticJerseyGeometry() {
  const radialSegments = 36;
  const heightSegments = 28;
  const torsoHeight = 2.45; // -1.22 to 1.23
  
  const vertices = [];
  const uvs = [];
  const indices = [];

  for (let yIdx = 0; yIdx <= heightSegments; yIdx++) {
    const v = yIdx / heightSegments; // 0 (bottom hem) to 1 (shoulders/neck)
    const y = -1.22 + v * torsoHeight;

    // Anatomical contour: waist taper, chest flare, shoulder taper
    let widthRadius = 0.94;
    let depthRadius = 0.42;

    if (v < 0.15) {
      // Bottom hem: slight flare
      widthRadius = 0.95 + Math.sin(v * Math.PI) * 0.03;
      depthRadius = 0.43;
    } else if (v < 0.52) {
      // Athletic waist taper
      const waist = Math.sin(((v - 0.15) / 0.37) * Math.PI);
      widthRadius = 0.95 - waist * 0.08;
      depthRadius = 0.43 - waist * 0.045;
    } else if (v < 0.85) {
      // Chest expansion & latissimus volume
      const chest = Math.sin(((v - 0.52) / 0.33) * Math.PI * 0.5);
      widthRadius = 0.87 + chest * 0.18;
      depthRadius = 0.385 + chest * 0.125;
    } else {
      // Sloped shoulders inward toward neck opening
      const shoulder = (v - 0.85) / 0.15;
      widthRadius = 1.05 - shoulder * 0.40;
      depthRadius = 0.51 - shoulder * 0.18;
    }

    // Drop-tail curved hem (curved down at front center and back center)
    const hemCurve = v < 0.22 ? Math.cos((v / 0.22) * (Math.PI / 2)) * -0.055 : 0;

    for (let xIdx = 0; xIdx <= radialSegments; xIdx++) {
      const u = xIdx / radialSegments;
      // Precise UV coordinate mapping:
      // u = 0.25 is FRONT CENTER (facing camera, positive Z)
      // u = 0.75 is BACK CENTER (negative Z)
      // u = 0.0 and 1.0 is Right Seam, u = 0.5 is Left Seam
      const phi = (u - 0.25) * Math.PI * 2;
      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);

      // Pectoral front volume when cosPhi > 0.2 and v between 0.55 and 0.82
      let chestBulge = 0;
      if (cosPhi > 0.25 && v > 0.55 && v < 0.82) {
        chestBulge = cosPhi * Math.sin(((v - 0.55) / 0.27) * Math.PI) * 0.07;
      }

      // Neck drop at center front (cosPhi near 1 at top)
      let neckDip = 0;
      if (v > 0.84 && cosPhi > 0.1) {
        neckDip = cosPhi * (v - 0.84) * -0.16;
      }

      const vx = sinPhi * widthRadius;
      const vy = y + (cosPhi * cosPhi) * hemCurve + neckDip;
      const vz = cosPhi * depthRadius + chestBulge;

      vertices.push(vx, vy, vz);
      uvs.push(u, v);
    }
  }

  for (let yIdx = 0; yIdx < heightSegments; yIdx++) {
    for (let xIdx = 0; xIdx < radialSegments; xIdx++) {
      const a = yIdx * (radialSegments + 1) + xIdx;
      const b = (yIdx + 1) * (radialSegments + 1) + xIdx;
      const c = (yIdx + 1) * (radialSegments + 1) + (xIdx + 1);
      const d = yIdx * (radialSegments + 1) + (xIdx + 1);

      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  const torsoGeometry = new THREE.BufferGeometry();
  torsoGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  torsoGeometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  torsoGeometry.setIndex(indices);
  torsoGeometry.computeVertexNormals();

  // Collar geometry (Elliptical ribbed ring)
  const collarCurve = new THREE.EllipseCurve(0, 0, 0.44, 0.29, 0, 2 * Math.PI, false, 0);
  const collarPoints = collarCurve.getPoints(36).map(p => new THREE.Vector3(p.x, 0, p.y));
  const collarPath = new THREE.CatmullRomCurve3(collarPoints, true);
  const collarGeometry = new THREE.TubeGeometry(collarPath, 36, 0.048, 8, true);

  // Raglan sleeves
  function createSleeveGeometry(isLeft = false) {
    const sleeveLength = 1.15;
    const radial = 24;
    const slices = 14;
    const sVertices = [];
    const sUvs = [];
    const sIndices = [];

    const dir = isLeft ? -1 : 1;

    for (let sIdx = 0; sIdx <= slices; sIdx++) {
      const v = sIdx / slices;
      const center = new THREE.Vector3(
        dir * (0.86 + v * 0.74),
        1.16 - v * 0.70,
        -0.02 + v * 0.09
      );

      const rX = 0.38 - v * 0.085;
      const rY = 0.32 - v * 0.065;

      for (let rIdx = 0; rIdx <= radial; rIdx++) {
        const u = rIdx / radial;
        const angle = u * Math.PI * 2;

        const lx = Math.cos(angle) * rX * 0.86;
        const ly = Math.sin(angle) * rY;
        const lz = (Math.cos(angle) * 0.18 + Math.sin(angle) * 0.82) * 0.28;

        sVertices.push(center.x + lx, center.y + ly, center.z + lz);
        sUvs.push(u, v);
      }
    }

    for (let sIdx = 0; sIdx < slices; sIdx++) {
      for (let rIdx = 0; rIdx < radial; rIdx++) {
        const a = sIdx * (radial + 1) + rIdx;
        const b = (sIdx + 1) * (radial + 1) + rIdx;
        const c = (sIdx + 1) * (radial + 1) + (rIdx + 1);
        const d = sIdx * (radial + 1) + (rIdx + 1);

        if (isLeft) {
          sIndices.push(a, d, b);
          sIndices.push(b, d, c);
        } else {
          sIndices.push(a, b, d);
          sIndices.push(b, c, d);
        }
      }
    }

    const sleeveGeo = new THREE.BufferGeometry();
    sleeveGeo.setAttribute('position', new THREE.Float32BufferAttribute(sVertices, 3));
    sleeveGeo.setAttribute('uv', new THREE.Float32BufferAttribute(sUvs, 2));
    sleeveGeo.setIndex(sIndices);
    sleeveGeo.computeVertexNormals();
    return sleeveGeo;
  }

  function createCuffBand(isLeft = false) {
    const dir = isLeft ? -1 : 1;
    const cuffCurve = new THREE.EllipseCurve(0, 0, 0.31, 0.26, 0, 2 * Math.PI, false, 0);
    const pts = cuffCurve.getPoints(24).map(p => new THREE.Vector3(p.x, p.y, 0));
    const path = new THREE.CatmullRomCurve3(pts, true);
    const cuffGeo = new THREE.TubeGeometry(path, 24, 0.038, 8, true);

    return {
      cuffGeo,
      pos: new THREE.Vector3(dir * 1.58, 0.47, 0.07),
      rot: new THREE.Euler(0.2, dir * 0.65, dir * -0.65),
    };
  }

  return {
    torsoGeometry,
    collarGeometry,
    collarPos: new THREE.Vector3(0, 1.23, 0.035),
    collarRot: new THREE.Euler(-0.25, 0, 0),
    leftSleeveGeometry: createSleeveGeometry(true),
    rightSleeveGeometry: createSleeveGeometry(false),
    leftCuff: createCuffBand(true),
    rightCuff: createCuffBand(false),
  };
}

/**
 * Generates an ultra-high-resolution, authentic 2048x2048 Torso Fabric Texture
 * Composites the real high-definition jersey photo seamlessly onto the front UV region
 * alongside authentic vector crests, sponsors, weave patterns, and back typography.
 */
export function generateKitCanvasTexture(kitId, imageSrc, onTextureReady) {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 2048;
  const ctx = canvas.getContext('2d');

  if (!ctx) return null;

  // Render base authentic high-detail pattern immediately
  renderKitBaseAndArtwork(ctx, kitId);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 16;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;

  // Seamlessly composite the real high-definition jersey photo into the front UV zone
  if (imageSrc) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        compositeRealPhotoOnJersey(ctx, img, kitId);
        texture.needsUpdate = true;
        if (onTextureReady) onTextureReady();
      } catch (err) {
        console.warn('Real jersey photo compositing fallback:', err);
      }
    };
    img.onerror = () => {
      // If network fails, base vector artwork is already active
    };
    img.src = imageSrc;
  }

  return texture;
}

/**
 * Generates matching sleeve textures with authentic shoulder stripes/crests
 */
export function generateSleeveCanvasTexture(kitId) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  if (!ctx) return null;

  if (kitId === 'arg-home-2026') {
    // Argentina: Pure white sleeve with 3 black Adidas stripes & FIFA World Cup badge
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 1024, 1024);

    // 3 Black shoulder stripes
    ctx.fillStyle = '#111827';
    for (let s = 0; s < 3; s++) {
      ctx.fillRect(180 + s * 45, 0, 26, 680);
    }

    // FIFA Unites the World sleeve badge
    ctx.fillStyle = '#0055a5';
    ctx.fillRect(620, 360, 220, 160);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 30px "Montserrat", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('FOOTBALL', 730, 415);
    ctx.fillText('UNITES', 730, 455);
    ctx.font = 'bold 22px "Montserrat", sans-serif';
    ctx.fillText('FIFA', 730, 495);

    // Cuff trim
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 930, 1024, 60);
    ctx.fillStyle = '#74acdf';
    ctx.fillRect(0, 990, 1024, 34);
  } else if (kitId === 'rm-home-25/26') {
    // Real Madrid: White with 3 black stripes & HP sponsor circle
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 1024, 1024);

    // 3 Black shoulder stripes
    ctx.fillStyle = '#111827';
    for (let s = 0; s < 3; s++) {
      ctx.fillRect(180 + s * 45, 0, 26, 680);
    }

    // Gold piping along arm seam
    ctx.fillStyle = '#e5c158';
    ctx.fillRect(80, 0, 8, 1024);

    // HP sleeve circle badge
    ctx.beginPath();
    ctx.arc(730, 440, 90, 0, Math.PI * 2);
    ctx.fillStyle = '#0e1626';
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'italic 900 86px "Montserrat", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('hp', 730, 470);
  } else if (kitId === 'barca-home-25/26') {
    // FC Barcelona: Blaugrana lightning stripes & Ambilight TV badge
    ctx.fillStyle = '#004d98';
    ctx.fillRect(0, 0, 1024, 1024);

    // Crimson lightning diagonal streaks
    ctx.fillStyle = '#a50044';
    for (let i = -2; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo(i * 240, 0);
      ctx.lineTo(i * 240 + 200, 450);
      ctx.lineTo(i * 240 + 130, 1024);
      ctx.lineTo(i * 240 + 40, 1024);
      ctx.lineTo(i * 240 + 110, 450);
      ctx.lineTo(i * 240 - 90, 0);
      ctx.closePath();
      ctx.fill();
    }

    // Yellow Ambilight TV sponsor
    ctx.fillStyle = '#ffdd00';
    ctx.font = '900 48px "Montserrat", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('AMBI', 740, 440);
    ctx.font = 'bold 28px "Montserrat", sans-serif';
    ctx.fillText('LIGHT TV', 740, 480);

    // Crimson Red Cuff
    ctx.fillStyle = '#a50044';
    ctx.fillRect(0, 930, 1024, 94);
  } else {
    // Brazil: Canary yellow with dark navy cuff & green Nike swoosh
    ctx.fillStyle = '#fedd00';
    ctx.fillRect(0, 0, 1024, 1024);

    // Tonal wave knit
    ctx.strokeStyle = 'rgba(230, 190, 0, 0.45)';
    ctx.lineWidth = 4;
    for (let y = 0; y < 1024; y += 40) {
      ctx.beginPath();
      for (let x = 0; x <= 1024; x += 30) {
        const cy = y + Math.sin((x + y) * 0.05) * 8;
        if (x === 0) ctx.moveTo(x, cy);
        else ctx.lineTo(x, cy);
      }
      ctx.stroke();
    }

    // Green Nike Swoosh on sleeve
    drawNikeSwoosh(ctx, 730, 440, 120, '#007a33');

    // Navy cuff
    ctx.fillStyle = '#0c2340';
    ctx.fillRect(0, 930, 1024, 94);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Composite the real photographed jersey onto the front UV chest region (x: 0 - 1024, y: 140 - 1950)
 * Uses soft edge feathering so it integrates with 3D lighting without hard borders.
 */
function compositeRealPhotoOnJersey(ctx, img, kitId) {
  // Create an offscreen canvas to process the real jersey crop
  const offCanvas = document.createElement('canvas');
  offCanvas.width = 1024;
  offCanvas.height = 2048;
  const offCtx = offCanvas.getContext('2d');

  if (!offCtx) return;

  // Determine crop box from real photo (center torso region where jersey sits)
  // Most user photos have the hanger at top 8% and sides showing curtains/grass.
  // We crop the clean center jersey torso: sx ~ 18%, sy ~ 12%, sw ~ 64%, sh ~ 82%
  const imgW = img.naturalWidth || img.width;
  const imgH = img.naturalHeight || img.height;

  const srcX = imgW * 0.16;
  const srcY = imgH * 0.13;
  const srcW = imgW * 0.68;
  const srcH = imgH * 0.83;

  // Draw into front UV area (x = 30 to 994, y = 140 to 1960)
  const destX = 30;
  const destY = 140;
  const destW = 964;
  const destH = 1820;

  // Draw image with smooth scaling
  offCtx.imageSmoothingEnabled = true;
  offCtx.imageSmoothingQuality = 'high';
  offCtx.drawImage(img, srcX, srcY, srcW, srcH, destX, destY, destW, destH);

  // Apply soft edge feathering mask so seams wrap naturally around the ribs
  offCtx.globalCompositeOperation = 'destination-in';
  const maskGrad = offCtx.createLinearGradient(0, 0, 1024, 0);
  maskGrad.addColorStop(0.0, 'rgba(0,0,0,0)');
  maskGrad.addColorStop(0.06, 'rgba(0,0,0,1)');
  maskGrad.addColorStop(0.94, 'rgba(0,0,0,1)');
  maskGrad.addColorStop(1.0, 'rgba(0,0,0,0)');
  offCtx.fillStyle = maskGrad;
  offCtx.fillRect(0, 0, 1024, 2048);

  const topMaskGrad = offCtx.createLinearGradient(0, 0, 0, 2048);
  topMaskGrad.addColorStop(0.0, 'rgba(0,0,0,0)');
  topMaskGrad.addColorStop(0.08, 'rgba(0,0,0,1)');
  topMaskGrad.addColorStop(0.95, 'rgba(0,0,0,1)');
  topMaskGrad.addColorStop(1.0, 'rgba(0,0,0,0)');
  offCtx.fillStyle = topMaskGrad;
  offCtx.fillRect(0, 0, 1024, 2048);

  // Paint composited real photo onto main canvas front region
  ctx.save();
  ctx.globalAlpha = 0.94;
  ctx.drawImage(offCanvas, 0, 0);
  ctx.restore();
}

/**
 * Base high-detail vector kit artwork with authentic crests, sponsors, and textures
 */
function renderKitBaseAndArtwork(ctx, kitId) {
  // Clear canvas
  ctx.clearRect(0, 0, 2048, 2048);

  if (kitId === 'arg-home-2026') {
    renderArgentinaAuthenticKit(ctx);
  } else if (kitId === 'rm-home-25/26') {
    renderRealMadridAuthenticKit(ctx);
  } else if (kitId === 'barca-home-25/26') {
    renderBarcelonaAuthenticKit(ctx);
  } else {
    renderBrazilAuthenticKit(ctx);
  }

  // Micro-mesh woven fabric tactile pattern pass
  applyMicroMeshKnit(ctx);
}

// -------------------------------------------------------------
// 1. ARGENTINA 2026 WORLD CUP HOME EDITION
// -------------------------------------------------------------
function renderArgentinaAuthenticKit(ctx) {
  // Both Front (0 - 1024) and Back (1024 - 2048) have Sky Blue & White vertical stripes
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 2048, 2048);

  // 3 Sky Blue vertical stripes on front (center at 512, sides at 190 and 834)
  const stripeW = 190;
  const skyBlue = '#74acdf';

  // Front stripes
  [190, 512, 834].forEach(centerX => {
    ctx.fillStyle = skyBlue;
    ctx.fillRect(centerX - stripeW / 2, 0, stripeW, 2048);
    // Gradient edge stippling
    drawStripeFade(ctx, centerX - stripeW / 2, 0, 24, 2048, true);
    drawStripeFade(ctx, centerX + stripeW / 2 - 24, 0, 24, 2048, false);
  });

  // Back stripes (center at 1536, sides at 1214 and 1858)
  [1214, 1536, 1858].forEach(centerX => {
    ctx.fillStyle = skyBlue;
    ctx.fillRect(centerX - stripeW / 2, 0, stripeW, 2048);
    drawStripeFade(ctx, centerX - stripeW / 2, 0, 24, 2048, true);
    drawStripeFade(ctx, centerX + stripeW / 2 - 24, 0, 24, 2048, false);
  });

  // Shoulders: 3 Black Adidas stripes across upper chest
  ctx.fillStyle = '#111827';
  for (let i = 0; i < 3; i++) {
    ctx.fillRect(80 + i * 40, 120, 22, 280);
    ctx.fillRect(900 - i * 40, 120, 22, 280);
  }

  // FRONT CHEST DETAILS:
  // Golden Adidas 3-Bars Logo (Screen Left: x ≈ 310, y ≈ 690)
  drawAdidas3Bars(ctx, 310, 690, 80, '#ffd700');

  // Golden FIFA World Champions 2022 Shield (Front Center: x = 512, y = 690)
  drawFifaWorldChampionsShield(ctx, 512, 690, 130);

  // Official AFA 3-Stars Gold Crest (Screen Right: x ≈ 714, y = 690)
  drawAuthenticAfaCrest(ctx, 714, 690, 160);

  // BACK DETAILS:
  // Gold MESSI 10
  ctx.fillStyle = '#ffd700';
  ctx.font = '900 68px "Montserrat", sans-serif';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '12px';
  ctx.fillText('MESSI', 1536, 760);

  ctx.font = '900 280px "Montserrat", sans-serif';
  ctx.fillText('10', 1536, 1120);

  ctx.font = 'bold 32px "Montserrat", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.letterSpacing = '6px';
  ctx.fillText('AEROREADY • 3★ WORLD CHAMPIONS', 1536, 1360);
}

// -------------------------------------------------------------
// 2. REAL MADRID 25/26 ROYAL EDITION
// -------------------------------------------------------------
function renderRealMadridAuthenticKit(ctx) {
  // Royal White base
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 2048, 2048);

  // Subtle houndstooth jacquard micro-pattern
  ctx.fillStyle = 'rgba(235, 238, 242, 0.65)';
  for (let y = 0; y < 2048; y += 32) {
    for (let x = 0; x < 2048; x += 32) {
      if ((x + y) % 64 === 0) {
        ctx.fillRect(x, y, 16, 16);
      }
    }
  }

  // Flank Gold Contour Piping & Slate Ventilation Panels
  // Front flanks
  drawRealMadridFlankPanel(ctx, 60, true);
  drawRealMadridFlankPanel(ctx, 964, false);
  // Back flanks
  drawRealMadridFlankPanel(ctx, 1084, true);
  drawRealMadridFlankPanel(ctx, 1988, false);

  // 3 Black Adidas stripes across shoulders
  ctx.fillStyle = '#111827';
  for (let i = 0; i < 3; i++) {
    ctx.fillRect(90 + i * 40, 120, 22, 280);
    ctx.fillRect(890 - i * 40, 120, 22, 280);
  }

  // FRONT CHEST DETAILS:
  // Black Adidas 3-Bars Logo (Screen Left: x ≈ 310, y ≈ 680)
  drawAdidas3Bars(ctx, 310, 680, 80, '#111827');

  // Official Real Madrid Full-Color Crest (Screen Right: x ≈ 714, y = 680)
  drawAuthenticRealMadridCrest(ctx, 714, 680, 160);

  // "Emirates FLY BETTER" Sponsor (Front Center: x = 512, y ≈ 1040)
  ctx.fillStyle = '#0e1626';
  ctx.font = '900 105px "Montserrat", sans-serif';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '12px';
  ctx.fillText('Emirates', 512, 1020);

  ctx.font = '700 48px "Montserrat", sans-serif';
  ctx.letterSpacing = '16px';
  ctx.fillText('FLY BETTER', 512, 1090);

  // BACK DETAILS:
  // BELLINGHAM 5 in Dark Navy with Gold Sheen
  ctx.fillStyle = '#0e1626';
  ctx.font = '900 66px "Montserrat", sans-serif';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '10px';
  ctx.fillText('BELLINGHAM', 1536, 760);

  ctx.font = '900 300px "Montserrat", sans-serif';
  ctx.fillText('5', 1536, 1140);
}

// -------------------------------------------------------------
// 3. FC BARCELONA 25/26 SPECIAL EDITION BLAUGRANA
// -------------------------------------------------------------
function renderBarcelonaAuthenticKit(ctx) {
  // Deep Blau base
  ctx.fillStyle = '#004d98';
  ctx.fillRect(0, 0, 2048, 2048);

  // Dynamic Crimson Grana lightning zig-zag stripes across Front and Back
  ctx.fillStyle = '#a50044';
  const drawLightningBand = (startX) => {
    ctx.beginPath();
    ctx.moveTo(startX, 0);
    ctx.lineTo(startX + 180, 520);
    ctx.lineTo(startX + 90, 1150);
    ctx.lineTo(startX + 220, 2048);
    ctx.lineTo(startX + 80, 2048);
    ctx.lineTo(startX - 50, 1150);
    ctx.lineTo(startX + 40, 520);
    ctx.lineTo(startX - 140, 0);
    ctx.closePath();
    ctx.fill();
  };

  // Front bands
  [180, 512, 840].forEach(bx => drawLightningBand(bx));
  // Back bands
  [1204, 1536, 1868].forEach(bx => drawLightningBand(bx));

  // Cyan/Sky Blue lightning splinter streaks
  ctx.strokeStyle = '#54b5ff';
  ctx.lineWidth = 10;
  [160, 490, 820, 1184, 1516, 1848].forEach(sx => {
    ctx.beginPath();
    ctx.moveTo(sx, 100);
    ctx.lineTo(sx + 120, 550);
    ctx.lineTo(sx + 40, 1100);
    ctx.stroke();
  });

  // Vertical rain/brush texture pass
  ctx.strokeStyle = 'rgba(0, 77, 152, 0.45)';
  ctx.lineWidth = 3;
  for (let x = 0; x < 2048; x += 12) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 2048);
    ctx.stroke();
  }

  // FRONT CHEST DETAILS:
  // Bright Yellow Nike Swoosh (Screen Left: x ≈ 310, y ≈ 680)
  drawNikeSwoosh(ctx, 310, 680, 100, '#ffdd00');

  // Official FC Barcelona Full Crest (Screen Right: x ≈ 714, y ≈ 680)
  drawAuthenticBarcaCrest(ctx, 714, 680, 160);

  // Iconic Circular Yellow Spotify Emblem (Front Center: x = 512, y ≈ 1040)
  drawSpotifyCircularEmblem(ctx, 512, 1040, 130);

  // BACK DETAILS:
  // Yellow LAMINE YAMAL 19
  ctx.fillStyle = '#ffdd00';
  ctx.font = '900 64px "Montserrat", sans-serif';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '10px';
  ctx.fillText('LAMINE YAMAL', 1536, 760);

  ctx.font = '900 280px "Montserrat", sans-serif';
  ctx.fillText('19', 1536, 1120);
}

// -------------------------------------------------------------
// 4. BRAZIL 2026 WORLD CUP HOME EDITION
// -------------------------------------------------------------
function renderBrazilAuthenticKit(ctx) {
  // Canary Yellow (Canarinho) base
  ctx.fillStyle = '#fedd00';
  ctx.fillRect(0, 0, 2048, 2048);

  // Tonal Animalier Jaguar/Wave Jacquard Knit Weave
  ctx.strokeStyle = 'rgba(235, 185, 0, 0.35)';
  ctx.lineWidth = 5;
  for (let y = 0; y < 2048; y += 38) {
    ctx.beginPath();
    for (let x = 0; x <= 2048; x += 30) {
      const cy = y + Math.sin((x * 0.04) + (y * 0.02)) * 10;
      if (x === 0) ctx.moveTo(x, cy);
      else ctx.lineTo(x, cy);
    }
    ctx.stroke();
  }

  // Mint/Cyan Curved Flank Panels with Dark Navy Piping
  drawBrazilWaveFlank(ctx, 50, true);
  drawBrazilWaveFlank(ctx, 974, false);
  drawBrazilWaveFlank(ctx, 1074, true);
  drawBrazilWaveFlank(ctx, 1998, false);

  // Dark navy crew neck insert
  ctx.fillStyle = '#0c2340';
  ctx.beginPath();
  ctx.arc(512, 160, 90, 0, Math.PI);
  ctx.fill();

  // FRONT CHEST DETAILS:
  // Forest Green Nike Swoosh (Screen Left: x ≈ 310, y ≈ 680)
  drawNikeSwoosh(ctx, 310, 680, 100, '#007a33');

  // Official CBF Brasil 5-Star Crest (Screen Right: x ≈ 714, y ≈ 680)
  drawAuthenticBrasilCrest(ctx, 714, 680, 160);

  // BACK DETAILS:
  // Green VINI JR. 7
  ctx.fillStyle = '#007a33';
  ctx.font = '900 68px "Montserrat", sans-serif';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '12px';
  ctx.fillText('VINI JR.', 1536, 760);

  ctx.font = '900 300px "Montserrat", sans-serif';
  ctx.fillText('7', 1536, 1140);

  ctx.font = 'bold 30px "Montserrat", sans-serif';
  ctx.fillStyle = '#0c2340';
  ctx.letterSpacing = '6px';
  ctx.fillText('5★ PENTACAMPEÃO • DRI-FIT ADV', 1536, 1360);
}

// -------------------------------------------------------------
// BADGE & LOGO VECTOR RENDERERS (AUTHENTIC QUALITY)
// -------------------------------------------------------------

function drawAdidas3Bars(ctx, cx, cy, width, color) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.fillStyle = color;

  // 3 Angled slanting bars forming iconic modern triangle
  const h = width * 0.65;
  const barW = width * 0.22;
  const gap = width * 0.08;
  const slope = -width * 0.45;

  // Bar 1 (Shortest, left)
  ctx.beginPath();
  ctx.moveTo(-width * 0.45, h * 0.35);
  ctx.lineTo(-width * 0.45 + barW, h * 0.35);
  ctx.lineTo(-width * 0.45 + barW + slope * 0.35, -h * 0.05);
  ctx.lineTo(-width * 0.45 + slope * 0.35, -h * 0.05);
  ctx.closePath();
  ctx.fill();

  // Bar 2 (Medium, center)
  ctx.beginPath();
  ctx.moveTo(-width * 0.15, h * 0.35);
  ctx.lineTo(-width * 0.15 + barW, h * 0.35);
  ctx.lineTo(-width * 0.15 + barW + slope * 0.65, -h * 0.35);
  ctx.lineTo(-width * 0.15 + slope * 0.65, -h * 0.35);
  ctx.closePath();
  ctx.fill();

  // Bar 3 (Tallest, right)
  ctx.beginPath();
  ctx.moveTo(width * 0.15, h * 0.35);
  ctx.lineTo(width * 0.15 + barW, h * 0.35);
  ctx.lineTo(width * 0.15 + barW + slope * 1.0, -h * 0.68);
  ctx.lineTo(width * 0.15 + slope * 1.0, -h * 0.68);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

function drawNikeSwoosh(ctx, cx, cy, width, color) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.fillStyle = color;

  ctx.beginPath();
  ctx.moveTo(-width * 0.45, -width * 0.15);
  ctx.quadraticCurveTo(-width * 0.05, width * 0.32, width * 0.45, -width * 0.28);
  ctx.quadraticCurveTo(width * 0.1, width * 0.12, -width * 0.15, width * 0.08);
  ctx.quadraticCurveTo(-width * 0.35, 0, -width * 0.45, -width * 0.15);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

function drawFifaWorldChampionsShield(ctx, cx, cy, size) {
  ctx.save();
  ctx.translate(cx, cy);

  // Golden Shield base
  ctx.beginPath();
  ctx.moveTo(-size * 0.45, -size * 0.48);
  ctx.lineTo(size * 0.45, -size * 0.48);
  ctx.lineTo(size * 0.45, size * 0.15);
  ctx.quadraticCurveTo(size * 0.4, size * 0.58, 0, size * 0.66);
  ctx.quadraticCurveTo(-size * 0.4, size * 0.58, -size * 0.45, size * 0.15);
  ctx.closePath();

  // Metallic Gold Gradient
  const grad = ctx.createLinearGradient(-size * 0.45, -size * 0.48, size * 0.45, size * 0.66);
  grad.addColorStop(0, '#f9e186');
  grad.addColorStop(0.5, '#c59b27');
  grad.addColorStop(1, '#8f6a15');
  ctx.fillStyle = grad;
  ctx.fill();

  ctx.lineWidth = 6;
  ctx.strokeStyle = '#ffeaa7';
  ctx.stroke();

  // World Cup Trophy Silhouette
  ctx.fillStyle = '#684a0a';
  ctx.beginPath();
  ctx.arc(0, -size * 0.15, size * 0.16, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillRect(-size * 0.08, -size * 0.1, size * 0.16, size * 0.3);

  // FIFA & 2022 Text
  ctx.fillStyle = '#ffeaa7';
  ctx.font = 'bold 22px "Montserrat", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('FIFA', 0, size * 0.32);
  ctx.font = '900 16px "Montserrat", sans-serif';
  ctx.fillText('2022', 0, size * 0.46);

  ctx.restore();
}

function drawAuthenticAfaCrest(ctx, cx, cy, size) {
  ctx.save();
  ctx.translate(cx, cy);

  // 3 Gold Embroidered Stars
  ctx.fillStyle = '#ffd700';
  [-1, 0, 1].forEach(pos => {
    const starY = pos === 0 ? -size * 0.62 : -size * 0.54;
    draw5PtStar(ctx, pos * 44, starY, 16);
  });

  // Shield Body
  ctx.beginPath();
  ctx.moveTo(-size * 0.4, -size * 0.38);
  ctx.lineTo(size * 0.4, -size * 0.38);
  ctx.lineTo(size * 0.4, size * 0.12);
  ctx.quadraticCurveTo(size * 0.35, size * 0.52, 0, size * 0.58);
  ctx.quadraticCurveTo(-size * 0.35, size * 0.52, -size * 0.4, size * 0.12);
  ctx.closePath();

  ctx.fillStyle = '#0f172a';
  ctx.fill();
  ctx.lineWidth = 7;
  ctx.strokeStyle = '#ffd700';
  ctx.stroke();

  // Sky Blue and White inner stripes
  ctx.save();
  ctx.clip();
  const innerW = size * 0.8;
  const sw = innerW / 5;
  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#74acdf' : '#ffffff';
    ctx.fillRect(-innerW / 2 + i * sw, -size * 0.38, sw, size);
  }
  ctx.restore();

  // Gold Laurels & AFA Monogram
  ctx.fillStyle = '#ffd700';
  ctx.font = '900 52px "Montserrat", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('AFA', 0, size * 0.18);

  ctx.restore();
}

function drawAuthenticRealMadridCrest(ctx, cx, cy, size) {
  ctx.save();
  ctx.translate(cx, cy);

  // Royal Golden Crown with Jewels on top
  ctx.fillStyle = '#ffd700';
  ctx.beginPath();
  ctx.moveTo(-size * 0.34, -size * 0.32);
  ctx.lineTo(size * 0.34, -size * 0.32);
  ctx.lineTo(size * 0.28, -size * 0.60);
  ctx.lineTo(size * 0.12, -size * 0.44);
  ctx.lineTo(0, -size * 0.68);
  ctx.lineTo(-size * 0.12, -size * 0.44);
  ctx.lineTo(-size * 0.28, -size * 0.60);
  ctx.closePath();
  ctx.fill();

  // Circular Badge
  ctx.beginPath();
  ctx.arc(0, size * 0.05, size * 0.38, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.lineWidth = 8;
  ctx.strokeStyle = '#ffd700';
  ctx.stroke();

  // Purple/Blue Diagonal Sash
  ctx.save();
  ctx.beginPath();
  ctx.arc(0, size * 0.05, size * 0.36, 0, Math.PI * 2);
  ctx.clip();

  ctx.fillStyle = '#5b21b6';
  ctx.beginPath();
  ctx.moveTo(-size * 0.4, -size * 0.15);
  ctx.lineTo(size * 0.4, size * 0.35);
  ctx.lineTo(size * 0.4, size * 0.58);
  ctx.lineTo(-size * 0.4, 0.08);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Golden MCF Monogram
  ctx.fillStyle = '#ffd700';
  ctx.font = '900 56px "Montserrat", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('MCF', 0, size * 0.18);

  ctx.restore();
}

function drawAuthenticBarcaCrest(ctx, cx, cy, size) {
  ctx.save();
  ctx.translate(cx, cy);

  // Distinctive Barca Shield with Top 3 Points
  ctx.beginPath();
  ctx.moveTo(0, -size * 0.48);
  ctx.lineTo(size * 0.25, -size * 0.42);
  ctx.lineTo(size * 0.42, -size * 0.46);
  ctx.lineTo(size * 0.42, size * 0.08);
  ctx.quadraticCurveTo(size * 0.38, size * 0.50, 0, size * 0.58);
  ctx.quadraticCurveTo(-size * 0.38, size * 0.50, -size * 0.42, size * 0.08);
  ctx.lineTo(-size * 0.42, -size * 0.46);
  ctx.lineTo(-size * 0.25, -size * 0.42);
  ctx.closePath();

  ctx.fillStyle = '#ffd700';
  ctx.fill();
  ctx.lineWidth = 7;
  ctx.strokeStyle = '#0e1626';
  ctx.stroke();

  // Upper Left: St. George Cross (Red on White)
  ctx.save();
  ctx.clip();

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-size * 0.38, -size * 0.44, size * 0.38, size * 0.34);
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(-size * 0.24, -size * 0.44, size * 0.10, size * 0.34);
  ctx.fillRect(-size * 0.38, -size * 0.32, size * 0.38, size * 0.10);

  // Upper Right: Senyera Catalan Flag (4 Red Stripes on Yellow)
  ctx.fillStyle = '#ffd700';
  ctx.fillRect(0, -size * 0.44, size * 0.38, size * 0.34);
  ctx.fillStyle = '#dc2626';
  for (let s = 0; s < 4; s++) {
    ctx.fillRect(s * size * 0.09, -size * 0.44, size * 0.045, size * 0.34);
  }

  // Lower Section: Blaugrana Stripes & Golden Ball
  for (let b = -3; b < 4; b++) {
    ctx.fillStyle = b % 2 === 0 ? '#004d98' : '#a50044';
    ctx.fillRect(b * size * 0.12, -size * 0.05, size * 0.12, size * 0.65);
  }

  // Golden Football in center lower section
  ctx.fillStyle = '#ffd700';
  ctx.beginPath();
  ctx.arc(0, size * 0.25, size * 0.14, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#996515';
  ctx.stroke();

  // Central Horizontal Ribbon with FCB
  ctx.fillStyle = '#ffd700';
  ctx.fillRect(-size * 0.42, -size * 0.12, size * 0.84, size * 0.14);
  ctx.fillStyle = '#0e1626';
  ctx.font = '900 32px "Montserrat", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('FCB', 0, -size * 0.01);

  ctx.restore();
  ctx.restore();
}

function drawAuthenticBrasilCrest(ctx, cx, cy, size) {
  ctx.save();
  ctx.translate(cx, cy);

  // 5 Green Stars arched on top
  ctx.fillStyle = '#007a33';
  [-2, -1, 0, 1, 2].forEach(pos => {
    const angle = (pos * 18 * Math.PI) / 180;
    const sx = Math.sin(angle) * (size * 0.48);
    const sy = -Math.cos(angle) * (size * 0.48) - size * 0.12;
    draw5PtStar(ctx, sx, sy, 14);
  });

  // Cross Shield Body
  ctx.beginPath();
  ctx.moveTo(-size * 0.38, -size * 0.36);
  ctx.lineTo(size * 0.38, -size * 0.36);
  ctx.lineTo(size * 0.38, size * 0.12);
  ctx.quadraticCurveTo(size * 0.32, size * 0.52, 0, size * 0.58);
  ctx.quadraticCurveTo(-size * 0.32, size * 0.52, -size * 0.38, size * 0.12);
  ctx.closePath();

  ctx.fillStyle = '#002776';
  ctx.fill();
  ctx.lineWidth = 7;
  ctx.strokeStyle = '#007a33';
  ctx.stroke();

  // White Cross on Blue
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-size * 0.08, -size * 0.36, size * 0.16, size * 0.9);
  ctx.fillRect(-size * 0.38, -size * 0.06, size * 0.76, size * 0.16);

  // CBF Letters in Navy
  ctx.fillStyle = '#002776';
  ctx.font = '900 44px "Montserrat", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('CBF', 0, size * 0.05);

  // "BRASIL" banner underneath
  ctx.fillStyle = '#007a33';
  ctx.font = '900 26px "Montserrat", sans-serif';
  ctx.letterSpacing = '4px';
  ctx.fillText('BRASIL', 0, size * 0.74);

  ctx.restore();
}

function drawSpotifyCircularEmblem(ctx, cx, cy, radius) {
  ctx.save();
  ctx.translate(cx, cy);

  // Solid Bright Yellow Circle
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fillStyle = '#ffdd00';
  ctx.fill();

  // 3 Curved Sound Wave Arcs in Deep Blau
  ctx.strokeStyle = '#004d98';
  ctx.lineCap = 'round';

  // Arc 1 (Top, longest)
  ctx.lineWidth = radius * 0.18;
  ctx.beginPath();
  ctx.arc(0, radius * 0.18, radius * 0.65, -Math.PI * 0.82, -Math.PI * 0.18);
  ctx.stroke();

  // Arc 2 (Middle)
  ctx.lineWidth = radius * 0.16;
  ctx.beginPath();
  ctx.arc(0, radius * 0.28, radius * 0.48, -Math.PI * 0.80, -Math.PI * 0.20);
  ctx.stroke();

  // Arc 3 (Bottom, shortest)
  ctx.lineWidth = radius * 0.14;
  ctx.beginPath();
  ctx.arc(0, radius * 0.36, radius * 0.32, -Math.PI * 0.76, -Math.PI * 0.24);
  ctx.stroke();

  ctx.restore();
}

function drawRealMadridFlankPanel(ctx, x, isLeft) {
  ctx.save();
  // Slate/grey mesh ventilation panel
  ctx.fillStyle = '#cbd5e1';
  ctx.beginPath();
  if (isLeft) {
    ctx.moveTo(x, 400);
    ctx.quadraticCurveTo(x + 40, 1100, x + 15, 2048);
    ctx.lineTo(x - 50, 2048);
    ctx.lineTo(x - 50, 400);
  } else {
    ctx.moveTo(x, 400);
    ctx.quadraticCurveTo(x - 40, 1100, x - 15, 2048);
    ctx.lineTo(x + 50, 2048);
    ctx.lineTo(x + 50, 400);
  }
  ctx.closePath();
  ctx.fill();

  // Gold contour piping
  ctx.strokeStyle = '#e5c158';
  ctx.lineWidth = 10;
  ctx.beginPath();
  if (isLeft) {
    ctx.moveTo(x, 400);
    ctx.quadraticCurveTo(x + 40, 1100, x + 15, 2048);
  } else {
    ctx.moveTo(x, 400);
    ctx.quadraticCurveTo(x - 40, 1100, x - 15, 2048);
  }
  ctx.stroke();
  ctx.restore();
}

function drawBrazilWaveFlank(ctx, x, isLeft) {
  ctx.save();
  // Light Mint/Cyan wave panel
  ctx.fillStyle = '#7fe5d9';
  ctx.beginPath();
  if (isLeft) {
    ctx.moveTo(x, 500);
    ctx.quadraticCurveTo(x + 65, 1050, x + 10, 1650);
    ctx.lineTo(x - 40, 1650);
    ctx.lineTo(x - 40, 500);
  } else {
    ctx.moveTo(x, 500);
    ctx.quadraticCurveTo(x - 65, 1050, x - 10, 1650);
    ctx.lineTo(x + 40, 1650);
    ctx.lineTo(x + 40, 500);
  }
  ctx.closePath();
  ctx.fill();

  // Dark Navy Border Piping
  ctx.strokeStyle = '#0c2340';
  ctx.lineWidth = 9;
  ctx.beginPath();
  if (isLeft) {
    ctx.moveTo(x, 500);
    ctx.quadraticCurveTo(x + 65, 1050, x + 10, 1650);
  } else {
    ctx.moveTo(x, 500);
    ctx.quadraticCurveTo(x - 65, 1050, x - 10, 1650);
  }
  ctx.stroke();
  ctx.restore();
}

function drawStripeFade(ctx, x, y, w, h, fromLeft) {
  const grad = ctx.createLinearGradient(x, 0, x + w, 0);
  if (fromLeft) {
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  } else {
    grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0.45)');
  }
  ctx.fillStyle = grad;
  ctx.fillRect(x, y, w, h);
}

function draw5PtStar(ctx, cx, cy, radius) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? radius : radius * 0.45;
    const a = (i * Math.PI) / 5 - Math.PI / 2;
    const px = cx + Math.cos(a) * r;
    const py = cy + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

function applyMicroMeshKnit(ctx) {
  // Micro knit grain
  ctx.save();
  ctx.globalAlpha = 0.04;
  ctx.fillStyle = '#000000';
  for (let y = 0; y < 2048; y += 8) {
    ctx.fillRect(0, y, 2048, 2);
  }
  for (let x = 0; x < 2048; x += 8) {
    ctx.fillRect(x, 0, 2, 2048);
  }
  ctx.restore();
}
