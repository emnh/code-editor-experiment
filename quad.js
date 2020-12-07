const THREE = require("three");

const width = 200;
const height = 200;

let camera, scene, renderer;

let uniforms;

//init();
//animate();

function init(vert, frag) {
  const container = document.getElementById("app");

  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  scene = new THREE.Scene();

  const geometry = new THREE.PlaneBufferGeometry(2, 2);

  uniforms = {
    time: { value: 1.0 }
  };

  const material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vert,
    fragmentShader: frag
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  onWindowResize();

  window.addEventListener("resize", onWindowResize, false);
}

function onWindowResize() {
  renderer.setSize(width, height);
  // renderer.setSize(window.innerWidth, window.innerHeight);
}

//

function animate() {
  requestAnimationFrame(animate);

  uniforms["time"].value = performance.now() / 1000;

  renderer.render(scene, camera);
}

module.exports = {
  init,
  animate
};
