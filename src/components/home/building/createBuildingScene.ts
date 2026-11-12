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

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(dpr);
  renderer.setClearColor(0x000000, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const canvas = renderer.domElement;
  Object.assign(canvas.style, {
    width: "100%",
    height: "100%",
    display: "block",
    touchAction: "pan-y",
    cursor: "grab",
  });
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

  scene.add(new THREE.AmbientLight(0xffffff, 2.2));
  // a low sun from the left front, so the building throws a soft shadow to the right and back
  const sun = new THREE.DirectionalLight(0xffffff, 1.25);
  sun.position.set(-6, 12, 7);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, {
    left: -11,
    right: 11,
    top: 11,
    bottom: -11,
    near: 1,
    far: 40,
  });
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.03;
  sun.shadow.radius = 4;
  scene.add(sun);

  const root = new THREE.Group();
  root.scale.setScalar(1.58);
  scene.add(root);

  /* ---- layer bookkeeping: every material belongs to one layer and fades with it ---- */
  type M = import("three").Material;
  const layerMats: M[][] = [[], [], [], []];
  /** `base` is the material's own opacity at full strength; the layer fade multiplies it. */
  const own = <T2 extends M>(m: T2, layer: number, base = 1): T2 => {
    m.transparent = true;
    m.userData.base = base;
    layerMats[layer]!.push(m);
    return m;
  };
  /** Surroundings: always on, fading in with the ground and dimming a little when a layer is isolated. */
  const ctxMats: { m: M; base: number }[] = [];
  const ctx = <T2 extends M>(m: T2, base = 1): T2 => {
    m.transparent = true;
    ctxMats.push({ m, base });
    return m;
  };
  const shade = <O extends import("three").Object3D>(
    o: O,
    cast = true,
    receive = false,
  ): O => {
    o.castShadow = cast;
    o.receiveShadow = receive;
    return o;
  };
  const gradient = (stops: [number, string][]) => {
    const c = document.createElement("canvas");
    c.width = 2;
    c.height = 256;
    const g = c.getContext("2d")!;
    const gr = g.createLinearGradient(0, 0, 0, 256);
    for (const [o, col] of stops) gr.addColorStop(o, col);
    g.fillStyle = gr;
    g.fillRect(0, 0, 2, 256);
    return new THREE.CanvasTexture(c);
  };
  const topY = (FLOORS - 1) * H + T;
  const hex = (c: string) => new THREE.Color(c);

  /* ---- ground grid (always visible) ---- */
  const grid = new THREE.GridHelper(40, 66, hex("#B4C0E0"), hex("#CDD7EE"));
  (grid.material as import("three").Material).transparent = true;
  grid.position.y = 0.006;
  root.add(grid);

  /* ---- a small studio environment, used only for glass reflections ---- */
  const skyTex = gradient([
    [0, "#8FBBFF"],
    [0.46, "#F1F6FF"],
    [0.54, "#FFFFFF"],
    [1, "#BFCBE6"],
  ]);
  const envScene = new THREE.Scene();
  envScene.add(
    new THREE.Mesh(
      new THREE.SphereGeometry(40, 32, 16),
      new THREE.MeshBasicMaterial({ map: skyTex, side: THREE.BackSide }),
    ),
  );
  const strip = new THREE.MeshBasicMaterial({
    color: new THREE.Color(7, 7, 7),
    side: THREE.DoubleSide,
  });
  for (const [x, y, z, w, h] of [
    [18, 9, 6, 10, 3],
    [-14, 15, 10, 14, 2],
    [4, 24, -16, 20, 4],
    [-6, 6, -20, 12, 2],
  ] as const) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), strip);
    m.position.set(x, y, z);
    m.lookAt(0, 0, 0);
    envScene.add(m);
  }
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(envScene, 0.02).texture;

  /* ---- ground: a soft pad, a shadow catcher, the plaza and a ring road ---- */
  const padTex = (() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const g = c.getContext("2d")!;
    const r = g.createRadialGradient(128, 128, 8, 128, 128, 128);
    r.addColorStop(0, "rgba(255,255,255,1)");
    r.addColorStop(0.6, "rgba(255,255,255,0.8)");
    r.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = r;
    g.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(c);
  })();
  const pad = new THREE.Mesh(
    new THREE.CircleGeometry(9, 64),
    ctx(
      new THREE.MeshBasicMaterial({
        map: padTex,
        color: hex("#D9E3F8"),
        depthWrite: false,
      }),
    ),
  );
  pad.rotation.x = -Math.PI / 2;
  pad.position.y = -0.006;
  root.add(pad);
  const shadowCatcher = new THREE.Mesh(
    new THREE.PlaneGeometry(30, 30),
    ctx(new THREE.ShadowMaterial({ opacity: 0.17 }), 0.17),
  );
  shadowCatcher.rotation.x = -Math.PI / 2;
  shadowCatcher.position.y = 0.003;
  shadowCatcher.receiveShadow = true;
  root.add(shadowCatcher);

  const flat = (
    w: number,
    d: number,
    x: number,
    z: number,
    y: number,
    h: number,
    colour: string,
    edge = 0,
  ) => {
    const geo = new THREE.BoxGeometry(w, h, d);
    const m = shade(
      new THREE.Mesh(
        geo,
        ctx(
          new THREE.MeshStandardMaterial({ color: hex(colour), roughness: 1 }),
        ),
      ),
      false,
      true,
    );
    m.position.set(x, y + h / 2, z);
    root.add(m);
    if (edge) {
      const l = new THREE.LineSegments(
        new THREE.EdgesGeometry(geo),
        ctx(new THREE.LineBasicMaterial({ color: hex(COLOURS.navy) }), edge),
      );
      l.position.copy(m.position);
      root.add(l);
    }
    return m;
  };
  flat(W + 2.0, D + 2.0, 0, 0, 0, 0.03, "#F1F4FC", 0.22); // plaza
  flat(0.9, 1.6, 0, D / 2 + 1.0 + 0.8, 0, 0.032, "#E4EAF8"); // entrance path
  const RX = W / 2 + 1.45;
  const RZ = D / 2 + 1.35;
  for (const sgn of [-1, 1]) {
    flat(0.4, RZ * 2 + 0.4, sgn * RX, 0, 0, 0.02, "#D5DDEF");
    flat(RX * 2 + 0.4, 0.4, 0, sgn * RZ, 0, 0.02, "#D5DDEF");
  }
  // neighbouring buildings and trees, low enough never to hide the main building
  const grow: {
    o: import("three").Object3D;
    start: number;
    uniform: boolean;
  }[] = [];
  const blocks: [number, number, number, number, number][] = [
    [-(W / 2 + 2.5), -0.9, 1.3, 1.5, 0.85],
    [-(W / 2 + 2.45), 1.7, 1.1, 1.1, 0.55],
    [W / 2 + 2.55, -1.5, 1.4, 1.4, 1.0],
    [W / 2 + 2.45, 1.5, 1.0, 1.2, 0.5],
    [-0.5, -(D / 2 + 2.4), 1.8, 1.1, 0.75],
    [1.9, -(D / 2 + 2.35), 1.0, 1.0, 1.05],
    [-1.5, D / 2 + 2.45, 1.3, 0.9, 0.4],
  ];
  const blockMat = ctx(
    new THREE.MeshStandardMaterial({ color: hex("#E9EEFA"), roughness: 0.95 }),
  );
  const blockEdge = ctx(
    new THREE.LineBasicMaterial({ color: hex(COLOURS.navy) }),
    0.28,
  );
  blocks.forEach(([x, z, w, d, h], i) => {
    const geo = new THREE.BoxGeometry(w, h, d);
    geo.translate(0, h / 2, 0);
    const g = new THREE.Group();
    g.add(
      shade(new THREE.Mesh(geo, blockMat), true, true),
      new THREE.LineSegments(new THREE.EdgesGeometry(geo), blockEdge),
    );
    g.position.set(x, 0, z);
    root.add(g);
    grow.push({ o: g, start: 0.35 + i * 0.09, uniform: false });
  });
  const crownGeo = new THREE.IcosahedronGeometry(0.24, 1);
  const trunkGeo = new THREE.CylinderGeometry(0.018, 0.028, 0.24, 6);
  trunkGeo.translate(0, 0.12, 0);
  const crownMats = [
    ctx(
      new THREE.MeshStandardMaterial({
        color: hex("#BCD3F8"),
        roughness: 1,
        flatShading: true,
      }),
    ),
    ctx(
      new THREE.MeshStandardMaterial({
        color: hex("#9EC1F5"),
        roughness: 1,
        flatShading: true,
      }),
    ),
  ];
  const trunkMat = ctx(
    new THREE.MeshStandardMaterial({ color: hex("#5B6A9A"), roughness: 1 }),
    0.8,
  );
  const treeSpots: [number, number][] = [
    [-2.3, 2.0],
    [-2.3, 0.9],
    [-2.3, -0.3],
    [-2.3, -1.5],
    [2.35, -1.7],
    [2.35, -0.6],
    [2.35, 1.8],
    [-1.2, -1.95],
    [0.2, -2.1],
    [1.4, -1.95],
    [-1.6, 2.05],
    [1.7, 2.05],
  ];
  treeSpots.forEach(([x, z], i) => {
    const g = new THREE.Group();
    const crown = shade(new THREE.Mesh(crownGeo, crownMats[i % 2]!));
    crown.position.y = 0.4;
    crown.scale.y = 1.2;
    g.add(shade(new THREE.Mesh(trunkGeo, trunkMat)), crown);
    g.position.set(x, 0.03, z);
    g.scale.setScalar(0.85 + (i % 3) * 0.15);
    root.add(g);
    grow.push({ o: g, start: 1.0 + i * 0.05, uniform: true });
  });

  /* ---- layer 0 · MODEL: floor plates and columns ---- */
  const floors: import("three").Group[] = [];
  const slabGeo = new THREE.BoxGeometry(W, T, D);
  const slabEdges = new THREE.EdgesGeometry(slabGeo);
  const slabMat = own(
    new THREE.MeshLambertMaterial({ color: hex(COLOURS.paper) }),
    0,
  );
  const edgeMat = own(
    new THREE.LineBasicMaterial({ color: hex(COLOURS.navy) }),
    0,
  );
  for (let f = 0; f < FLOORS; f++) {
    const g = new THREE.Group();
    const slab = shade(new THREE.Mesh(slabGeo, slabMat), true, true);
    slab.position.y = T / 2;
    const edges = new THREE.LineSegments(slabEdges, edgeMat);
    edges.position.y = T / 2;
    g.add(slab, edges);
    g.position.y = f * H;
    root.add(g);
    floors.push(g);
  }
  const colMat = own(
    new THREE.MeshLambertMaterial({ color: hex(COLOURS.navy) }),
    0,
  );
  const colGeo = new THREE.BoxGeometry(0.09, H - T, 0.09);
  colGeo.translate(0, (H - T) / 2, 0);
  const colPos: [number, number][] = [];
  for (const x of [-W / 2, 0, W / 2])
    for (const z of [-D / 2, 0, D / 2])
      if (!(x === 0 && z === 0)) colPos.push([x, z]);
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

  /* glass curtain wall, mullions, the lift core, the roof and the entrance, all part of the model */
  const glassMat = own(
    new THREE.MeshStandardMaterial({
      color: hex("#8DB8FF"),
      roughness: 0.06,
      metalness: 0.15,
      envMap: envTex,
      envMapIntensity: 1.6,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
    0,
    0.34,
  );
  const mullMat = own(
    new THREE.MeshLambertMaterial({ color: hex("#6E7FB0") }),
    0,
    0.9,
  );
  const GH = H - T;
  const mullGeo = new THREE.BoxGeometry(0.028, GH, 0.028);
  mullGeo.translate(0, GH / 2, 0);
  const frontGeo = new THREE.PlaneGeometry(W, GH);
  frontGeo.translate(0, GH / 2, 0);
  const sideGeo = new THREE.PlaneGeometry(D, GH);
  sideGeo.translate(0, GH / 2, 0);
  const glassGroups: import("three").Group[] = [];
  for (let f = 0; f < FLOORS - 1; f++) {
    const g = new THREE.Group();
    g.position.y = f * H + T;
    for (const sgn of [-1, 1]) {
      const fr = new THREE.Mesh(frontGeo, glassMat);
      fr.position.z = (sgn * D) / 2;
      fr.renderOrder = 3;
      const sd = new THREE.Mesh(sideGeo, glassMat);
      sd.rotation.y = Math.PI / 2;
      sd.position.x = (sgn * W) / 2;
      sd.renderOrder = 3;
      g.add(fr, sd);
      for (let i = 0; i <= 6; i++) {
        const m = new THREE.Mesh(mullGeo, mullMat);
        m.position.set(-W / 2 + (W / 6) * i, 0, (sgn * D) / 2);
        g.add(m);
      }
      for (let i = 1; i < 5; i++) {
        const m = new THREE.Mesh(mullGeo, mullMat);
        m.position.set((sgn * W) / 2, 0, -D / 2 + (D / 5) * i);
        g.add(m);
      }
    }
    root.add(g);
    glassGroups.push(g);
  }
  // lift and stair core, through the middle of every floor and up through the roof
  const coreH = topY + 0.45;
  const coreGeo = new THREE.BoxGeometry(0.8, coreH, 0.8);
  coreGeo.translate(0, coreH / 2, 0);
  const core = shade(
    new THREE.Mesh(
      coreGeo,
      own(
        new THREE.MeshStandardMaterial({
          color: hex("#E3EAF9"),
          roughness: 0.6,
        }),
        0,
      ),
    ),
    true,
    true,
  );
  core.add(
    new THREE.LineSegments(
      new THREE.EdgesGeometry(coreGeo),
      own(new THREE.LineBasicMaterial({ color: hex(COLOURS.navy) }), 0, 0.7),
    ),
  );
  root.add(core);
  // roof: parapet, plant, fans and solar panels, sitting on the top slab
  const roofG = floors[FLOORS - 1]!;
  const parapetMat = own(
    new THREE.MeshStandardMaterial({
      color: hex(COLOURS.paper),
      roughness: 0.8,
    }),
    0,
  );
  for (const [w, d, x, z] of [
    [W, 0.05, 0, D / 2 - 0.025],
    [W, 0.05, 0, -D / 2 + 0.025],
    [0.05, D, W / 2 - 0.025, 0],
    [0.05, D, -W / 2 + 0.025, 0],
  ] as const) {
    const m = shade(
      new THREE.Mesh(new THREE.BoxGeometry(w, 0.14, d), parapetMat),
    );
    m.position.set(x, T + 0.07, z);
    roofG.add(m);
  }
  const plantMat = own(
    new THREE.MeshStandardMaterial({ color: hex("#E1E8F8"), roughness: 0.7 }),
    0,
  );
  const fanMat = own(
    new THREE.MeshStandardMaterial({
      color: hex("#26356F"),
      roughness: 0.4,
      metalness: 0.3,
    }),
    0,
  );
  const plantEdge = own(
    new THREE.LineBasicMaterial({ color: hex(COLOURS.navy) }),
    0,
    0.8,
  );
  const assetEdge = own(
    new THREE.LineBasicMaterial({ color: hex(COLOURS.orange) }),
    3,
  );
  const markerMat = own(
    new THREE.MeshLambertMaterial({ color: hex(COLOURS.orange) }),
    3,
  );
  const markers: { m: import("three").Mesh; y: number }[] = [];
  const plant: [number, number, number, number, number][] = [
    [-1.05, -0.55, 0.95, 0.6, 0.34],
    [0.2, -0.72, 0.62, 0.5, 0.26],
    [-1.2, 0.55, 0.72, 0.5, 0.22],
  ];
  for (const [x, z, w, d, h] of plant) {
    const geo = new THREE.BoxGeometry(w, h, d);
    const m = shade(new THREE.Mesh(geo, plantMat), true, true);
    m.position.set(x, T + h / 2, z);
    roofG.add(m);
    const e = new THREE.LineSegments(new THREE.EdgesGeometry(geo), plantEdge);
    e.position.copy(m.position);
    roofG.add(e);
    const ae = new THREE.LineSegments(
      new THREE.EdgesGeometry(
        new THREE.BoxGeometry(w + 0.06, h + 0.06, d + 0.06),
      ),
      assetEdge,
    );
    ae.position.copy(m.position);
    roofG.add(ae);
    const fan = new THREE.Mesh(
      new THREE.CylinderGeometry(
        Math.min(w, d) * 0.3,
        Math.min(w, d) * 0.3,
        0.02,
        28,
      ),
      fanMat,
    );
    fan.position.set(x - w * 0.15, T + h + 0.012, z);
    roofG.add(fan);
    const mk = new THREE.Mesh(new THREE.OctahedronGeometry(0.085), markerMat);
    const my = T + h + 0.42;
    mk.position.set(x, my, z);
    roofG.add(mk);
    markers.push({ m: mk, y: my });
  }
  const panelMat = own(
    new THREE.MeshStandardMaterial({
      color: hex("#1B2C6E"),
      roughness: 0.25,
      metalness: 0.5,
      envMap: envTex,
      envMapIntensity: 1.2,
    }),
    0,
  );
  for (let i = 0; i < 3; i++) {
    const pnl = shade(
      new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.022, 0.4), panelMat),
    );
    pnl.position.set(0.95, T + 0.1, -0.75 + i * 0.5);
    pnl.rotation.x = -0.3;
    roofG.add(pnl);
  }
  // entrance canopy on the front of the ground floor
  const canopyMat = own(
    new THREE.MeshStandardMaterial({
      color: hex(COLOURS.paper),
      roughness: 0.8,
    }),
    0,
  );
  const ground = floors[0]!;
  const canopy = shade(
    new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.05, 0.7), canopyMat),
    true,
    true,
  );
  canopy.position.set(0, T + 0.78, D / 2 + 0.3);
  ground.add(canopy);
  for (const x of [-0.68, 0.68]) {
    const post = shade(
      new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.78, 0.05), colMat),
    );
    post.position.set(x, T + 0.39, D / 2 + 0.58);
    ground.add(post);
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
        const isDev =
          f === 1 && z > -0.2 && z < 0.35 && y > y0 + 0.25 && y < y0 + 0.62;
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
  // cobalt at the base, fading to sky at the top
  const cA = hex(COLOURS.cobalt);
  const cB = hex(COLOURS.sky);
  const tmp = new THREE.Color();
  const cols: number[] = [];
  for (let i = 0; i < pts.length; i += 3) {
    tmp.copy(cA).lerp(cB, Math.min(1, pts[i + 1]! / (FLOORS * H)));
    cols.push(tmp.r, tmp.g, tmp.b);
  }
  scanGeo.setAttribute("color", new THREE.Float32BufferAttribute(cols, 3));
  const scanCount = pts.length / 3;
  const scanMat = own(
    new THREE.PointsMaterial({
      color: 0xffffff,
      vertexColors: true,
      size: 3.4 * dpr,
      sizeAttenuation: false,
      map: dot,
      alphaTest: 0.5,
    }),
    1,
  );
  const scan = new THREE.Points(scanGeo, scanMat);
  root.add(scan);
  // the laser sweep: a glowing plane that rides up the building while it is scanned
  const sweep = new THREE.Group();
  const sweepFill = own(
    new THREE.MeshBasicMaterial({
      color: hex(COLOURS.sky),
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
    1,
    0.3,
  );
  const sweepLine = own(
    new THREE.LineBasicMaterial({ color: hex(COLOURS.cobalt) }),
    1,
    0.95,
  );
  const sa = (W + 0.5) / 2;
  const sb = (D + 0.5) / 2;
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(sa * 2, sb * 2),
    sweepFill,
  );
  plane.rotation.x = -Math.PI / 2;
  const outline = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-sa, 0, -sb),
      new THREE.Vector3(sa, 0, -sb),
      new THREE.Vector3(sa, 0, sb),
      new THREE.Vector3(-sa, 0, sb),
    ]),
    sweepLine,
  );
  sweep.add(plane, outline);
  root.add(sweep);
  const devGeo = new THREE.BufferGeometry();
  devGeo.setAttribute("position", new THREE.Float32BufferAttribute(dev, 3));
  const devMat = own(
    new THREE.PointsMaterial({
      color: hex(COLOURS.orange),
      size: 4.6 * dpr,
      sizeAttenuation: false,
      map: dot,
      alphaTest: 0.5,
    }),
    1,
  );
  const devPts = new THREE.Points(devGeo, devMat);
  root.add(devPts);

  /* ---- layer 2 · CONNECT: sensors, links, and the data node ---- */
  const connect = new THREE.Group();
  root.add(connect);
  const sx = W / 2 - 0.55;
  const sz = D / 2 - 0.55;
  const cobaltMesh = own(
    new THREE.MeshBasicMaterial({ color: hex(COLOURS.cobalt) }),
    2,
  );
  const cobaltLine = own(
    new THREE.LineBasicMaterial({ color: hex(COLOURS.cobalt) }),
    2,
  );
  const sensorGeo = new THREE.SphereGeometry(0.075, 20, 14);
  const ringGeo = new THREE.RingGeometry(0.15, 0.175, 40);
  const rings: {
    mesh: import("three").Mesh;
    mat: import("three").MeshBasicMaterial;
  }[] = [];
  const cloudY = topY + 1.15;
  const linkPts: number[] = [];
  for (let f = 0; f < FLOORS; f++) {
    const y = f * H + T + 0.075;
    const s = new THREE.Mesh(sensorGeo, cobaltMesh);
    s.position.set(sx, y, sz);
    connect.add(s);
    const ringMat = own(
      new THREE.MeshBasicMaterial({
        color: hex(COLOURS.cobalt),
        side: THREE.DoubleSide,
      }),
      2,
    );
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(sx, f * H + T + 0.01, sz);
    connect.add(ring);
    rings.push({ mesh: ring, mat: ringMat });
    // two nearby sensors on each floor, linked back to the main one
    for (const [dx, dz] of [
      [-1.15, 0],
      [0, -1.0],
    ] as const) {
      const s2 = new THREE.Mesh(
        new THREE.SphereGeometry(0.05, 14, 10),
        cobaltMesh,
      );
      s2.position.set(sx + dx, y - 0.02, sz + dz);
      connect.add(s2);
      linkPts.push(sx, y, sz, sx + dx, y - 0.02, sz + dz);
    }
  }
  const links = new THREE.LineSegments(
    new THREE.BufferGeometry().setAttribute(
      "position",
      new THREE.Float32BufferAttribute(linkPts, 3),
    ),
    cobaltLine,
  );
  connect.add(links);
  const riser = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(sx, T + 0.075, sz),
      new THREE.Vector3(sx, cloudY - 0.28, sz),
    ]),
    own(
      new THREE.LineDashedMaterial({
        color: hex(COLOURS.cobalt),
        dashSize: 0.1,
        gapSize: 0.08,
      }),
      2,
    ),
  );
  riser.computeLineDistances();
  connect.add(riser);
  const packets = [0, 1, 2].map(() => {
    const p = new THREE.Mesh(
      new THREE.SphereGeometry(0.055, 14, 10),
      cobaltMesh,
    );
    connect.add(p);
    return p;
  });
  const cloud = new THREE.Group();
  cloud.position.set(sx, cloudY, sz);
  const cardGeo = new THREE.BoxGeometry(1.0, 0.56, 0.06);
  cloud.add(
    new THREE.Mesh(
      cardGeo,
      own(new THREE.MeshBasicMaterial({ color: 0xffffff }), 2),
    ),
  );
  cloud.add(
    new THREE.LineSegments(new THREE.EdgesGeometry(cardGeo), cobaltLine),
  );
  [0.16, 0.26, 0.2, 0.34].forEach((h, i) => {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.1, h, 0.04), cobaltMesh);
    bar.position.set(-0.3 + i * 0.2, -0.2 + h / 2, 0.05);
    cloud.add(bar);
  });
  connect.add(cloud);

  /* ---- layer 3 · HAND OVER: asset tags ---- */
  const tags = new THREE.Group();
  root.add(tags);
  const tagMat = own(
    new THREE.MeshLambertMaterial({ color: hex(COLOURS.orange) }),
    3,
  );
  const tagInner = own(new THREE.MeshBasicMaterial({ color: 0xffffff }), 3);
  const tagMeshes: import("three").Group[] = [];
  for (let f = 0; f < FLOORS; f++) {
    const y = f * H + T + 0.012;
    const spots: [number, number][] = [
      [W / 2 - 0.45, -0.7],
      [W / 2 - 0.45, 0.1],
      [W / 2 - 0.45, 0.85],
      [-0.4, D / 2 - 0.45],
      [0.7, D / 2 - 0.45],
    ];
    for (const [x, z] of spots) {
      const g = new THREE.Group();
      const a = new THREE.Mesh(
        new THREE.BoxGeometry(0.26, 0.025, 0.26),
        tagMat,
      );
      const b = new THREE.Mesh(
        new THREE.BoxGeometry(0.13, 0.03, 0.13),
        tagInner,
      );
      g.add(a, b);
      g.position.set(x, y, z);
      tags.add(g);
      tagMeshes.push(g);
    }
  }

  /* ---- timeline ---- */
  const ease = (t: number) => 1 - Math.pow(1 - Math.min(Math.max(t, 0), 1), 3);
  const seg = (t: number, start: number, dur: number) =>
    ease((t - start) / dur);

  const vis = [1, 1, 1, 1]; // smoothed visibility from the chosen layer
  let ctxVis = 1;
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
    if (canvas.hasPointerCapture(e.pointerId))
      canvas.releasePointerCapture(e.pointerId);
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
    /** The build-up runs at 1.8x so the whole building has assembled within about two seconds. */
    const ti = t * 1.8;

    // intro, in four beats
    const gridIn = seg(ti, 0, 0.7);
    (grid.material as import("three").Material).opacity = gridIn * 0.9;
    floors.forEach((g, f) => {
      const e = seg(ti, f * 0.2, 0.9);
      g.position.y = f * H - (1 - e) * 2.2;
    });
    const modelIn = seg(ti, 0, 0.5);
    glassGroups.forEach(
      (g, f) => (g.scale.y = Math.max(seg(ti, 0.75 + f * 0.2, 0.7), 0.0001)),
    );
    core.scale.y = Math.max(seg(ti, 0.35, 1.4), 0.0001);
    for (const { o, start, uniform } of grow) {
      const e = Math.max(seg(ti, start, 0.8), 0.0001);
      if (uniform)
        o.scale.setScalar(e * (o.userData.s ?? (o.userData.s = o.scale.x)));
      else o.scale.y = e;
    }
    columns.forEach((row, f) => {
      const e = seg(ti, 0.75 + f * 0.2, 0.7);
      row.forEach((m) => (m.scale.y = Math.max(e, 0.0001)));
    });
    const scanP = seg(ti, 1.6, 1.5);
    scanGeo.setDrawRange(0, Math.floor(scanCount * scanP));
    devGeo.setDrawRange(0, Math.floor((dev.length / 3) * seg(ti, 2.8, 0.5)));
    const connIn = seg(ti, 2.9, 1.0);
    connect.position.y = (1 - connIn) * 1.6;
    const handIn = (i: number) => seg(ti, 3.7 + i * 0.045, 0.45);
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
    const intro = [modelIn, seg(ti, 1.6, 0.4), connIn, seg(ti, 3.7, 0.3)];
    // the laser sweep: follows the scan in, then repeats gently
    const sweepPhase = ti < 3.1 ? scanP : ((t - 3.1 / 1.8) * 0.2) % 1;
    sweep.position.y = sweepPhase * topY;
    const sweepMul = Math.sin(Math.PI * Math.min(Math.max(sweepPhase, 0), 1));
    sweepFill.userData.mul = sweepMul;
    sweepLine.userData.mul = sweepMul;
    for (let l = 0; l < 4; l++)
      for (const m of layerMats[l]!)
        m.opacity =
          (m.userData.base ?? 1) * (m.userData.mul ?? 1) * intro[l]! * vis[l]!;
    ctxVis += ((a === "all" ? 1 : 0.55) - ctxVis) * (1 - Math.exp(-6 * dt));
    for (const { m, base } of ctxMats) m.opacity = base * gridIn * ctxVis;

    // sensor pulses and the facing data card
    rings.forEach((r, i) => {
      const ph = (t * 0.7 + i * 0.27) % 1;
      r.mesh.scale.setScalar(1 + ph * 1.6);
      r.mat.opacity = (1 - ph) * 0.7 * connIn * vis[2]!;
    });
    tagMeshes.forEach((g, i) => (g.position.y += Math.sin(t * 2 + i) * 0.0002));
    packets.forEach((p, i) => {
      const k = (t * 0.45 + i / 3) % 1;
      p.position.set(sx, T + 0.075 + (cloudY - 0.28 - T - 0.075) * k, sz);
      p.scale.setScalar(Math.sin(Math.PI * k) * 0.9 + 0.1);
    });
    markers.forEach(({ m, y }, i) => {
      m.position.y = y + Math.sin(t * 1.8 + i * 1.3) * 0.05;
      m.rotation.y = t * 1.2 + i;
      m.scale.setScalar(Math.max(handIn(i), 0.0001));
    });

    // scroll: while pinned the building turns, and the camera moves to each layer in turn
    const FOCUS_Y = [3.5, 3.3, 3.85, 3.0];
    const FOCUS_Z = [1.0, 1.08, 1.16, 1.08];
    progS += (getProgress() - progS) * (1 - Math.exp(-7 * dt));
    const fp = Math.min(Math.max(progS * 4 - 0.5, 0), 3);
    const i0 = Math.floor(fp);
    const i1 = Math.min(i0 + 1, 3);
    const f = fp - i0;
    const sm = f * f * (3 - 2 * f);
    const engaged =
      Math.min(progS * 14, 1) *
      (1 - Math.min(Math.max((progS - 0.96) * 25, 0), 1));
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
    root.rotation.y =
      spin +
      Math.sin(t * 0.32) * 0.22 * (1 - engaged * 0.85) +
      progS * Math.PI * 1.7;
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
    ctxMats.forEach(({ m }) => m.dispose());
    dot.dispose();
    skyTex.dispose();
    padTex.dispose();
    envTex.dispose();
    pmrem.dispose();
    renderer.dispose();
    canvas.remove();
  };
}
