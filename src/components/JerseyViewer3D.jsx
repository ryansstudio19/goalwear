import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

export default function JerseyViewer3D({ design }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [zoom, setZoom] = useState(5);
  const [autoRotate, setAutoRotate] = useState(true);
  const [rotationY, setRotationY] = useState(0);

  // Keep references to access from event listeners and animate loop
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const jerseyGroupRef = useRef(null);
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const animationFrameIdRef = useRef(null);

  // Helper to draw Front Texture on Canvas
  const drawFrontTexture = (design) => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // 1. Fill base color
    ctx.fillStyle = design.primaryColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Draw stripes
    if (design.stripeType === 'vertical') {
      const numStripes = 5;
      const stripeWidth = canvas.width / numStripes;
      ctx.fillStyle = design.stripeColor;
      for (let i = 0; i < numStripes; i++) {
        if (i % 2 === 1) {
          ctx.fillRect(i * stripeWidth, 0, stripeWidth, canvas.height);
        }
      }
    } else if (design.stripeType === 'hoops') {
      const numHoops = 8;
      const hoopHeight = canvas.height / numHoops;
      ctx.fillStyle = design.stripeColor;
      for (let i = 0; i < numHoops; i++) {
        if (i % 2 === 1) {
          ctx.fillRect(0, i * hoopHeight, canvas.width, hoopHeight);
        }
      }
    }

    // 3. Draw Brand logo (Right chest - when looking at jersey, it's left side of texture)
    // The cylinder U goes from 0 on the left to 1 on the right.
    // Right chest is around U = 0.35
    ctx.fillStyle = design.secondaryColor;
    ctx.font = 'bold 16px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('GW', 170, 150);

    // 4. Draw Club Crest (Left chest - around U = 0.65)
    // Draw a small crest background shield
    ctx.fillStyle = design.badgeColor || design.secondaryColor;
    const cx = 340;
    const cy = 150;
    ctx.beginPath();
    ctx.moveTo(cx - 15, cy - 15);
    ctx.lineTo(cx + 15, cy - 15);
    ctx.lineTo(cx + 15, cy + 5);
    ctx.quadraticCurveTo(cx + 15, cy + 18, cx, cy + 25);
    ctx.quadraticCurveTo(cx - 15, cy + 18, cx - 15, cy + 5);
    ctx.closePath();
    ctx.fill();

    // Crest text
    ctx.fillStyle = design.primaryColor;
    ctx.font = '900 10px "Outfit", sans-serif';
    ctx.fillText('CLUB', cx, cy + 2);

    // 5. Draw Sponsor Text (Center - U = 0.5)
    ctx.fillStyle = design.secondaryColor;
    ctx.font = 'bold 36px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(design.sponsorText || 'GoalWear', 256, 260);

    // 6. Subtle gold trim/cuff lines at bottom of texture (front hem)
    ctx.fillStyle = design.secondaryColor;
    ctx.fillRect(0, canvas.height - 15, canvas.width, 15);

    return new THREE.CanvasTexture(canvas);
  };

  // Helper to draw Back Texture on Canvas
  const drawBackTexture = (design) => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // 1. Fill base color
    ctx.fillStyle = design.primaryColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Draw stripes
    if (design.stripeType === 'vertical') {
      const numStripes = 5;
      const stripeWidth = canvas.width / numStripes;
      ctx.fillStyle = design.stripeColor;
      for (let i = 0; i < numStripes; i++) {
        if (i % 2 === 1) {
          ctx.fillRect(i * stripeWidth, 0, stripeWidth, canvas.height);
        }
      }
    } else if (design.stripeType === 'hoops') {
      const numHoops = 8;
      const hoopHeight = canvas.height / numHoops;
      ctx.fillStyle = design.stripeColor;
      for (let i = 0; i < numHoops; i++) {
        if (i % 2 === 1) {
          ctx.fillRect(0, i * hoopHeight, canvas.width, hoopHeight);
        }
      }
    }

    // 3. Draw Player Name (Centered - U = 0.5)
    ctx.fillStyle = design.secondaryColor;
    ctx.font = 'bold 24px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('GOALWEAR', 256, 120);

    // 4. Draw Player Number
    ctx.font = '900 130px "Outfit", sans-serif';
    ctx.fillText(design.numberText || '10', 256, 260);

    // 5. Trim at bottom
    ctx.fillStyle = design.secondaryColor;
    ctx.fillRect(0, canvas.height - 15, canvas.width, 15);

    return new THREE.CanvasTexture(canvas);
  };

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = 400; // Fixed height for visual consistency

    // 1. Initialize Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Initialize Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.2, zoom);
    cameraRef.current = camera;

    // 3. Initialize Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;

    // 4. Lights Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambientLight);

    // Dynamic front lights (stadium spotlight vibe)
    const keyLight = new THREE.DirectionalLight(0xffffff, 0.85);
    keyLight.position.set(1.5, 1.5, 3.5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.45);
    fillLight.position.set(-1.5, 0.5, 3.5);
    scene.add(fillLight);

    // Rim lighting to outline sleeves
    const rimLight = new THREE.DirectionalLight(0x00ff88, 0.35);
    rimLight.position.set(0, 3, -3);
    scene.add(rimLight);

    // 5. Construct Jersey Mesh Geometry Group
    const jerseyGroup = new THREE.Group();
    jerseyGroupRef.current = jerseyGroup;
    scene.add(jerseyGroup);

    // Textures
    const frontTex = drawFrontTexture(design);
    const backTex = drawBackTexture(design);

    // Adjust texture wraps
    frontTex.wrapS = THREE.ClampToEdgeWrapping;
    frontTex.wrapT = THREE.ClampToEdgeWrapping;
    backTex.wrapS = THREE.ClampToEdgeWrapping;
    backTex.wrapT = THREE.ClampToEdgeWrapping;

    // Materials
    // A nice rough fabric material mapping
    const frontMat = new THREE.MeshStandardMaterial({
      map: frontTex,
      roughness: 0.82,
      metalness: 0.08,
      side: THREE.DoubleSide
    });

    const backMat = new THREE.MeshStandardMaterial({
      map: backTex,
      roughness: 0.82,
      metalness: 0.08,
      side: THREE.DoubleSide
    });

    const sleeveMat = new THREE.MeshStandardMaterial({
      color: design.stripeType === 'sleeves-contrast' ? design.secondaryColor : design.primaryColor,
      roughness: 0.85,
      metalness: 0.05
    });

    const collarMat = new THREE.MeshStandardMaterial({
      color: design.collarColor || design.secondaryColor,
      roughness: 0.7
    });

    // Torso Front (180 degrees front half-cylinder)
    const torsoFrontGeom = new THREE.CylinderGeometry(0.72, 0.67, 1.7, 32, 1, true, -Math.PI / 2, Math.PI);
    const torsoFront = new THREE.Mesh(torsoFrontGeom, frontMat);
    jerseyGroup.add(torsoFront);

    // Torso Back (180 degrees back half-cylinder)
    const torsoBackGeom = new THREE.CylinderGeometry(0.72, 0.67, 1.7, 32, 1, true, Math.PI / 2, Math.PI);
    const torsoBack = new THREE.Mesh(torsoBackGeom, backMat);
    jerseyGroup.add(torsoBack);

    // Left Sleeve (Cylinder rotated out)
    const sleeveLGeom = new THREE.CylinderGeometry(0.2, 0.16, 0.55, 16);
    sleeveLGeom.translate(0, -0.275, 0); // Translate origin to shoulder join
    const sleeveL = new THREE.Mesh(sleeveLGeom, sleeveMat);
    sleeveL.position.set(-0.76, 0.6, 0);
    sleeveL.rotation.z = Math.PI / 4.2; // Angle outward
    sleeveL.rotation.x = 0.1;
    jerseyGroup.add(sleeveL);

    // Right Sleeve
    const sleeveRGeom = new THREE.CylinderGeometry(0.2, 0.16, 0.55, 16);
    sleeveRGeom.translate(0, -0.275, 0);
    const sleeveR = new THREE.Mesh(sleeveRGeom, sleeveMat);
    sleeveR.position.set(0.76, 0.6, 0);
    sleeveR.rotation.z = -Math.PI / 4.2;
    sleeveR.rotation.x = 0.1;
    jerseyGroup.add(sleeveR);

    // Sleeve Cuff Trim L
    const cuffGeom = new THREE.TorusGeometry(0.165, 0.02, 12, 32);
    const cuffL = new THREE.Mesh(cuffGeom, collarMat);
    cuffL.position.set(-0.95, 0.4, 0.05);
    cuffL.rotation.x = 0.1;
    cuffL.rotation.z = Math.PI / 4.2;
    cuffL.rotation.y = Math.PI / 2;
    jerseyGroup.add(cuffL);

    // Sleeve Cuff Trim R
    const cuffR = new THREE.Mesh(cuffGeom, collarMat);
    cuffR.position.set(0.95, 0.4, 0.05);
    cuffR.rotation.x = 0.1;
    cuffR.rotation.z = -Math.PI / 4.2;
    cuffR.rotation.y = -Math.PI / 2;
    jerseyGroup.add(cuffR);

    // Collar Torus
    const collarGeom = new THREE.TorusGeometry(0.33, 0.045, 12, 48);
    const collar = new THREE.Mesh(collarGeom, collarMat);
    collar.position.set(0, 0.85, 0);
    collar.rotation.x = Math.PI / 1.9; // Slight angle forward
    jerseyGroup.add(collar);

    // Position Jersey in center of scene
    jerseyGroup.position.set(0, -0.1, 0);

    // 6. Drag and Rotation Controls
    const handleMouseDown = (e) => {
      isDraggingRef.current = true;
      setAutoRotate(false);
      previousMousePositionRef.current = {
        x: e.clientX || (e.touches && e.touches[0].clientX),
        y: e.clientY || (e.touches && e.touches[0].clientY)
      };
    };

    const handleMouseMove = (e) => {
      if (!isDraggingRef.current) return;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);

      const deltaMove = {
        x: clientX - previousMousePositionRef.current.x,
        y: clientY - previousMousePositionRef.current.y
      };

      if (jerseyGroupRef.current) {
        jerseyGroupRef.current.rotation.y += deltaMove.x * 0.01;
        jerseyGroupRef.current.rotation.x += deltaMove.y * 0.01;
        // Limit X rotation to avoid looking underneath
        jerseyGroupRef.current.rotation.x = Math.max(-0.4, Math.min(0.4, jerseyGroupRef.current.rotation.x));
        setRotationY(jerseyGroupRef.current.rotation.y);
      }

      previousMousePositionRef.current = {
        x: clientX,
        y: clientY
      };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const canvasElement = canvasRef.current;
    
    // Desktop Mouse Events
    canvasElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Touch Mobile Events
    canvasElement.addEventListener('touchstart', handleMouseDown, { passive: true });
    window.addEventListener('touchmove', handleMouseMove, { passive: true });
    window.addEventListener('touchend', handleMouseUp);

    // 7. Animation Loop
    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);

      if (autoRotate && jerseyGroupRef.current) {
        jerseyGroupRef.current.rotation.y += 0.007;
        setRotationY(jerseyGroupRef.current.rotation.y);
      }

      // Add a very subtle floating bounce effect
      if (jerseyGroupRef.current) {
        const time = Date.now() * 0.0015;
        jerseyGroupRef.current.position.y = -0.1 + Math.sin(time) * 0.04;
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      const w = containerRef.current.clientWidth;
      cameraRef.current.aspect = w / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, height);
    };

    window.addEventListener('resize', handleResize);

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameIdRef.current);
      canvasElement.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      canvasElement.removeEventListener('touchstart', handleMouseDown);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
      window.removeEventListener('resize', handleResize);
    };
  }, [design]); // Re-render scene when team design configuration changes!

  // Update camera zoom in dynamic state
  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.position.z = zoom;
      cameraRef.current.updateProjectionMatrix();
    }
  }, [zoom]);

  const triggerResetRotation = (face) => {
    setAutoRotate(false);
    if (jerseyGroupRef.current) {
      jerseyGroupRef.current.rotation.x = 0;
      if (face === 'front') {
        jerseyGroupRef.current.rotation.y = 0;
      } else {
        jerseyGroupRef.current.rotation.y = Math.PI; // 180 degrees
      }
      setRotationY(jerseyGroupRef.current.rotation.y);
    }
  };

  return (
    <div ref={containerRef} style={{ width: '100%', position: 'relative' }}>
      <canvas 
        ref={canvasRef} 
        style={{ 
          width: '100%', 
          height: '400px', 
          cursor: isDraggingRef.current ? 'grabbing' : 'grab',
          display: 'block'
        }} 
      />

      {/* Spotlights Visual indicator overlay */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '12px',
        fontSize: '0.7rem',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: 'var(--text-muted)',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        <span style={{
          width: '6px',
          height: '6px',
          backgroundColor: autoRotate ? 'var(--accent)' : 'var(--text-muted)',
          borderRadius: '50%',
          display: 'inline-block',
          boxShadow: autoRotate ? '0 0 5px var(--accent)' : 'none'
        }} />
        <span>3D Stadium Sandbox</span>
      </div>

      {/* Viewer controls overlay */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '8px',
        backgroundColor: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(8px)',
        border: '1px solid var(--border-glass)',
        padding: '6px 12px',
        borderRadius: '30px',
        zIndex: 5
      }}>
        <button 
          onClick={() => triggerResetRotation('front')}
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            padding: '4px 10px',
            borderRadius: '15px',
            backgroundColor: rotationY % (2*Math.PI) === 0 ? 'var(--accent)' : 'transparent',
            color: rotationY % (2*Math.PI) === 0 ? '#000' : '#fff',
            transition: 'var(--transition-fast)'
          }}
        >
          Front
        </button>
        <button 
          onClick={() => triggerResetRotation('back')}
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            padding: '4px 10px',
            borderRadius: '15px',
            backgroundColor: Math.abs(rotationY % (2*Math.PI) - Math.PI) < 0.1 ? 'var(--accent)' : 'transparent',
            color: Math.abs(rotationY % (2*Math.PI) - Math.PI) < 0.1 ? '#000' : '#fff',
            transition: 'var(--transition-fast)'
          }}
        >
          Back
        </button>
        <button 
          onClick={() => setAutoRotate(!autoRotate)}
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            padding: '4px 10px',
            borderRadius: '15px',
            backgroundColor: autoRotate ? 'rgba(0, 255, 136, 0.2)' : 'transparent',
            color: autoRotate ? 'var(--accent)' : '#fff',
            border: autoRotate ? '1px solid var(--accent)' : '1px solid transparent',
            transition: 'var(--transition-fast)'
          }}
        >
          {autoRotate ? 'Spinning' : 'Spin'}
        </button>
        
        {/* Separator */}
        <span style={{ borderLeft: '1px solid rgba(255,255,255,0.2)', margin: '2px 4px' }} />

        {/* Zoom Controls */}
        <button 
          onClick={() => setZoom(Math.max(3.5, zoom - 0.5))} 
          style={{ color: '#fff', fontSize: '1rem', fontWeight: 900, padding: '0 6px' }}
        >
          +
        </button>
        <button 
          onClick={() => setZoom(Math.min(6.5, zoom + 0.5))}
          style={{ color: '#fff', fontSize: '1rem', fontWeight: 900, padding: '0 6px' }}
        >
          -
        </button>
      </div>
    </div>
  );
}
