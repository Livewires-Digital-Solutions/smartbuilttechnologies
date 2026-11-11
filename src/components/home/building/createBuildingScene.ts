import type { ActiveLayer } from "./geometry";
import { B, COLOURS } from "./geometry";

type Three = typeof import("three");

/**
 * The hero building in real 3D. Four layers assemble on load (model, scan,
 * connect, hand over); the visitor can drag to rotate it, and the page can
 * isolate one layer. Orthographic camera at 30° elevation to match the brand's
 * isometric grid. Everything is plain three.js, loaded on demand.
 */
export function createBuildingScene(
  THREE: Three,
  host: HTMLElement,
  getActive: () => ActiveLayer,
  onReady: () => void,
  /** 0 to 1 while the hero is pinned and the page is scrolled; 0 otherwise */
  getProgress: () => number = () => 0,
): () => void {
  const { W, D, H, T, FLOORS } = B;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(dpr);
  renderer.setClearColor(0x000000, 0);
  const canvas = renderer.domElement;
  Object.assign(canvas.style, { width: "100%", height: "100%", display: "block", touchAction: "pan-y", cursor: "grab" });
  host.appendChild(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-5, 5, 5, -5, 0.1, 100);
  const BASE_Y = 3.5;
  const look = new THREE.Vector3(0, BASE_Y, 0);
  const aim = () => {
    camera.position.set(1, 0.816, 1).multiplyScalar(18).add(look);
    camera.lookAt(look);
  };
  aim();

  scene.add(new THREE.AmbientLight(0xffffff, 2.4));
  const sun = new THREE.DirectionalLight(0xffffff, 0.9);
  sun.position.set(6, 10, 4);
  scene.add(sun);

  const root = new THREE.Group();
  root.scale.setScalar(1.58);
  scene.add(root);

  /* ---- layer bookkeeping: every material belongs to one layer and fades with it ---- */
  type M = import("three").Material;
  const layerMats: M[][] = [[], [], [], []];
  const own = <T2 extends M>(m: T2, layer: number): T2 => {
    m.transparent = true;
    layerMats[layer]!.push(m);
    return m;
  };
  const hex = (c: string) => new THREE.Color(c);

  /* ---- ground grid (always visible) ---- */
  const grid = new THREE.GridHelper(40, 66, hex("#B4C0E0"), hex("#CDD7EE"));
  (grid.material as import("three").Material).transparent = true;
  root.add(grid);

  /* ---- layer 0 · MODEL: floor plates and columns ---- */
  const floors: import("three").Group[] = [];
  const slabGeo = new THREE.BoxGeometry(W, T, D);
  const slabEdges = new THREE.EdgesGeometry(slabGeo);
  const slabMat = own(new THREE.MeshLambertMaterial({ color: hex(COLOURS.paper) }), 0);
  const edgeMat = own(new THREE.LineBasicMaterial({ color: hex(COLOURS.navy) }), 0);
  for (let f = 0; f < FLOORS; f++) {
    const g = new THREE.Group();
    const slab = new THREE.Mesh(slabGeo, slabMat);
    slab.position.y = T / 2;
    const edges = new THREE.LineSegments(slabEdges, edgeMat);
    edges.position.y = T / 2;
    g.add(slab, edges);
    g.position.y = f * H;
    root.add(g);
    floors.push(g);
  }
  const colMat = own(new THREE.MeshLambertMaterial({ color: hex(COLOURS.navy) }), 0);
  const colGeo = new THREE.BoxGeometry(0.09, H - T, 0.09);
  colGeo.translate(0, (H - T) / 2, 0);
  const colPos: [number, number][] = [];
  for (const x of [-W / 2, 0, W / 2]) for (const z of [-D / 2, 0, D / 2]) if (!(x === 0 && z === 0)) colPos.push([x, z]);
  const columns: import("three").Mesh[][] = [];
  for (let f = 0; f < FLOORS - 1; f++) {
    const row: import("three").Mesh[] = [];
    for (const [x, z] of colPos) {
      const m = new THREE.Mesh(colGeo, colMat);
      m.position.set(x, f * H + T, z);
      root.add(m);
      row.push(m);
    }
    columns.push(row);
  }

  /* ---- layer 1 · SCAN: a point cloud on the facades ---- */
  const dot = (() => {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const g = c.getContext("2d")!;
    g.beginPath();
    g.arc(32, 32, 28, 0, Math.PI * 2);
    g.fillStyle = "#fff";
    g.fill();
    const t = new THREE.CanvasTexture(c);
    return t;
  })();
  const pts: number[] = [];
  const dev: number[] = [];
  const jit = (n: number) => Math.sin(n * 12.9898) * 0.012;
  for (let f = 0; f < FLOORS - 1; f++) {
    const y0 = f * H + T + 0.1;
    const y1 = (f + 1) * H - 0.06;
    for (let y = y0; y <= y1; y += 0.17) {
      for (let z = -D / 2 + 0.1; z <= D / 2 - 0.05; z += 0.22) {
        const isDev = f === 1 && z > -0.2 && z < 0.35 && y > y0 + 0.25 && y < y0 + 0.62;
        (isDev ? dev : pts).push(W / 2 + jit(z * y), y, z);
        pts.push(-W / 2 - jit(z + y), y, z);
      }
      for (let x = -W / 2 + 0.1; x <= W / 2 - 0.05; x += 0.22) {
        pts.push(x, y, D / 2 + jit(x + y));
        pts.push(x, y, -D / 2 - jit(x * y));
      }
    }
  }
  const scanGeo = new THREE.BufferGeometry();
  scanGeo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
  const scanCount = pts.length / 3;
  const scanMat = own(new THREE.PointsMaterial({ color: hex(COLOURS.sky), size: 3.4 * dpr, sizeAttenuation: false, map: dot, alphaTest: 0.5 }), 1);
  const scan = new THREE.Points(scanGeo, scanMat);
  root.add(scan);
  const devGeo = new THREE.BufferGeometry();
  devGeo.setAttribute("position", new THREE.Float32BufferAttribute(dev, 3));
  const devMat = own(new THREE.PointsMaterial({ color: hex(COLOURS.orange), size: 4.6 * dpr, sizeAttenuation: false, map: dot, alphaTest: 0.5 }), 1);
  const devPts = new THREE.Points(devGeo, devMat);
  root.add(devPts);

  /* ---- layer 2 · CONNECT: sensors, links, and the data node ---- */
  const connect = new THREE.Group();
  root.add(connect);
  const sx = W / 2 - 0.55;
  const sz = D / 2 - 0.55;
  const cobaltMesh = own(new THREE.MeshBasicMaterial({ color: hex(COLOURS.cobalt) }), 2);
  const cobaltLine = own(new THREE.LineBasicMaterial({ color: hex(COLOURS.cobalt) }), 2);
  const sensorGeo = new THREE.SphereGeometry(0.075, 20, 14);
  const ringGeo = new THREE.RingGeometry(0.15, 0.175, 40);
  const rings: { mesh: import("three").Mesh; mat: import("three").MeshBasicMaterial }[] = [];
  const topY = (FLOORS - 1) * H + T;
  const cloudY = topY + 1.15;
  const linkPts: number[] = [];
  for (let f = 0; f < FLOORS; f++) {
    const y = f * H + T + 0.075;
    const s = new THREE.Mesh(sensorGeo, cobaltMesh);
    s.position.set(sx, y, sz);
    connect.add(s);
    const ringMat = own(new THREE.MeshBasicMaterial({ color: hex(COLOURS.cobalt), side: THREE.DoubleSide }), 2);
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(sx, f * H + T + 0.01, sz);
    connect.add(ring);
    rings.push({ mesh: ring, mat: ringMat });
    // two nearby sensors on each floor, linked back to the main one
    for (const [dx, dz] of [[-1.15, 0], [0, -1.0]] as const) {
      const s2 = new THREE.Mesh(new THREE.SphereGeometry(0.05, 14, 10), cobaltMesh);
      s2.position.set(sx + dx, y - 0.02, sz + dz);
      connect.add(s2);
      linkPts.push(sx, y, sz, sx + dx, y - 0.02, sz + dz);
    }
  }
  const links = new THREE.LineSegments(new THREE.BufferGeometry().setAttribute("position", new THREE.Float32BufferAttribute(linkPts, 3)), cobaltLine);
  connect.add(links);
  const riser = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(sx, T + 0.075, sz), new THREE.Vector3(sx, cloudY - 0.28, sz)]),
    own(new THREE.LineDashedMaterial({ color: hex(COLOURS.cobalt), dashSize: 0.1, gapSize: 0.08 }), 2),
  );
  riser.computeLineDistances();
  connect.add(riser);
  const cloud = new THREE.Group();
  cloud.position.set(sx, cloudY, sz);
  const cardGeo = new THREE.BoxGeometry(1.0, 0.56, 0.06);
  cloud.add(new THREE.Mesh(cardGeo, own(new THREE.MeshBasicMaterial({ color: 0xffffff }), 2)));
  cloud.add(new THREE.LineSegments(new THREE.EdgesGeometry(cardGeo), cobaltLine));
  [0.16, 0.26, 0.2, 0.34].forEach((h, i) => {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.1, h, 0.04), cobaltMesh);
    bar.position.set(-0.3 + i * 0.2, -0.2 + h / 2, 0.05);
    cloud.add(bar);
  });
  connect.add(cloud);

  /* ---- layer 3 · HAND OVER: asset tags ---- */
  const tags = new THREE.Group();
  root.add(tags);
  const tagMat = own(new THREE.MeshLambertMaterial({ color: hex(COLOURS.orange) }), 3);
  const tagInner = own(new THREE.MeshBasicMaterial({ color: 0xffffff }), 3);
  const tagMeshes: import("three").Group[] = [];
  for (let f = 0; f < FLOORS; f++) {
    const y = f * H + T + 0.012;
    const spots: [number, number][] = [[W / 2 - 0.45, -0.7], [W / 2 - 0.45, 0.1], [W / 2 - 0.45, 0.85], [-0.4, D / 2 - 0.45], [0.7, D / 2 - 0.45]];
    for (const [x, z] of spots) {
      const g = new THREE.Group();
      const a = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.025, 0.26), tagMat);
      const b = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.03, 0.13), tagInner);
      g.add(a, b);
      g.position.set(x, y, z);
      tags.add(g);
      tagMeshes.push(g);
    }
  }

  /* ---- timeline ---- */
  const ease = (t: number) => 1 - Math.pow(1 - Math.min(Math.max(t, 0), 1), 3);
  const seg = (t: number, start: number, dur: number) => ease((t - start) / dur);

  const vis = [1, 1, 1, 1]; // smoothed visibility from the chosen layer
  let spin = -0.4;
  let spinV = 0;
  let dragging = false;
  let lastX = 0;
  let progS = 0;
  let visible = true;
  let ready = false;
  let raf = 0;
  const t0 = performance.now();
  let last = t0;

  const onDown = (e: PointerEvent) => {
    dragging = true;
    lastX = e.clientX;
    canvas.setPointerCapture(e.pointerId);
    canvas.style.cursor = "grabbing";
  };
  const onMove = (e: PointerEvent) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    lastX = e.clientX;
    spin += dx * 0.009;
    spinV = dx * 0.009;
  };
  const onUp = (e: PointerEvent) => {
    dragging = false;
    canvas.style.cursor = "grab";
    if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
  };
  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerup", onUp);
  canvas.addEventListener("pointercancel", onUp);

  const resize = () => {
    const w = host.clientWidth || 1;
    const h = host.clientHeight || 1;
    renderer.setSize(w, h, false);
    const aspect = w / h;
    const viewH = Math.max(11.2, 10.4 / aspect);
    const viewW = viewH * aspect;
    // on a wide panel the building sits a little right of centre, clear of the headline
    const shift = aspect > 1.0 ? viewW * 0.07 : 0;
    camera.left = -viewW / 2 - shift;
    camera.right = viewW / 2 - shift;
    camera.top = viewH / 2;
    camera.bottom = -viewH / 2;
    camera.updateProjectionMatrix();
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(host);
  const io = new IntersectionObserver(([en]) => {
    visible = !!en?.isIntersecting;
  });
  io.observe(host);

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    if (!visible || document.hidden) {
      last = now;
      return;
    }
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    const t = (now - t0) / 1000;

    // intro, in four beats
    const gridIn = seg(t, 0, 0.7);
    (grid.material as import("three").Material).opacity = gridIn * 0.9;
    floors.forEach((g, f) => {
      const e = seg(t, f * 0.2, 0.9);
      g.position.y = f * H - (1 - e) * 2.2;
    });
    const modelIn = seg(t, 0, 0.5);
    columns.forEach((row, f) => {
      const e = seg(t, 0.75 + f * 0.2, 0.7);
      row.forEach((m) => (m.scale.y = Math.max(e, 0.0001)));
    });
    const scanP = seg(t, 1.6, 1.5);
    scanGeo.setDrawRange(0, Math.floor(scanCount * scanP));
    devGeo.setDrawRange(0, Math.floor((dev.length / 3) * seg(t, 2.8, 0.5)));
    const connIn = seg(t, 2.9, 1.0);
    connect.position.y = (1 - connIn) * 1.6;
    const handIn = (i: number) => seg(t, 3.7 + i * 0.045, 0.45);
    tagMeshes.forEach((g, i) => g.scale.setScalar(Math.max(handIn(i), 0.0001)));
    if (!ready && t > 0.05) {
      ready = true;
      onReady();
    }

    // layer isolation
    const a = getActive();
    for (let l = 0; l < 4; l++) {
      const target = a === "all" || a === l ? 1 : l === 0 ? 0.35 : 0.08;
      vis[l] = vis[l]! + (target - vis[l]!) * (1 - Math.exp(-9 * dt));
    }
    const intro = [modelIn, seg(t, 1.6, 0.4), connIn, seg(t, 3.7, 0.3)];
    for (let l = 0; l < 4; l++) for (const m of layerMats[l]!) m.opacity = intro[l]! * vis[l]!;

    // sensor pulses and the facing data card
    rings.forEach((r, i) => {
      const ph = (t * 0.7 + i * 0.27) % 1;
      r.mesh.scale.setScalar(1 + ph * 1.6);
      r.mat.opacity = (1 - ph) * 0.7 * connIn * vis[2]!;
    });
    tagMeshes.forEach((g, i) => (g.position.y += Math.sin(t * 2 + i) * 0.0002));

    // scroll: while pinned the building turns, and the camera moves to each layer in turn
    const FOCUS_Y = [3.5, 3.3, 3.85, 3.0];
    const FOCUS_Z = [1.0, 1.08, 1.16, 1.08];
    progS += (getProgress() - progS) * (1 - Math.exp(-7 * dt));
    const fp = Math.min(Math.max(progS * 4 - 0.5, 0), 3);
    const i0 = Math.floor(fp);
    const i1 = Math.min(i0 + 1, 3);
    const f = fp - i0;
    const sm = f * f * (3 - 2 * f);
    const engaged = Math.min(progS * 14, 1) * (1 - Math.min(Math.max((progS - 0.96) * 25, 0), 1));
    const fy = FOCUS_Y[i0]! + (FOCUS_Y[i1]! - FOCUS_Y[i0]!) * sm;
    const fz = FOCUS_Z[i0]! + (FOCUS_Z[i1]! - FOCUS_Z[i0]!) * sm;
    look.y = BASE_Y + (fy - BASE_Y) * engaged;
    camera.zoom = 1 + (fz - 1) * engaged;
    camera.updateProjectionMatrix();
    aim();

    // rotation: drag with inertia, a slow sway, and the scroll turn
    if (!dragging) {
      spin += spinV;
      spinV *= 0.93;
    }
    root.rotation.y = spin + Math.sin(t * 0.32) * 0.22 * (1 - engaged * 0.85) + progS * Math.PI * 1.7;
    cloud.quaternion.copy(root.quaternion).invert().multiply(camera.quaternion);

    renderer.render(scene, camera);
  };
  raf = requestAnimationFrame(frame);

  return () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    io.disconnect();
    canvas.removeEventListener("pointerdown", onDown);
    canvas.removeEventListener("pointermove", onMove);
    canvas.removeEventListener("pointerup", onUp);
    canvas.removeEventListener("pointercancel", onUp);
    scene.traverse((o) => {
      const mesh = o as import("three").Mesh;
      mesh.geometry?.dispose?.();
    });
    layerMats.flat().forEach((m) => m.dispose());
    dot.dispose();
    renderer.dispose();
    canvas.remove();
  };
}
