const THREE = require("three");

let camera, scene, renderer;

let uniforms;

//init();
//animate();

function init() {
  const container = document.getElementById("app");

  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  scene = new THREE.Scene();

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  uniforms = {
    time: { value: 1.0 }
  };

  onWindowResize();

  window.addEventListener("resize", onWindowResize, false);
}

function initQuad(vert, frag) {
  const geometry = new THREE.PlaneBufferGeometry(2, 2);

  const material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vert,
    fragmentShader: frag
  });

  const material2 = new THREE.MeshBasicMaterial({
    color: new THREE.Color(
      Math.random(),
      Math.random(),
      Math.random(),
      Math.random()
    )
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // mesh.position.set(pos.x, pos.y, pos.z);

  return mesh;
}

function onWindowResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
}

//

function animate() {
  requestAnimationFrame(animate);

  uniforms["time"].value = performance.now() / 1000;

  renderer.render(scene, camera);
}

module.exports = {
  init,
  initQuad,
  animate
};
