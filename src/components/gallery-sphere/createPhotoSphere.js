import * as THREE from "three";
import { createInertialRotation, normalizeWheel, ROTATION_FRICTION } from "./inertialRotation.mjs";

// Imperative rendering keeps pointer movement and animation out of React's render loop.
export function createPhotoSphere(host, items, { onSelect, onHover, onReady, onError, onPhase }) {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);
  const canvas = renderer.domElement;
  canvas.setAttribute("aria-hidden", "true");
  host.appendChild(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  const geometry = new THREE.PlaneGeometry(1, 1);
  const loader = new THREE.TextureLoader();
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const rotation = new THREE.Euler(-0.12, 0.25, -0.08, "YXZ");
  const quaternion = new THREE.Quaternion().setFromEuler(rotation);
  const dragQuaternion = new THREE.Quaternion();
  const dragEuler = new THREE.Euler(0, 0, 0, "YXZ");
  const projected = new THREE.Vector3();
  let disposed = false;
  let visible = true;
  let frame = 0;
  let lastTime = 0;
  let introTime = 0;
  let loadWait = 0;
  let phase = "loading";
  let interacted = false;
  let dragging = false;
  let moved = 0;
  let lastX = 0;
  let lastY = 0;
  let startX = 0;
  let startY = 0;
  let activePointer = null;
  let pendingSelection = null;
  const motion = createInertialRotation();
  let autoSpeed = 0;
  let hovered = null;
  let loaded = 0;
  let failed = 0;
  let width = 1;
  let height = 1;
  let mobile = false;
  let paused = false;
  let focusedIndex = null;
  let focusAmount = 0;
  const introDuration = 3.6;
  const smooth = value => {
    const t = THREE.MathUtils.clamp(value, 0, 1);
    return t * t * (3 - 2 * t);
  };

  function setPhase(value) {
    if (phase !== value) { phase = value; onPhase(value); }
  }

  function finishIntro() { introTime = introDuration; setPhase("ready"); }

  function rotateBy(yaw, pitch) {
    rotation.y += yaw;
    rotation.x += pitch;
    // Camera-space increments keep the grabbed surface following the cursor,
    // even after the sphere has already spun around to the opposite side.
    dragEuler.set(pitch, yaw, 0);
    dragQuaternion.setFromEuler(dragEuler);
    quaternion.premultiply(dragQuaternion).normalize();
  }

  const cards = items.map((item, index) => {
    // A Fibonacci sphere distributes every photograph evenly without random overlaps.
    const y = 1 - (index + 0.5) * 2 / items.length;
    const ring = Math.sqrt(1 - y * y);
    const angle = index * Math.PI * (3 - Math.sqrt(5));
    const base = new THREE.Vector3(Math.cos(angle) * ring, y, Math.sin(angle) * ring).multiplyScalar(2.9);
    const material = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false, color: 0xffffff });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.visible = false;
    mesh.userData.index = index;
    scene.add(mesh);
    const card = { mesh, base, aspect: 0.75, scale: 1, appear: 0, ready: false };
    // Small textures for the orbit; the full-size photo is loaded only when opened.
    loader.load(`/_next/image?url=${encodeURIComponent(item.image)}&w=384&q=75`, (texture) => {
      if (disposed) { texture.dispose(); return; }
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
      card.aspect = texture.image.width / texture.image.height;
      card.ready = true;
      material.map = texture;
      material.needsUpdate = true;
      mesh.visible = true;
      loaded += 1;
      if (loaded === 1) onReady();
      start();
    }, undefined, () => {
      if (disposed) return;
      failed += 1;
      if (failed === items.length) onError();
    });
    return card;
  });

  function setHover(index) {
    if (index === hovered) return;
    hovered = index;
    host.style.cursor = dragging ? "grabbing" : index === null ? "grab" : "pointer";
    onHover(index);
  }

  function hit(x, y) {
    const rect = canvas.getBoundingClientRect();
    pointer.set(((x - rect.left) / rect.width) * 2 - 1, -((y - rect.top) / rect.height) * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(cards.filter(c => c.ready && c.mesh.material.opacity > 0.12).map(c => c.mesh));
    return hits[0]?.object.userData.index ?? null;
  }

  function select(index) {
    motion.reset();
    autoSpeed = 0;
    interacted = true;
    const mesh = cards[index].mesh;
    const rect = canvas.getBoundingClientRect();
    projected.copy(mesh.position).project(camera);
    const pixels = height / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * (camera.position.z - mesh.position.z));
    const photoWidth = mesh.scale.x * pixels;
    const photoHeight = mesh.scale.y * pixels;
    onSelect(index, {
      left: rect.left + (projected.x + 1) * rect.width / 2 - photoWidth / 2,
      top: rect.top + (1 - projected.y) * rect.height / 2 - photoHeight / 2,
      width: photoWidth,
      height: photoHeight,
    });
  }

  function resize() {
    width = host.clientWidth;
    height = host.clientHeight;
    if (!width || !height) return;
    mobile = width < 600;
    camera.aspect = width / height;
    // Fit the whole orbit, including the foreground photographs, inside either aspect ratio.
    camera.position.z = Math.max(10.8, 3.85 / (Math.tan(THREE.MathUtils.degToRad(19)) * camera.aspect));
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    start();
  }

  function tick(time) {
    frame = 0;
    if (disposed || !visible || paused || document.hidden) return;
    const dt = Math.min((time - (lastTime || time)) / 1000, 0.05);
    lastTime = time;
    loadWait += dt;
    // Start the choreography after enough thumbnails arrive, with a bounded wait
    // for slow connections. Pausing under the route cover preserves the full intro.
    if (loaded >= Math.min(8, items.length) || (loaded > 0 && loadWait > 2.5)) introTime = Math.min(introDuration, introTime + dt);
    const expanding = smooth((introTime - 2.35) / 1.25);
    setPhase(introTime >= introDuration ? "ready" : introTime >= 2.35 ? "expand" : introTime >= 1.9 ? "collapse" : introTime >= 1 ? "spin" : introTime > 0 ? "gather" : "loading");
    focusAmount += ((focusedIndex === null ? 0 : 1) - focusAmount) * (1 - Math.exp(-dt * 7));
    const canRotate = focusedIndex === null && focusAmount < 0.001;
    const targetAutoSpeed = canRotate && !dragging && !interacted && hovered === null && phase === "ready" ? 0.075 : 0;
    autoSpeed += (targetAutoSpeed - autoSpeed) * (1 - Math.exp(-dt * 4));
    if (canRotate) {
      const delta = motion.step(dt);
      rotateBy(delta.yaw + autoSpeed * dt, delta.pitch);
    }
    const ringCount = mobile ? 8 : 10;
    const gather = smooth(introTime / 0.85);
    const collapse = smooth((introTime - 1.9) / 0.45);
    const spinTime = Math.max(0, introTime - 0.7);
    const spinAngle = introTime * 0.35 + spinTime * spinTime * 1.8;
    cards.forEach((card, index) => {
      const { mesh, base, aspect } = card;
      let targetOpacity;
      let targetSize;
      // The same real 3D sphere on phones and desktop: front photos are larger
      // through perspective, rear photos recede, and both drag axes rotate it.
      mesh.position.copy(base).applyQuaternion(quaternion).multiplyScalar(mobile ? 1.05 : 1);
      const depth = THREE.MathUtils.clamp((mesh.position.z / (mobile ? 3.045 : 2.9) + 1) / 2, 0, 1);
      targetOpacity = mobile ? 0.18 + Math.pow(depth, 1.8) * 0.82 : 0.12 + Math.pow(depth, 1.5) * 0.88;
      targetSize = mobile ? 1.4 : 1.5;

      if (phase !== "ready") {
        const finalX = mesh.position.x;
        const finalY = mesh.position.y;
        const finalZ = mesh.position.z;
        const ringAngle = index / ringCount * Math.PI * 2 + spinAngle;
        const radius = 2.45 * gather * (1 - collapse);
        const ringX = Math.sin(ringAngle) * radius;
        const ringY = Math.cos(ringAngle) * radius;
        const ringZ = index < ringCount ? index * 0.015 * collapse : 0;
        mesh.position.set(
          THREE.MathUtils.lerp(ringX, finalX, expanding),
          THREE.MathUtils.lerp(ringY, finalY, expanding),
          THREE.MathUtils.lerp(ringZ, finalZ, expanding),
        );
        const ringOpacity = index < ringCount ? gather : 0;
        targetOpacity = THREE.MathUtils.lerp(ringOpacity, targetOpacity, expanding);
        targetSize = THREE.MathUtils.lerp((mobile ? 1.25 : 1.05) * (0.5 + gather * 0.5) * (1 - collapse * 0.2), targetSize, expanding);
      }
      mesh.quaternion.copy(camera.quaternion);
      const targetScale = index === hovered && !dragging ? 1.14 : 1;
      card.scale += (targetScale - card.scale) * (1 - Math.exp(-dt * 12));
      const size = targetSize * card.scale;
      mesh.scale.set(size * Math.min(aspect, 1), size * Math.min(1 / aspect, 1), 1);
      if (card.ready) card.appear = Math.min(1, card.appear + dt * 3);
      mesh.material.opacity = card.appear * targetOpacity;
      if (focusAmount > 0.001) {
        mesh.position.x *= 1 + focusAmount * 0.65;
        mesh.position.y *= 1 + focusAmount * 0.65;
        mesh.position.z -= focusAmount * 1.2;
        mesh.material.opacity *= 1 - focusAmount * 0.8;
      }
      if (index === focusedIndex) mesh.material.opacity = 0;
      mesh.visible = card.ready && mesh.material.opacity > 0.001;
    });
    renderer.render(scene, camera);
    start();
  }

  function start() {
    if (!frame && !disposed && visible && !paused && !document.hidden) frame = requestAnimationFrame(tick);
  }

  function down(event) {
    if (!event.isPrimary || event.button !== 0) return;
    if (phase !== "ready") { finishIntro(); return; }
    dragging = true;
    activePointer = event.pointerId;
    pendingSelection = null;
    interacted = true;
    moved = 0;
    lastX = event.clientX;
    lastY = event.clientY;
    startX = event.clientX;
    startY = event.clientY;
    motion.reset();
    autoSpeed = 0;
    setHover(null);
    host.setPointerCapture(event.pointerId);
    host.style.cursor = "grabbing";
  }

  function move(event) {
    if (dragging && event.pointerId === activePointer) {
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      moved = Math.max(moved, Math.hypot(event.clientX - startX, event.clientY - startY));
      const speed = mobile ? 0.009 : 0.005;
      const pitchSpeed = 0.005;
      motion.addImpulse(dx * speed * ROTATION_FRICTION, dy * pitchSpeed * ROTATION_FRICTION);
      lastX = event.clientX;
      lastY = event.clientY;
    } else if (event.pointerType !== "touch") setHover(hit(event.clientX, event.clientY));
  }

  function up(event) {
    if (!dragging || event.pointerId !== activePointer) return;
    dragging = false;
    if (host.hasPointerCapture(event.pointerId)) host.releasePointerCapture(event.pointerId);
    const tapTolerance = event.pointerType === "touch" ? 12 : 6;
    pendingSelection = moved < tapTolerance ? hit(event.clientX, event.clientY) : null;
    activePointer = null;
    host.style.cursor = "grab";
  }

  function click() {
    // Open after the native click, not pointerup: touch browsers can otherwise
    // deliver the completing click to the newly mounted dialog and close it.
    const index = pendingSelection;
    pendingSelection = null;
    if (index !== null) select(index);
  }

  function cancel() { dragging = false; activePointer = null; pendingSelection = null; setHover(null); }
  function leave() { if (!dragging) setHover(null); }
  function wheel(event) {
    // Trackpad pinch-to-zoom remains a browser gesture. Ordinary wheel input
    // belongs to the sphere while the pointer is over this surface.
    if (event.ctrlKey || paused || focusedIndex !== null) return;
    const input = normalizeWheel(event, height);
    if (!input.x && !input.y) return;
    event.preventDefault();
    finishIntro();
    interacted = true;
    setHover(null);
    // Wheel deltas describe scrolling content; reverse them so the visible
    // surface travels with the user's natural scrolling gesture.
    motion.addImpulse(-input.x * 0.009, -input.y * 0.009);
  }
  function key(event) {
    if (event.key.startsWith("Arrow") || event.key === "Enter" || event.key === " ") finishIntro();
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
      event.preventDefault();
      interacted = true;
      if (event.key === "ArrowLeft") motion.addImpulse(-0.8, 0);
      if (event.key === "ArrowRight") motion.addImpulse(0.8, 0);
      if (event.key === "ArrowUp") motion.addImpulse(0, -0.8);
      if (event.key === "ArrowDown") motion.addImpulse(0, 0.8);
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      let nearest = null;
      let distance = Infinity;
      cards.forEach(({ mesh, ready }, index) => {
        if (!ready || mesh.position.z < 0) return;
        projected.copy(mesh.position).project(camera);
        const d = projected.x ** 2 + projected.y ** 2;
        if (d < distance) { nearest = index; distance = d; }
      });
      if (nearest !== null) select(nearest);
    }
  }
  function contextLost(event) { event.preventDefault(); onError(); }
  function visibility() { lastTime = 0; start(); }
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; lastTime = 0; start(); });
  intersection.observe(host);
  host.addEventListener("pointerdown", down);
  host.addEventListener("pointermove", move);
  host.addEventListener("pointerup", up);
  host.addEventListener("click", click);
  host.addEventListener("pointercancel", cancel);
  host.addEventListener("pointerleave", leave);
  host.addEventListener("keydown", key);
  host.addEventListener("wheel", wheel, { passive: false });
  canvas.addEventListener("webglcontextlost", contextLost);
  document.addEventListener("visibilitychange", visibility);
  resize();

  function dispose() {
    disposed = true;
    cancelAnimationFrame(frame);
    observer.disconnect();
    intersection.disconnect();
    document.removeEventListener("visibilitychange", visibility);
    host.removeEventListener("pointerdown", down);
    host.removeEventListener("pointermove", move);
    host.removeEventListener("pointerup", up);
    host.removeEventListener("click", click);
    host.removeEventListener("pointercancel", cancel);
    host.removeEventListener("pointerleave", leave);
    host.removeEventListener("keydown", key);
    host.removeEventListener("wheel", wheel);
    canvas.removeEventListener("webglcontextlost", contextLost);
    cards.forEach(({ mesh }) => { mesh.material.map?.dispose(); mesh.material.dispose(); });
    geometry.dispose();
    renderer.dispose();
    canvas.remove();
  }
  return {
    dispose,
    setSelection(index) {
      if (focusedIndex === index) return;
      focusedIndex = index;
      motion.reset();
      autoSpeed = 0;
      // Closing a viewer starts a fresh idle rotation after the return flight.
      // Opening it keeps the scene still so the photo returns to the same spot.
      interacted = index !== null;
      setHover(null);
      start();
    },
    setPaused(value) {
      paused = value;
      lastTime = 0;
      if (paused) { cancelAnimationFrame(frame); frame = 0; }
      else start();
    },
  };
}
