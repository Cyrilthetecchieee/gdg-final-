"use client";

import { useEffect, useRef } from "react";
import type * as THREE from "three";
import { prefersReducedMotion } from "@/lib/motion-prefs";

/**
 * Real Three.js 3D Translucent Google-Coloured Glass Brackets (`< >`)
 * for the DevFest Madurai 2026 Hero Section.
 *
 * Matches the approved reference geometry, orientation, and lighting:
 *  - Stout rounded-capsule chevrons tilted at the exact reference angle
 *    (left `<` higher on the left/top, right `>` slightly lower on the right).
 *  - Left `<`: Red (#EA4335) vertex blending into Pink/Blue (#4285F4) upper arm
 *    and Electric Blue (#2563EB -> #3B82F6) lower arm.
 *  - Right `>`: Emerald Green (#10B981 -> #34A853) upper arm blending into
 *    Golden Yellow (#FBBC04 -> #F59E0B) lower arm and vertex.
 *  - Crisp white specular rim contours + internal low-poly crystal facet lines
 *    + bright point-light blooms at the tips and vertices.
 */
export function MaduraiHero3DBrackets({ className = "" }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let disposed = false;
    let rafId = 0;
    let renderer: THREE.WebGLRenderer | null = null;
    let cleanupListeners: (() => void) | null = null;

    (async () => {
      const THREE_MOD = await import("three");
      if (disposed || !container) return;

      const reduced = prefersReducedMotion();

      const width = container.clientWidth || 660;
      const height = container.clientHeight || 460;

      const scene = new THREE_MOD.Scene();

      const camera = new THREE_MOD.PerspectiveCamera(32, width / height, 0.1, 100);
      camera.position.set(0, 0, 10.6);

      try {
        renderer = new THREE_MOD.WebGLRenderer({
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        });
      } catch {
        return;
      }

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height);
      renderer.toneMapping = THREE_MOD.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.3;
      container.innerHTML = "";
      container.appendChild(renderer.domElement);

      // Studio reflection environment for crisp glass highlights
      const pmrem = new THREE_MOD.PMREMGenerator(renderer);
      const envScene = new THREE_MOD.Scene();
      envScene.background = new THREE_MOD.Color(0x060a18);

      const addLightPanel = (
        color: number,
        w: number,
        h: number,
        pos: [number, number, number],
      ) => {
        const mesh = new THREE_MOD.Mesh(
          new THREE_MOD.PlaneGeometry(w, h),
          new THREE_MOD.MeshBasicMaterial({ color, side: THREE_MOD.DoubleSide }),
        );
        mesh.position.set(pos[0], pos[1], pos[2]);
        mesh.lookAt(0, 0, 0);
        envScene.add(mesh);
      };

      addLightPanel(0xffffff, 14, 2.2, [0, 6.5, 4]);
      addLightPanel(0x93c5fd, 10, 3.0, [-6.5, -2.5, 4.5]);
      addLightPanel(0xfef08a, 10, 3.0, [6.5, -3.0, 4.5]);
      addLightPanel(0xffffff, 8, 1.5, [0, -6.0, 3.0]);

      const envRT = pmrem.fromScene(envScene, 0.025);
      scene.environment = envRT.texture;

      function applyChevronVertexColors(
        geo: THREE.BufferGeometry,
        tubularSegments: number,
        radialSegments: number,
        stops: [THREE.Color, THREE.Color, THREE.Color, THREE.Color, THREE.Color],
      ) {
        const count = geo.attributes.position.count;
        const colors = new Float32Array(count * 3);
        const ringCount = tubularSegments + 1;
        const vertsPerRing = radialSegments + 1;
        const tmp = new THREE_MOD.Color();

        for (let i = 0; i < ringCount; i++) {
          const t = i / tubularSegments; // 0..1 along chevron
          const scaled = t * (stops.length - 1);
          const idx0 = Math.min(stops.length - 2, Math.floor(scaled));
          const frac = scaled - idx0;
          tmp.lerpColors(stops[idx0], stops[idx0 + 1], frac);

          for (let j = 0; j < vertsPerRing; j++) {
            const idx = (i * vertsPerRing + j) * 3;
            if (idx + 2 < colors.length) {
              colors[idx] = tmp.r;
              colors[idx + 1] = tmp.g;
              colors[idx + 2] = tmp.b;
            }
          }
        }
        geo.setAttribute("color", new THREE_MOD.BufferAttribute(colors, 3));
      }

      function setSolidVertexColor(geo: THREE.BufferGeometry, color: THREE.Color) {
        const count = geo.attributes.position.count;
        const colors = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
          colors[i * 3] = color.r;
          colors[i * 3 + 1] = color.g;
          colors[i * 3 + 2] = color.b;
        }
        geo.setAttribute("color", new THREE_MOD.BufferAttribute(colors, 3));
      }

      function createEmissiveGradientMap(
        T: typeof THREE,
        stops: [THREE.Color, THREE.Color, THREE.Color, THREE.Color, THREE.Color],
      ) {
        const canvas = document.createElement("canvas");
        canvas.width = 256;
        canvas.height = 16;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const grad = ctx.createLinearGradient(0, 0, 256, 0);
          stops.forEach((c, idx) => {
            grad.addColorStop(idx / (stops.length - 1), `#${c.getHexString()}`);
          });
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, 256, 16);
        }
        const tex = new T.CanvasTexture(canvas);
        tex.needsUpdate = true;
        return tex;
      }

      function createGlassChevron(
        points: [THREE.Vector3, THREE.Vector3, THREE.Vector3],
        colorStops: [THREE.Color, THREE.Color, THREE.Color, THREE.Color, THREE.Color],
        rimColorHex: number,
      ) {
        const group = new THREE_MOD.Group();

        const [p0, pVertex, p2] = points;
        const cornerRadius = 0.34;
        const dirA = new THREE_MOD.Vector3().subVectors(p0, pVertex).normalize();
        const dirB = new THREE_MOD.Vector3().subVectors(p2, pVertex).normalize();
        const cornerStart = new THREE_MOD.Vector3().copy(pVertex).addScaledVector(dirA, cornerRadius);
        const cornerEnd = new THREE_MOD.Vector3().copy(pVertex).addScaledVector(dirB, cornerRadius);

        const curvePath = new THREE_MOD.CurvePath<THREE.Vector3>();
        curvePath.add(new THREE_MOD.LineCurve3(p0, cornerStart));
        curvePath.add(new THREE_MOD.QuadraticBezierCurve3(cornerStart, pVertex, cornerEnd));
        curvePath.add(new THREE_MOD.LineCurve3(cornerEnd, p2));

        const tubeRadius = 0.54;
        const tubularSegments = 48;
        const radialSegments = 24;

        // 1. Deep translucent tinted core inside the glass
        const coreGeo = new THREE_MOD.TubeGeometry(
          curvePath,
          tubularSegments,
          tubeRadius * 0.82,
          radialSegments,
          false,
        );
        applyChevronVertexColors(coreGeo, tubularSegments, radialSegments, colorStops);

        const coreMat = new THREE_MOD.MeshStandardMaterial({
          vertexColors: true,
          roughness: 0.18,
          metalness: 0.12,
          transparent: true,
          opacity: 0.66,
          emissive: new THREE_MOD.Color(0xffffff),
          emissiveMap: createEmissiveGradientMap(THREE_MOD, colorStops),
          emissiveIntensity: 0.55,
        });

        group.add(new THREE_MOD.Mesh(coreGeo, coreMat));

        const capGeo = new THREE_MOD.SphereGeometry(tubeRadius * 0.82, radialSegments, 14);
        const cap0Geo = capGeo.clone();
        setSolidVertexColor(cap0Geo, colorStops[0]);
        const cap0 = new THREE_MOD.Mesh(cap0Geo, coreMat);
        cap0.position.copy(p0);
        group.add(cap0);

        const cap2Geo = capGeo.clone();
        setSolidVertexColor(cap2Geo, colorStops[4]);
        const cap2 = new THREE_MOD.Mesh(cap2Geo, coreMat);
        cap2.position.copy(p2);
        group.add(cap2);

        // 2. Outer refractive glass shell (MeshPhysicalMaterial)
        const shellGeo = new THREE_MOD.TubeGeometry(curvePath, tubularSegments, tubeRadius, 32, false);
        applyChevronVertexColors(shellGeo, tubularSegments, 32, colorStops);

        const shellMat = new THREE_MOD.MeshPhysicalMaterial({
          vertexColors: true,
          transmission: 0.82,
          transparent: true,
          opacity: 0.95,
          roughness: 0.05,
          metalness: 0.02,
          ior: 1.54,
          thickness: 2.4,
          clearcoat: 1.0,
          clearcoatRoughness: 0.03,
          specularIntensity: 1.6,
          specularColor: new THREE_MOD.Color(0xffffff),
          envMapIntensity: 2.1,
          side: THREE_MOD.DoubleSide,
        });

        group.add(new THREE_MOD.Mesh(shellGeo, shellMat));

        const shellCapGeo = new THREE_MOD.SphereGeometry(tubeRadius, 32, 16);
        const shellCap0Geo = shellCapGeo.clone();
        setSolidVertexColor(shellCap0Geo, colorStops[0]);
        const shellCap0 = new THREE_MOD.Mesh(shellCap0Geo, shellMat);
        shellCap0.position.copy(p0);
        group.add(shellCap0);

        const shellCap2Geo = shellCapGeo.clone();
        setSolidVertexColor(shellCap2Geo, colorStops[4]);
        const shellCap2 = new THREE_MOD.Mesh(shellCap2Geo, shellMat);
        shellCap2.position.copy(p2);
        group.add(shellCap2);

        // 3. Internal geometric crystal facet lines (visible inside the glass capsules in the mockup)
        const facetGeo = new THREE_MOD.TubeGeometry(curvePath, 8, tubeRadius * 0.93, 6, false);
        const facetEdges = new THREE_MOD.EdgesGeometry(facetGeo, 10);
        const facetMat = new THREE_MOD.LineBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.45,
          blending: THREE_MOD.AdditiveBlending,
        });
        group.add(new THREE_MOD.LineSegments(facetEdges, facetMat));

        // 4. Outer specular rim highlight lines
        const rimGeo = new THREE_MOD.TubeGeometry(curvePath, 28, tubeRadius * 1.012, 8, false);
        const rimEdges = new THREE_MOD.EdgesGeometry(rimGeo, 24);
        const rimMat = new THREE_MOD.LineBasicMaterial({
          color: rimColorHex,
          transparent: true,
          opacity: 0.36,
          blending: THREE_MOD.AdditiveBlending,
        });
        group.add(new THREE_MOD.LineSegments(rimEdges, rimMat));

        return group;
      }

      const rootGroup = new THREE_MOD.Group();
      scene.add(rootGroup);

      // Left '<' chevron:
      // In the mockup, the upper arm points from the left red vertex up-right to a glowing blue/white tip,
      // and the lower arm points down-right to an electric blue tip.
      const leftBracket = createGlassChevron(
        [
          new THREE_MOD.Vector3(0.45, 1.48, 0.1),  // Top-right tip
          new THREE_MOD.Vector3(-1.95, 0.12, 0.38), // Left vertex
          new THREE_MOD.Vector3(0.18, -1.22, -0.05), // Bottom-right tip
        ],
        [
          new THREE_MOD.Color("#3B82F6"), // Top tip Blue
          new THREE_MOD.Color("#EC4899"), // Upper-mid Pink/Magenta refraction
          new THREE_MOD.Color("#EA4335"), // Vertex Red
          new THREE_MOD.Color("#6366F1"), // Lower-mid Indigo-Blue transition
          new THREE_MOD.Color("#1D4ED8"), // Bottom tip Deep Electric Blue
        ],
        0x93c5fd,
      );
      leftBracket.position.set(-0.92, 0.28, 0.15);
      leftBracket.rotation.set(0.06, 0.14, 0.0);
      rootGroup.add(leftBracket);

      // Right '>' chevron:
      // In the mockup, the upper arm is translucent emerald-teal green, meeting the golden-yellow lower arm at the right vertex.
      const rightBracket = createGlassChevron(
        [
          new THREE_MOD.Vector3(-0.18, 1.22, -0.05), // Top-left tip
          new THREE_MOD.Vector3(1.95, -0.12, 0.38),  // Right vertex
          new THREE_MOD.Vector3(-0.45, -1.48, 0.1),  // Bottom-left tip
        ],
        [
          new THREE_MOD.Color("#10B981"), // Top tip Emerald/Teal Green
          new THREE_MOD.Color("#34A853"), // Upper-mid Google Green
          new THREE_MOD.Color("#FACC15"), // Vertex bright Yellow-Gold
          new THREE_MOD.Color("#FBBC04"), // Lower-mid Google Yellow
          new THREE_MOD.Color("#F59E0B"), // Bottom tip Warm Amber-Yellow
        ],
        0xfef08a,
      );
      rightBracket.position.set(1.02, -0.22, 0.05);
      rightBracket.rotation.set(-0.04, -0.14, 0.0);
      rootGroup.add(rightBracket);

      // Position slightly higher in the canvas so the two temple gopurams below remain clearly visible
      rootGroup.position.set(0.08, 0.25, 0);
      rootGroup.rotation.set(0.05, -0.08, -0.04);

      // Lighting
      scene.add(new THREE_MOD.AmbientLight(0xffffff, 1.25));

      const keyLight = new THREE_MOD.DirectionalLight(0xffffff, 3.6);
      keyLight.position.set(3, 6, 8);
      scene.add(keyLight);

      const redGlow = new THREE_MOD.PointLight(0xff4d4d, 9, 10);
      redGlow.position.set(-3.2, 0.4, 3.2);
      scene.add(redGlow);

      const blueGlow = new THREE_MOD.PointLight(0x60a5fa, 10, 10);
      blueGlow.position.set(-0.5, 2.4, 3.5);
      scene.add(blueGlow);

      const yellowGlow = new THREE_MOD.PointLight(0xfacc15, 10, 10);
      yellowGlow.position.set(3.2, -0.8, 3.5);
      scene.add(yellowGlow);

      const greenGlow = new THREE_MOD.PointLight(0x34d399, 8, 10);
      greenGlow.position.set(1.2, 2.0, 3.2);
      scene.add(greenGlow);

      // Mouse & scroll responsiveness
      let targetMouseX = 0;
      let targetMouseY = 0;
      let currentMouseX = 0;
      let currentMouseY = 0;
      let scrollProgress = 0;

      const onPointerMove = (e: PointerEvent) => {
        if (reduced) return;
        const rect = container.getBoundingClientRect();
        const nx = ((e.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1;
        const ny = -(((e.clientY - rect.top) / Math.max(rect.height, 1)) * 2 - 1);
        targetMouseX = Math.max(-1, Math.min(1, nx));
        targetMouseY = Math.max(-1, Math.min(1, ny));
      };

      const onScroll = () => {
        if (reduced) return;
        scrollProgress = Math.min(1, Math.max(0, window.scrollY / 700));
      };

      const onResize = () => {
        if (!container || !renderer) return;
        const w = container.clientWidth || 660;
        const h = container.clientHeight || 460;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };

      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onResize);

      cleanupListeners = () => {
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onResize);
      };

      const clock = new THREE_MOD.Clock();

      const animate = () => {
        if (disposed || !renderer) return;
        const t = clock.getElapsedTime();

        currentMouseX += (targetMouseX - currentMouseX) * 0.06;
        currentMouseY += (targetMouseY - currentMouseY) * 0.06;

        if (!reduced) {
          leftBracket.position.y = 0.28 + Math.sin(t * 1.3) * 0.08;
          rightBracket.position.y = -0.22 + Math.sin(t * 1.3 + 1.1) * 0.08;

          leftBracket.rotation.y = 0.14 + Math.sin(t * 0.85) * 0.04 + currentMouseX * 0.12;
          rightBracket.rotation.y = -0.14 + Math.cos(t * 0.85) * 0.04 + currentMouseX * 0.12;

          rootGroup.rotation.y = -0.08 + currentMouseX * 0.14 + scrollProgress * 0.2;
          rootGroup.rotation.x = 0.05 - currentMouseY * 0.1 - scrollProgress * 0.12;
          rootGroup.position.y = 0.25 - scrollProgress * 0.35;
        }

        renderer.render(scene, camera);
        if (!reduced) {
          rafId = window.requestAnimationFrame(animate);
        }
      };

      animate();
    })();

    return () => {
      disposed = true;
      if (rafId) window.cancelAnimationFrame(rafId);
      if (cleanupListeners) cleanupListeners();
      if (renderer) {
        renderer.dispose();
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`pointer-events-none relative select-none ${className}`}
      aria-hidden="true"
    />
  );
}
