import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * AiInterview3D
 * High-performance interactive 3D WebGL animation representing the AI Interviewer core.
 * Features:
 *  - Pulsating holographic icosahedron neural core
 *  - Three counter-rotating gyroscopic cybernetic rings
 *  - 3D audio-reactive frequency nodes
 *  - Ambient particle galaxy field with mouse parallax
 *  - Real-time reactivity to AI speaking / listening state
 */
export default function AiInterview3D({
  isSpeaking = false,
  isListening = false,
  audioLevel = 0.5,
  className = '',
}) {
  const mountRef = useRef(null);
  const stateRef = useRef({ isSpeaking, isListening, audioLevel });

  // Keep stateRef synced for the animation loop without restarting WebGL context
  useEffect(() => {
    stateRef.current = { isSpeaking, isListening, audioLevel };
  }, [isSpeaking, isListening, audioLevel]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    // ─── 1. Scene & Camera ─────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 7.5;

    // ─── 2. Renderer ───────────────────────────────────────────────
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);
    } catch {
      // Fallback if WebGL is unavailable
      return;
    }

    // ─── 3. Lighting ───────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0x0f172a, 1.8);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x06b6d4, 3, 15);
    cyanLight.position.set(4, 4, 3);
    scene.add(cyanLight);

    const purpleLight = new THREE.PointLight(0x8b5cf6, 3, 15);
    purpleLight.position.set(-4, -3, 3);
    scene.add(purpleLight);

    const coreLight = new THREE.PointLight(0x3b82f6, 2.5, 8);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);

    // Master Group for mouse rotation
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // ─── 4. Central Hologram Neural Core ───────────────────────────
    // Outer wireframe icosahedron
    const coreGeo = new THREE.IcosahedronGeometry(1.35, 1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.6,
      wireframe: true,
      roughness: 0.2,
      metalness: 0.9,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    masterGroup.add(coreMesh);

    // Inner glowing sphere
    const innerGeo = new THREE.SphereGeometry(0.75, 24, 24);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x818cf8,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    masterGroup.add(innerMesh);

    // Solid glowing heart
    const heartGeo = new THREE.OctahedronGeometry(0.4, 0);
    const heartMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.85,
    });
    const heartMesh = new THREE.Mesh(heartGeo, heartMat);
    masterGroup.add(heartMesh);

    // ─── 5. Gyroscopic Orbital Rings ───────────────────────────────
    const ring1Geo = new THREE.TorusGeometry(2.0, 0.018, 16, 100);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x0891b2,
      emissiveIntensity: 1.2,
      roughness: 0.3,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    ring1.rotation.y = Math.PI / 6;
    masterGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(2.4, 0.016, 16, 100);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      emissive: 0x9333ea,
      emissiveIntensity: 1.2,
      roughness: 0.3,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.z = Math.PI / 3;
    masterGroup.add(ring2);

    const ring3Geo = new THREE.TorusGeometry(2.8, 0.014, 16, 100);
    const ring3Mat = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      emissive: 0x2563eb,
      emissiveIntensity: 1.0,
      roughness: 0.3,
    });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3.rotation.y = Math.PI / 2.5;
    masterGroup.add(ring3);

    // ─── 6. Audio Waveform Floating Node Ring ──────────────────────
    const waveCount = 48;
    const waveRadius = 1.75;
    const wavePositions = new Float32Array(waveCount * 3);
    const waveBaseAngles = [];

    for (let i = 0; i < waveCount; i++) {
      const angle = (i / waveCount) * Math.PI * 2;
      waveBaseAngles.push(angle);
      wavePositions[i * 3]     = Math.cos(angle) * waveRadius;
      wavePositions[i * 3 + 1] = Math.sin(angle) * waveRadius;
      wavePositions[i * 3 + 2] = 0;
    }

    const waveGeo = new THREE.BufferGeometry();
    waveGeo.setAttribute('position', new THREE.BufferAttribute(wavePositions, 3));

    const waveMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.08,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });
    const wavePoints = new THREE.Points(waveGeo, waveMat);
    masterGroup.add(wavePoints);

    // ─── 7. Surrounding Neural Stardust Field ───────────────────────
    const particleCount = 450;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const colorA = new THREE.Color(0x38bdf8); // Cyan
    const colorB = new THREE.Color(0xa855f7); // Purple
    const colorC = new THREE.Color(0x60a5fa); // Blue

    for (let i = 0; i < particleCount; i++) {
      const radius = 2.5 + Math.random() * 3.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      particlePositions[i * 3]     = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = radius * Math.cos(phi);

      const chosenColor = Math.random() > 0.5 ? (Math.random() > 0.5 ? colorA : colorB) : colorC;
      particleColors[i * 3]     = chosenColor.r;
      particleColors[i * 3 + 1] = chosenColor.g;
      particleColors[i * 3 + 2] = chosenColor.b;
    }

    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // ─── 8. Mouse Interaction (Parallax Damping) ───────────────────
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX = x;
      mouseY = y;
      targetRotY = mouseX * 0.7;
      targetRotX = mouseY * 0.7;
    };

    const handleMouseLeave = () => {
      targetRotX = 0;
      targetRotY = 0;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    // ─── 9. Responsive Resize ──────────────────────────────────────
    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // ─── 10. Animation Loop ────────────────────────────────────────
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      const { isSpeaking: speaking, isListening: listening, audioLevel: level } = stateRef.current;

      // Dynamic rotation speed based on state
      const speedMultiplier = speaking ? 2.2 : listening ? 1.5 : 1.0;

      // Gyro rings rotation
      ring1.rotation.z += 0.009 * speedMultiplier;
      ring1.rotation.y += 0.004 * speedMultiplier;

      ring2.rotation.x -= 0.007 * speedMultiplier;
      ring2.rotation.z += 0.005 * speedMultiplier;

      ring3.rotation.y += 0.006 * speedMultiplier;
      ring3.rotation.x += 0.003 * speedMultiplier;

      // Core rotation & breathing scale
      coreMesh.rotation.x = elapsedTime * 0.25 * speedMultiplier;
      coreMesh.rotation.y = elapsedTime * 0.35 * speedMultiplier;

      innerMesh.rotation.x = -elapsedTime * 0.4 * speedMultiplier;
      innerMesh.rotation.z = elapsedTime * 0.2 * speedMultiplier;

      heartMesh.rotation.y = elapsedTime * 0.8 * speedMultiplier;

      // Reactive scaling
      let baseScale = 1;
      if (speaking) {
        baseScale = 1 + Math.sin(elapsedTime * 10) * 0.12 * Math.max(0.4, level);
        coreMat.emissiveIntensity = 1.0 + Math.sin(elapsedTime * 12) * 0.6;
        coreLight.intensity = 3.5 + Math.sin(elapsedTime * 12) * 1.5;
        coreLight.color.setHex(0x38bdf8);
      } else if (listening) {
        baseScale = 1 + Math.sin(elapsedTime * 6) * 0.06;
        coreMat.emissiveIntensity = 0.8 + Math.sin(elapsedTime * 8) * 0.3;
        coreLight.intensity = 2.8;
        coreLight.color.setHex(0x10b981); // Emerald receptive glow
      } else {
        baseScale = 1 + Math.sin(elapsedTime * 2) * 0.03;
        coreMat.emissiveIntensity = 0.5 + Math.sin(elapsedTime * 3) * 0.15;
        coreLight.intensity = 2.0;
        coreLight.color.setHex(0x3b82f6);
      }

      coreMesh.scale.set(baseScale, baseScale, baseScale);
      innerMesh.scale.set(baseScale * 0.9, baseScale * 0.9, baseScale * 0.9);

      // Audio waveform node reactivity
      const positions = waveGeo.attributes.position.array;
      for (let i = 0; i < waveCount; i++) {
        const angle = waveBaseAngles[i];
        let offset = 0;
        if (speaking) {
          offset = Math.sin(elapsedTime * 8 + i * 0.5) * 0.25 * Math.max(0.3, level);
        } else if (listening) {
          offset = Math.sin(elapsedTime * 5 + i * 0.3) * 0.12;
        } else {
          offset = Math.sin(elapsedTime * 2 + i * 0.2) * 0.04;
        }
        const currentR = waveRadius + offset;
        positions[i * 3]     = Math.cos(angle) * currentR;
        positions[i * 3 + 1] = Math.sin(angle) * currentR;
        positions[i * 3 + 2] = offset * 0.6;
      }
      waveGeo.attributes.position.needsUpdate = true;

      // Particle galaxy slow drift
      starField.rotation.y = elapsedTime * 0.03;
      starField.rotation.x = Math.sin(elapsedTime * 0.02) * 0.05;

      // Smooth mouse damping lerp
      masterGroup.rotation.y += (targetRotY - masterGroup.rotation.y) * 0.06;
      masterGroup.rotation.x += (targetRotX - masterGroup.rotation.x) * 0.06;

      renderer.render(scene, camera);
    };

    animate();

    // ─── 11. Cleanup on Unmount ────────────────────────────────────
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);

      // Dispose Three.js resources
      coreGeo.dispose();
      coreMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      heartGeo.dispose();
      heartMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      ring3Geo.dispose();
      ring3Mat.dispose();
      waveGeo.dispose();
      waveMat.dispose();
      starGeo.dispose();
      starMat.dispose();

      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing select-none ${className}`}
      style={{ minHeight: '380px' }}
      title="Interactive 3D AI Interview Core — Move mouse to rotate"
    />
  );
}
