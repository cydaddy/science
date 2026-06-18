import * as THREE from "./three.module.js";

const canvas = document.querySelector("#spaceScene");
const tabs = [...document.querySelectorAll(".season-tab")];
const seasonName = document.querySelector("#seasonName");
const seasonFact = document.querySelector("#seasonFact");
const constellationButton = document.querySelector("#constellationButton");
const modalBackdrop = document.querySelector("#modalBackdrop");
const modal = document.querySelector("#constellationModal");
const closeModal = document.querySelector("#closeModal");
const modalSeason = document.querySelector("#modalSeason");
const modalTitle = document.querySelector("#modalTitle");
const modalDescription = document.querySelector("#modalDescription");
const constellationArt = document.querySelector("#constellationArt");

const seasons = {
  spring: {
    label: "봄",
    orbitAngle: (Math.PI * 3) / 2,
    color: "#7ee081",
    constellation: "사자자리",
    fact: "북반구가 태양을 향하기 시작하며 낮이 점점 길어져요.",
    description:
      "봄 저녁 하늘에서는 사자자리를 찾기 좋아요. 물음표를 거꾸로 세운 듯한 머리 부분과 밝은 별 레굴루스가 특징이에요. 옛사람들은 이 모양을 씩씩한 사자의 가슴과 머리로 상상했어요.",
    svg: "leo",
  },
  summer: {
    label: "여름",
    orbitAngle: Math.PI,
    color: "#ffbf4d",
    constellation: "거문고자리",
    fact: "북반구가 태양 쪽으로 기울어 햇빛을 더 많이 받아요.",
    description:
      "여름 밤에는 거문고자리의 베가가 아주 밝게 보여요. 베가는 여름철 대삼각형을 이루는 별 중 하나예요. 작은 악기 모양이라 별들을 선으로 이으면 하늘에 놓인 거문고처럼 보여요.",
    svg: "lyra",
  },
  autumn: {
    label: "가을",
    orbitAngle: Math.PI / 2,
    color: "#ff8a5b",
    constellation: "페가수스자리",
    fact: "낮과 밤의 길이가 비슷해지고, 북반구는 서서히 식어가요.",
    description:
      "가을 하늘에서는 페가수스자리의 커다란 사각형을 찾을 수 있어요. 네 별이 넓은 네모를 이루어 길잡이 역할을 해요. 날개 달린 말 페가수스를 떠올리며 주변 별자리도 함께 찾아볼 수 있어요.",
    svg: "pegasus",
  },
  winter: {
    label: "겨울",
    orbitAngle: 0,
    color: "#8fd8ff",
    constellation: "오리온자리",
    fact: "북반구가 태양에서 비스듬히 멀어져 햇빛이 낮게 들어와요.",
    description:
      "겨울 밤에는 오리온자리가 또렷하게 보여요. 가운데 나란히 선 세 별은 오리온의 허리띠로 불려요. 밝은 베텔게우스와 리겔도 함께 보여 별자리 모양을 찾기 쉬워요.",
    svg: "orion",
  },
};

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x050912, 0.016);

const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
camera.position.set(0, 9.2, 16);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: false,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x050912, 1);

const orbitRadius = 6.8;
const tilt = THREE.MathUtils.degToRad(23.5);
const transitionMs = 3000;
const earthAxis = new THREE.Vector3(Math.sin(tilt), Math.cos(tilt), 0).normalize();

const solarSystem = new THREE.Group();
scene.add(solarSystem);

const sunLight = new THREE.PointLight(0xfff1b0, 4.2, 42, 1.4);
scene.add(sunLight);
scene.add(new THREE.AmbientLight(0x8aa8cc, 0.18));

const sun = new THREE.Mesh(
  new THREE.SphereGeometry(1.05, 64, 64),
  new THREE.MeshBasicMaterial({ color: 0xffcf47 })
);
sun.add(
  new THREE.Mesh(
    new THREE.SphereGeometry(1.35, 64, 64),
    new THREE.MeshBasicMaterial({
      color: 0xffb347,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
    })
  )
);
scene.add(sun);

const orbitCurve = new THREE.EllipseCurve(0, 0, orbitRadius, orbitRadius, 0, Math.PI * 2);
const orbitPoints = orbitCurve.getPoints(160).map((p) => new THREE.Vector3(p.x, 0, p.y));
const orbit = new THREE.LineLoop(
  new THREE.BufferGeometry().setFromPoints(orbitPoints),
  new THREE.LineBasicMaterial({ color: 0x6fa9d6, transparent: true, opacity: 0.34 })
);
solarSystem.add(orbit);

const earthPivot = new THREE.Group();
solarSystem.add(earthPivot);

const earth = new THREE.Mesh(
  new THREE.SphereGeometry(0.78, 96, 96),
  new THREE.MeshStandardMaterial({
    map: makeEarthTexture(),
    roughness: 0.78,
    metalness: 0.02,
  })
);
earthPivot.add(earth);

const clouds = new THREE.Mesh(
  new THREE.SphereGeometry(0.792, 96, 96),
  new THREE.MeshStandardMaterial({
    map: makeCloudTexture(),
    transparent: true,
    opacity: 0.34,
    depthWrite: false,
  })
);
earthPivot.add(clouds);

const axisLine = new THREE.Line(
  new THREE.BufferGeometry().setFromPoints([
    earthAxis.clone().multiplyScalar(-1.25),
    earthAxis.clone().multiplyScalar(1.25),
  ]),
  new THREE.LineBasicMaterial({ color: 0xfff2a0, transparent: true, opacity: 0.9 })
);
earthPivot.add(axisLine);

const northDot = new THREE.Mesh(
  new THREE.SphereGeometry(0.05, 18, 18),
  new THREE.MeshBasicMaterial({ color: 0xfff2a0 })
);
northDot.position.copy(earthAxis).multiplyScalar(1.3);
earthPivot.add(northDot);

const starField = makeStarField();
scene.add(starField);

let currentSeasonKey = "spring";
let activeAngle = seasons.spring.orbitAngle;
let transition = null;
let lastTime = performance.now();

const audio = {
  ctx: null,
  play(type = "click") {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    this.ctx ??= new AudioContext();
    const now = this.ctx.currentTime;
    const oscillator = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    oscillator.type = type === "open" ? "triangle" : "sine";
    oscillator.frequency.setValueAtTime(type === "open" ? 520 : 360, now);
    oscillator.frequency.exponentialRampToValueAtTime(type === "open" ? 780 : 460, now + 0.08);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.09, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
    oscillator.connect(gain).connect(this.ctx.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.18);
  },
};

function makeEarthTexture() {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 512;
  const ctx = c.getContext("2d");
  const ocean = ctx.createLinearGradient(0, 0, 0, c.height);
  ocean.addColorStop(0, "#1a69a6");
  ocean.addColorStop(0.5, "#0d4d8e");
  ocean.addColorStop(1, "#072e69");
  ctx.fillStyle = ocean;
  ctx.fillRect(0, 0, c.width, c.height);

  const land = [
    [[170, 130], [230, 92], [310, 118], [340, 190], [285, 240], [210, 222], [150, 176]],
    [[315, 245], [360, 275], [372, 352], [335, 422], [292, 374], [280, 300]],
    [[445, 150], [560, 110], [650, 152], [628, 235], [520, 250], [460, 210]],
    [[590, 255], [690, 262], [742, 330], [710, 405], [620, 386], [580, 318]],
    [[710, 125], [825, 92], [940, 130], [902, 215], [790, 230], [712, 186]],
    [[822, 260], [875, 286], [890, 350], [850, 398], [805, 354]],
    [[480, 398], [565, 386], [610, 430], [552, 462], [470, 452]],
  ];

  land.forEach((shape, index) => {
    ctx.beginPath();
    shape.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.closePath();
    ctx.fillStyle = index % 2 ? "#3f8a48" : "#4fa256";
    ctx.fill();
    ctx.fillStyle = "rgba(224, 202, 132, 0.45)";
    ctx.filter = "blur(5px)";
    ctx.fill();
    ctx.filter = "none";
  });

  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.beginPath();
  ctx.ellipse(512, 34, 430, 34, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(512, 486, 460, 40, 0, 0, Math.PI * 2);
  ctx.fill();

  return new THREE.CanvasTexture(c);
}

function makeCloudTexture() {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 512;
  const ctx = c.getContext("2d");
  ctx.clearRect(0, 0, c.width, c.height);
  for (let i = 0; i < 58; i += 1) {
    const x = Math.random() * c.width;
    const y = 70 + Math.random() * 370;
    const w = 50 + Math.random() * 110;
    const h = 10 + Math.random() * 22;
    ctx.fillStyle = `rgba(255,255,255,${0.08 + Math.random() * 0.15})`;
    ctx.beginPath();
    ctx.ellipse(x, y, w, h, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
  return new THREE.CanvasTexture(c);
}

function makeStarField() {
  const geometry = new THREE.BufferGeometry();
  const positions = [];
  for (let i = 0; i < 1200; i += 1) {
    const radius = 28 + Math.random() * 36;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions.push(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  }
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  return new THREE.Points(
    geometry,
    new THREE.PointsMaterial({ color: 0xffffff, size: 0.045, transparent: true, opacity: 0.82 })
  );
}

function shortestAngle(start, end) {
  let delta = ((end - start + Math.PI) % (Math.PI * 2)) - Math.PI;
  if (delta < -Math.PI) delta += Math.PI * 2;
  return delta;
}

function setEarthPosition(angle) {
  earthPivot.position.set(Math.cos(angle) * orbitRadius, 0, Math.sin(angle) * orbitRadius);
  earthPivot.rotation.set(0, 0, 0);
  const sunDirection = earthPivot.position.clone().multiplyScalar(-1).normalize();
  const northSunAmount = earthAxis.dot(sunDirection);
  seasonFact.textContent = `${seasons[currentSeasonKey].fact} 자전축은 항상 같은 방향으로 23.5도 기울어 있고, 지금 북반구의 햇빛 기울기 값은 ${northSunAmount.toFixed(2)}예요.`;
}

function chooseSeason(key) {
  const next = seasons[key];
  currentSeasonKey = key;
  tabs.forEach((tab) => {
    const active = tab.dataset.season === key;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", String(active));
  });
  document.documentElement.style.setProperty("--accent", next.color);
  seasonName.textContent = next.label;
  transition = {
    start: activeAngle,
    end: activeAngle + shortestAngle(activeAngle, next.orbitAngle),
    startTime: performance.now(),
  };
}

function openConstellation() {
  const data = seasons[currentSeasonKey];
  modalSeason.textContent = `${data.label}철 별자리`;
  modalTitle.textContent = data.constellation;
  modalDescription.textContent = data.description;
  constellationArt.innerHTML = constellationSvg(data.svg);
  modalBackdrop.hidden = false;
  modal.showModal();
  audio.play("open");
}

function closeConstellation() {
  modal.close();
  modalBackdrop.hidden = true;
  audio.play("click");
}

function constellationSvg(type) {
  const shapes = {
    leo: {
      view: "0 0 420 320",
      points: [[80, 176], [122, 130], [164, 112], [205, 138], [182, 184], [238, 210], [305, 188], [346, 230]],
      labels: [["레굴루스", 80, 198], ["데네볼라", 306, 178]],
    },
    lyra: {
      view: "0 0 420 320",
      points: [[145, 86], [198, 145], [255, 132], [284, 192], [218, 232], [166, 188], [198, 145]],
      labels: [["베가", 145, 72], ["거문고", 220, 260]],
    },
    pegasus: {
      view: "0 0 420 320",
      points: [[110, 104], [292, 92], [316, 238], [132, 246], [110, 104], [292, 92], [355, 54]],
      labels: [["가을의 사각형", 150, 178], ["마르카브", 120, 268]],
    },
    orion: {
      view: "0 0 420 320",
      points: [[125, 64], [170, 142], [210, 154], [250, 166], [304, 74], [250, 166], [292, 268], [210, 154], [132, 258], [170, 142]],
      labels: [["베텔게우스", 98, 52], ["허리띠", 194, 136], ["리겔", 286, 292]],
    },
  };
  const shape = shapes[type];
  const circles = shape.points
    .map(([x, y]) => `<circle class="star-dot" cx="${x}" cy="${y}" r="7" />`)
    .join("");
  const path = shape.points.map(([x, y], i) => `${i ? "L" : "M"} ${x} ${y}`).join(" ");
  const labels = shape.labels
    .map(([text, x, y]) => `<text class="star-label" x="${x}" y="${y}">${text}</text>`)
    .join("");
  return `<svg viewBox="${shape.view}" role="img"><path class="star-line" d="${path}" />${circles}${labels}</svg>`;
}

function addClickEffect(button) {
  button.classList.remove("click-pop");
  void button.offsetWidth;
  button.classList.add("click-pop");
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    addClickEffect(tab);
    audio.play("click");
    chooseSeason(tab.dataset.season);
  });
});

constellationButton.addEventListener("click", () => {
  addClickEffect(constellationButton);
  openConstellation();
});

closeModal.addEventListener("click", closeConstellation);
modalBackdrop.addEventListener("click", (event) => {
  if (event.target === modalBackdrop) closeConstellation();
});

function resize() {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

function animate(now) {
  const dt = Math.min((now - lastTime) / 1000, 0.04);
  lastTime = now;

  if (transition) {
    const t = Math.min((now - transition.startTime) / transitionMs, 1);
    const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    activeAngle = THREE.MathUtils.lerp(transition.start, transition.end, eased);
    if (t >= 1) {
      activeAngle = seasons[currentSeasonKey].orbitAngle;
      transition = null;
    }
  }

  setEarthPosition(activeAngle);
  earth.rotateOnAxis(earthAxis, dt * 1.9);
  clouds.rotateOnAxis(earthAxis, dt * 2.25);
  sun.rotation.y += dt * 0.18;
  starField.rotation.y += dt * 0.008;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

window.addEventListener("resize", resize);
resize();
setEarthPosition(activeAngle);
requestAnimationFrame(animate);
