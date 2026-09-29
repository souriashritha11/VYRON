import { useRef, useEffect } from "react";
import * as THREE from "three";

export default function Scene3D({ theme = "batman" }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 65;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // =============================================
    // DYNAMIC PARTICLE FIELD (No connecting lines!)
    // =============================================
    const particleCount = 2000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    // Color definitions based on theme
    let colorPrimary, colorSecondary, colorDim;
    if (theme === "light") {
      colorPrimary   = new THREE.Color(0x2563eb); // Blue
      colorSecondary = new THREE.Color(0xd97706); // Amber
      colorDim       = new THREE.Color(0x94a3b8); // Slate
    } else if (theme === "dark") {
      colorPrimary   = new THREE.Color(0x00d4ff); // Cyan
      colorSecondary = new THREE.Color(0x0055ff); // Blue
      colorDim       = new THREE.Color(0x1e293b); // Dark slate
    } else {
      // Batman theme
      colorPrimary   = new THREE.Color(0xF5C518); // Bat yellow
      colorSecondary = new THREE.Color(0xFF8C00); // Amber
      colorDim       = new THREE.Color(0x1A1812); // Near-black warm
    }

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3]     = (Math.random() - 0.5) * 220;
      positions[i3 + 1] = (Math.random() - 0.5) * 130;
      positions[i3 + 2] = (Math.random() - 0.5) * 110;

      const t = Math.pow(Math.random(), 2.0);
      let c;
      if (t < 0.3)       c = colorDim.clone().lerp(colorSecondary, t / 0.3);
      else if (t < 0.75) c = colorSecondary.clone().lerp(colorPrimary, (t - 0.3) / 0.45);
      else               c = colorPrimary.clone().lerp(colorSecondary, (t - 0.75) / 0.25);

      colors[i3]     = c.r;
      colors[i3 + 1] = c.g;
      colors[i3 + 2] = c.b;

      sizes[i] = Math.random() * 2.2 + 0.3;
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pGeo.setAttribute("color",    new THREE.BufferAttribute(colors, 3));
    pGeo.setAttribute("size",     new THREE.BufferAttribute(sizes, 1));

    const pMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime:       { value: 0 },
        uPixelRatio: { value: renderer.getPixelRatio() },
      },
      vertexShader: `
        attribute vec3 color;
        attribute float size;
        uniform float uTime;
        uniform float uPixelRatio;
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          vColor = color;
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);

          float drift = sin(position.x * 0.04 + uTime * 0.25) * 0.8
                      + cos(position.z * 0.04 + uTime * 0.18) * 0.6;
          mvPos.y += drift;

          gl_PointSize = size * uPixelRatio * (180.0 / -mvPos.z);
          gl_Position  = projectionMatrix * mvPos;

          float flicker = 0.35 + 0.55 * abs(sin(position.x * 0.07 + uTime * 0.3));
          vAlpha = flicker;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          float d = length(gl_PointCoord - 0.5);
          if (d > 0.5) discard;
          float alpha = pow(1.0 - d * 2.0, 2.0);
          gl_FragColor = vec4(vColor, alpha * vAlpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: theme === "light" ? THREE.NormalBlending : THREE.AdditiveBlending,
      vertexColors: true,
    });

    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // =============================================
    // AMBIENT HALO GLOW
    // =============================================
    const haloGeo = new THREE.CircleGeometry(38, 64);
    const haloMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: colorPrimary },
      },
      vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor;
        varying vec2 vUv;
        void main() {
          float d = length(vUv - 0.5) * 2.0;
          float ring = smoothstep(0.85, 0.9, d) - smoothstep(0.9, 1.0, d);
          float pulse = 0.35 + 0.25 * sin(uTime * 0.8);
          float inner = (1.0 - d) * 0.05 * pulse;
          gl_FragColor = vec4(uColor, (ring * 0.4 + inner) * pulse);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: theme === "light" ? THREE.NormalBlending : THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });

    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.position.set(15, 10, -35);
    halo.rotation.x = -0.3;
    scene.add(halo);

    // Mouse Parallax
    let mouse = { x: 0, y: 0 };
    const onMouseMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      pMat.uniforms.uPixelRatio.value = renderer.getPixelRatio();
    };
    window.addEventListener("resize", onResize);

    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      pMat.uniforms.uTime.value   = t;
      haloMat.uniforms.uTime.value = t;

      particles.rotation.y = t * 0.012;
      particles.rotation.x = Math.sin(t * 0.008) * 0.05;
      halo.rotation.z      = t * 0.04;

      camera.position.x += (mouse.x * 8 - camera.position.x) * 0.03;
      camera.position.y += (mouse.y * 5 - camera.position.y) * 0.03;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      renderer.dispose();
      [pGeo, pMat, haloGeo, haloMat].forEach((o) => o.dispose());
    };
  }, [theme]);

  return (
    <div
      ref={mountRef}
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
    />
  );
}
