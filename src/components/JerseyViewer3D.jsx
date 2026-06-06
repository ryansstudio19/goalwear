import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

// ─────────────────────────────────────────────────────────────────────────────
// HOW TO ADD REAL JERSEY PHOTOS:
// 1. Upload front & back jersey photos to imgbb.com (free)
// 2. Copy the "Direct link" from each upload
// 3. In your products.js, add to each product:
//      imageFront: "https://i.ibb.co/xxxx/front.jpg"
//      imageBack:  "https://i.ibb.co/xxxx/back.jpg"
// 4. In ProductPage.jsx, pass them to this component:
//      <JerseyViewer3D design={product.design} imageFront={product.imageFront} imageBack={product.imageBack} />
// ─────────────────────────────────────────────────────────────────────────────

export default function JerseyViewer3D({ design, imageFront, imageBack }) {
  const containerRef            = useRef(null);
  const canvasRef               = useRef(null);
  const sceneRef                = useRef(null);
  const cameraRef               = useRef(null);
  const rendererRef             = useRef(null);
  const jerseyGroupRef          = useRef(null);
  const isDraggingRef           = useRef(false);
  const prevMouseRef            = useRef({ x: 0, y: 0 });
  const animationFrameIdRef     = useRef(null);
  const autoRotateRef           = useRef(true);   // ← ref keeps animate() in sync
  const velocityRef             = useRef(0);       // ← inertia on drag release

  const [zoom, setZoom]               = useState(5);
  const [autoRotate, setAutoRotate]   = useState(true);
  const [rotationY, setRotationY]     = useState(0);
  const [loadState, setLoadState]     = useState('loading'); // 'loading' | 'ready' | 'design'

  // ── Fallback canvas textures (used when no real photo) ────────────────────
  const makeFallbackFront = () => {
    const c = document.createElement('canvas');
    c.width = c.height = 512;
    const ctx = c.getContext('2d');
    ctx.fillStyle = design.primaryColor || '#1a1a2e';
    ctx.fillRect(0, 0, 512, 512);
    if (design.stripeType === 'vertical' && design.stripeColor) {
      ctx.fillStyle = design.stripeColor;
      const sw = 512 / 5;
      for (let i = 1; i < 5; i += 2) ctx.fillRect(i * sw, 0, sw, 512);
    } else if (design.stripeType === 'hoops' && design.stripeColor) {
      ctx.fillStyle = design.stripeColor;
      const sh = 512 / 8;
      for (let i = 1; i < 8; i += 2) ctx.fillRect(0, i * sh, 512, sh);
    }
    ctx.fillStyle = design.secondaryColor || '#fff';
    ctx.font = 'bold 42px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(design.sponsorText || 'GoalWear', 256, 270);
    // Badge shield
    const bx = 330, by = 148;
    ctx.fillStyle = design.badgeColor || design.secondaryColor || '#fff';
    ctx.beginPath();
    ctx.moveTo(bx-18,by-18); ctx.lineTo(bx+18,by-18); ctx.lineTo(bx+18,by+4);
    ctx.quadraticCurveTo(bx+18,by+20,bx,by+28);
    ctx.quadraticCurveTo(bx-18,by+20,bx-18,by+4);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = design.secondaryColor || '#fff';
    ctx.fillRect(0, 497, 512, 15);
    return new THREE.CanvasTexture(c);
  };

  const makeFallbackBack = () => {
    const c = document.createElement('canvas');
    c.width = c.height = 512;
    const ctx = c.getContext('2d');
    ctx.fillStyle = design.primaryColor || '#1a1a2e';
    ctx.fillRect(0, 0, 512, 512);
    if (design.stripeType === 'vertical' && design.stripeColor) {
      ctx.fillStyle = design.stripeColor;
      const sw = 512 / 5;
      for (let i = 1; i < 5; i += 2) ctx.fillRect(i * sw, 0, sw, 512);
    } else if (design.stripeType === 'hoops' && design.stripeColor) {
      ctx.fillStyle = design.stripeColor;
      const sh = 512 / 8;
      for (let i = 1; i < 8; i += 2) ctx.fillRect(0, i * sh, 512, sh);
    }
    ctx.fillStyle = design.secondaryColor || '#fff';
    ctx.font = 'bold 26px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('GOALWEAR', 256, 120);
    ctx.font = '900 130px sans-serif';
    ctx.fillText(design.numberText || '10', 256, 275);
    ctx.fillStyle = design.secondaryColor || '#fff';
    ctx.fillRect(0, 497, 512, 15);
    return new THREE.CanvasTexture(c);
  };

  // ── Build jersey meshes ───────────────────────────────────────────────────
  const buildJersey = (group, frontTex, backTex) => {
    // Clear old meshes
    while (group.children.length) {
      const ch = group.children[0];
      ch.geometry?.dispose();
      group.remove(ch);
    }

    const prep = (t) => {
      t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = rendererRef.current?.capabilities.getMaxAnisotropy() ?? 4;
      t.minFilter = THREE.LinearMipmapLinearFilter;
      t.generateMipmaps = true;
    };
    prep(frontTex); prep(backTex);

    const fMat = new THREE.MeshStandardMaterial({ map: frontTex, roughness: 0.82, metalness: 0.05, side: THREE.DoubleSide });
    const bMat = new THREE.MeshStandardMaterial({ map: backTex,  roughness: 0.82, metalness: 0.05, side: THREE.DoubleSide });
    const sMat = new THREE.MeshStandardMaterial({
      color: design.stripeType === 'sleeves-contrast' ? (design.secondaryColor || '#fff') : (design.primaryColor || '#1a1a2e'),
      roughness: 0.85, metalness: 0.05
    });
    const cMat = new THREE.MeshStandardMaterial({ color: design.collarColor || design.secondaryColor || '#fff', roughness: 0.7 });

    // Torso front half
    group.add(new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.67, 1.7, 32, 1, true, -Math.PI/2, Math.PI), fMat));
    // Torso back half
    group.add(new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.67, 1.7, 32, 1, true,  Math.PI/2, Math.PI), bMat));

    // Sleeves
    [[-0.76, Math.PI/4.2], [0.76, -Math.PI/4.2]].forEach(([x, rz]) => {
      const g = new THREE.CylinderGeometry(0.2, 0.16, 0.55, 16);
      g.translate(0, -0.275, 0);
      const m = new THREE.Mesh(g, sMat);
      m.position.set(x, 0.6, 0);
      m.rotation.z = rz;
      m.rotation.x = 0.1;
      group.add(m);
    });

    // Cuffs
    const cuffG = new THREE.TorusGeometry(0.165, 0.02, 12, 32);
    const cL = new THREE.Mesh(cuffG, cMat);
    cL.position.set(-0.95, 0.4, 0.05);
    cL.rotation.set(0.1, Math.PI/2, Math.PI/4.2);
    group.add(cL);
    const cR = new THREE.Mesh(cuffG, cMat);
    cR.position.set(0.95, 0.4, 0.05);
    cR.rotation.set(0.1, -Math.PI/2, -Math.PI/4.2);
    group.add(cR);

    // Collar
    const col = new THREE.Mesh(new THREE.TorusGeometry(0.33, 0.045, 12, 48), cMat);
    col.position.set(0, 0.85, 0);
    col.rotation.x = Math.PI / 1.9;
    group.add(col);
  };

  // ── Main Three.js effect ──────────────────────────────────────────────────
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const width  = containerRef.current.clientWidth;
    const height = 400;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.2, zoom);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current, antialias: true, alpha: true, preserveDrawingBuffer: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled   = true;
    renderer.toneMapping         = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    rendererRef.current = renderer;

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.45));
    const kl = new THREE.DirectionalLight(0xffffff, 0.85); kl.position.set(1.5,1.5,3.5); scene.add(kl);
    const fl = new THREE.DirectionalLight(0xffffff, 0.45); fl.position.set(-1.5,0.5,3.5); scene.add(fl);
    const rl = new THREE.DirectionalLight(0x00ff88, 0.35); rl.position.set(0,3,-3); scene.add(rl);

    // Jersey group
    const jerseyGroup = new THREE.Group();
    jerseyGroup.position.set(0, -0.1, 0);
    jerseyGroupRef.current = jerseyGroup;
    scene.add(jerseyGroup);

    // ── Load textures ────────────────────────────────────────────────────
    const hasPhotos = !!(imageFront || imageBack);

    if (hasPhotos) {
      setLoadState('loading');
      const loader = new THREE.TextureLoader();
      loader.crossOrigin = 'anonymous';
      let ft, bt, count = 0;
      const done = () => { count++; if (count === 2) { buildJersey(jerseyGroup, ft, bt); setLoadState('ready'); } };
      ft = loader.load(imageFront || imageBack, done, undefined, () => { ft = makeFallbackFront(); done(); });
      bt = loader.load(imageBack  || imageFront, done, undefined, () => { bt = makeFallbackBack();  done(); });
    } else {
      buildJersey(jerseyGroup, makeFallbackFront(), makeFallbackBack());
      setLoadState('design');
    }

    // ── Pointer events (drag with inertia) ───────────────────────────────
    const getXY = (e) => ({
      x: e.clientX ?? e.touches?.[0]?.clientX ?? 0,
      y: e.clientY ?? e.touches?.[0]?.clientY ?? 0,
    });

    const onDown = (e) => {
      isDraggingRef.current   = true;
      autoRotateRef.current   = false;
      velocityRef.current     = 0;
      setAutoRotate(false);
      prevMouseRef.current = getXY(e);
    };

    const onMove = (e) => {
      if (!isDraggingRef.current || !jerseyGroupRef.current) return;
      const { x, y } = getXY(e);
      const dx = x - prevMouseRef.current.x;
      const dy = y - prevMouseRef.current.y;
      jerseyGroupRef.current.rotation.y += dx * 0.01;
      jerseyGroupRef.current.rotation.x  = Math.max(-0.4, Math.min(0.4, jerseyGroupRef.current.rotation.x + dy * 0.01));
      velocityRef.current = dx * 0.01;
      setRotationY(jerseyGroupRef.current.rotation.y);
      prevMouseRef.current = { x, y };
    };

    const onUp = () => { isDraggingRef.current = false; };

    const cvs = canvasRef.current;
    cvs.addEventListener('mousedown',  onDown);
    window.addEventListener('mousemove',  onMove);
    window.addEventListener('mouseup',    onUp);
    cvs.addEventListener('touchstart', onDown, { passive: true });
    window.addEventListener('touchmove',  onMove, { passive: true });
    window.addEventListener('touchend',   onUp);

    // ── Animation loop ───────────────────────────────────────────────────
    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);
      if (!jerseyGroupRef.current) return;

      if (autoRotateRef.current) {
        jerseyGroupRef.current.rotation.y += 0.007;
        setRotationY(jerseyGroupRef.current.rotation.y);
      } else if (!isDraggingRef.current && Math.abs(velocityRef.current) > 0.0001) {
        // Inertia after drag
        jerseyGroupRef.current.rotation.y += velocityRef.current;
        velocityRef.current *= 0.93;
        setRotationY(jerseyGroupRef.current.rotation.y);
      }

      // Gentle float
      jerseyGroupRef.current.position.y = -0.1 + Math.sin(Date.now() * 0.0015) * 0.04;
      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const onResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      camera.aspect = w / height;
      camera.updateProjectionMatrix();
      renderer.setSize(w, height);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animationFrameIdRef.current);
      cvs.removeEventListener('mousedown',  onDown);
      window.removeEventListener('mousemove',  onMove);
      window.removeEventListener('mouseup',    onUp);
      cvs.removeEventListener('touchstart', onDown);
      window.removeEventListener('touchmove',  onMove);
      window.removeEventListener('touchend',   onUp);
      window.removeEventListener('resize',     onResize);
      renderer.dispose();
    };
  }, [design, imageFront, imageBack]);

  // Sync zoom to camera
  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.position.z = zoom;
      cameraRef.current.updateProjectionMatrix();
    }
  }, [zoom]);

  // Snap to face
  const snapTo = (face) => {
    autoRotateRef.current = false;
    setAutoRotate(false);
    velocityRef.current = 0;
    if (jerseyGroupRef.current) {
      jerseyGroupRef.current.rotation.x = 0;
      jerseyGroupRef.current.rotation.y = face === 'front' ? 0 : Math.PI;
      setRotationY(jerseyGroupRef.current.rotation.y);
    }
  };

  const toggleSpin = () => {
    const next = !autoRotateRef.current;
    autoRotateRef.current = next;
    setAutoRotate(next);
  };

  // ── UI ───────────────────────────────────────────────────────────────────
  return (
    <div ref={containerRef} style={{ width: '100%', position: 'relative' }}>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '400px', cursor: isDraggingRef.current ? 'grabbing' : 'grab', display: 'block' }}
      />

      {/* Loading overlay — only shows when real photos are loading */}
      {loadState === 'loading' && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', gap: '14px',
        }}>
          <div style={{
            width: '36px', height: '36px',
            border: '2px solid rgba(255,255,255,0.1)',
            borderTop: '2px solid var(--accent, #00ff88)',
            borderRadius: '50%', animation: 'gwspin 0.75s linear infinite',
          }} />
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', letterSpacing: '0.08em' }}>
            LOADING JERSEY PHOTO...
          </span>
          <style>{`@keyframes gwspin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Status dot + label */}
      <div style={{
        position: 'absolute', top: '12px', left: '12px',
        display: 'flex', alignItems: 'center', gap: '6px',
        fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.1em',
        color: 'var(--text-muted, rgba(255,255,255,0.5))', pointerEvents: 'none',
      }}>
        <span style={{
          width: '6px', height: '6px', borderRadius: '50%', display: 'inline-block',
          backgroundColor: autoRotate ? 'var(--accent, #00ff88)' : 'var(--text-muted, rgba(255,255,255,0.4))',
          boxShadow: autoRotate ? '0 0 5px var(--accent, #00ff88)' : 'none',
          transition: 'all 0.3s',
        }} />
        {loadState === 'ready'  ? '3D Real Photo View'
       : loadState === 'design' ? '3D Design View'
       : 'Loading...'}
      </div>

      {/* Hint: no photos yet */}
      {loadState === 'design' && (
        <div style={{
          position: 'absolute', top: '12px', right: '12px',
          background: 'rgba(255,152,0,0.1)', border: '1px solid rgba(255,152,0,0.3)',
          borderRadius: '8px', padding: '5px 9px',
          fontSize: '0.62rem', color: '#ffa726', lineHeight: 1.4, maxWidth: '160px',
        }}>
          📸 Add <strong>imageFront</strong> &amp; <strong>imageBack</strong> to show real photo
        </div>
      )}

      {/* Controls */}
      <div style={{
        position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: '8px', alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
        border: '1px solid var(--border-glass, rgba(255,255,255,0.1))',
        padding: '6px 12px', borderRadius: '30px', zIndex: 5,
      }}>
        {/* Front */}
        <button onClick={() => snapTo('front')} style={{
          fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase',
          padding: '4px 10px', borderRadius: '15px', cursor: 'pointer', border: 'none',
          backgroundColor: 'transparent', color: '#fff', transition: 'var(--transition-fast, all 0.2s)',
        }}>Front</button>

        {/* Back */}
        <button onClick={() => snapTo('back')} style={{
          fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase',
          padding: '4px 10px', borderRadius: '15px', cursor: 'pointer', border: 'none',
          backgroundColor: 'transparent', color: '#fff', transition: 'var(--transition-fast, all 0.2s)',
        }}>Back</button>

        {/* Spin */}
        <button onClick={toggleSpin} style={{
          fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase',
          padding: '4px 10px', borderRadius: '15px', cursor: 'pointer',
          backgroundColor: autoRotate ? 'rgba(0,255,136,0.2)' : 'transparent',
          color: autoRotate ? 'var(--accent, #00ff88)' : '#fff',
          border: autoRotate ? '1px solid var(--accent, #00ff88)' : '1px solid transparent',
          transition: 'var(--transition-fast, all 0.2s)',
        }}>
          {autoRotate ? 'Spinning' : 'Spin'}
        </button>

        <span style={{ borderLeft: '1px solid rgba(255,255,255,0.2)', margin: '2px 4px', alignSelf: 'stretch' }} />

        {/* Zoom */}
        <button onClick={() => setZoom(z => Math.max(3.5, z - 0.5))}
          style={{ color: '#fff', fontSize: '1rem', fontWeight: 900, padding: '0 6px', background: 'none', border: 'none', cursor: 'pointer' }}>+</button>
        <button onClick={() => setZoom(z => Math.min(6.5, z + 0.5))}
          style={{ color: '#fff', fontSize: '1rem', fontWeight: 900, padding: '0 6px', background: 'none', border: 'none', cursor: 'pointer' }}>−</button>
      </div>
    </div>
  );
}
