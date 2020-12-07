// Import stylesheets
// import "./style.css";

let prelude = `
float distanceToMandelbrot( in vec2 c ) {
    float c2 = dot(c, c);
    // skip computation inside M1 - http://iquilezles.org/www/articles/mset_1bulb/mset1bulb.htm
    if( 256.0*c2*c2 - 96.0*c2 + 32.0*c.x - 3.0 < 0.0 ) return 0.0;
    // skip computation inside M2 - http://iquilezles.org/www/articles/mset_2bulb/mset2bulb.htm
    if( 16.0*(c2+2.0*c.x+1.0) - 1.0 < 0.0 ) return 0.0;


    // iterate
    float di =  1.0;
    vec2 z  = vec2(0.0);
    float m2 = 0.0;
    vec2 dz = vec2(0.0);
    for( int i=0; i<300; i++ )
    {
        if( m2>1024.0 ) { di=0.0; break; }

		// Z' -> 2·Z·Z' + 1
        dz = 2.0*vec2(z.x*dz.x-z.y*dz.y, z.x*dz.y + z.y*dz.x) + vec2(1.0,0.0);

        // Z -> Z² + c
        z = vec2( z.x*z.x - z.y*z.y, 2.0*z.x*z.y ) + c;

        m2 = dot(z,z);
    }

    // distance
	// d(c) = |Z|·log|Z|/|Z'|
	float d = 0.5*sqrt(dot(z,z)/dot(dz,dz))*log(dot(z,z));
    if( di>0.5 ) d=0.0;

    return d;
}

`;

// Write Javascript code!
const appDiv = document.getElementById("app");
// appDiv.innerHTML = `<h1>JS Starter</h1>`;

const $ = require("jquery");
//const Quad = require("gl-big-quad");
//const Shader = require("gl-shader");
//const raf = require("raf");
const THREE = require("three");
const quad = require("./quad.js");

const FUNS = 5;
const DEPTH = 10;
const GRIDX = 5;
// const X = "vUV.x";
// const Y = "vUV.y";
const Xdef = "gl_FragCoord.x / " + fstr(window.innerWidth);
const Ydef = "gl_FragCoord.y / " + fstr(window.innerHeight);

prelude += '#define X ' + Xdef + '\n';
prelude += '#define Y ' + Ydef + '\n';

const X = 'X';
const Y = 'Y';

const width = Math.max(100, window.innerWidth / GRIDX);
const height = width;
//const height = Math.max(100, window.innerHeight / 10);
// const width = Math.max(100, window.innerWidth / 1);
// const height = Math.max(100, window.innerHeight / 1);

function fstr(x) {
  return x.toFixed(6);
}

const fs = [];
for (let x = 0.0; x <= window.innerWidth; x += width) {
  // TODO: + 2 * height is temporarily until fix is known
  for (let y = 0.0; y <= window.innerHeight + 2 * height; y += height) {
    const z = 0.0;
    const pos = new THREE.Vector3(
      (1 * x) / window.innerWidth,
      (1 * y) / window.innerHeight,
      z
    );
    const ppos = new THREE.Vector3(
      (1 * Math.max(0, x - width)) / window.innerWidth,
      (1 * Math.max(0, y - height)) / window.innerHeight,
      z
    );
    const cond =
      X +
      " > " +
      fstr(pos.x) +
      " && " +
      Y +
      " > " +
      fstr(pos.y) +
      " && " +
      X +
      " < " +
      fstr(pos.x + width / window.innerWidth) +
      " && " +
      Y +
      " < " +
      fstr(pos.y + height / window.innerHeight) +
      " && " +
      "true";
    //console.log(ppos.x, pos.x, ppos.y, pos.y);
    const r = Math.random();
    const g = Math.random();
    const b = Math.random();
    const nx =
      "((" +
      X +
      " - " +
      fstr(pos.x) +
      ") / " +
      fstr(width / window.innerWidth) +
      ")";
    const ny =
      "((" +
      Y +
      " - " +
      fstr(pos.y) +
      ") / " +
      fstr(height / window.innerHeight) +
      ")";
    const flist = [];
    for (let i = 0; i < GRIDX; i++) {
      flist.push(randFun(nx, ny));
    }
    const f1 = flist.reduce((a, b) => randPattern(a, b));

    const f2 =
      "((" +
      cond +
      ") ? vec3(" +
      f1 +
      ") * vec3(" +
      r +
      ", " +
      g +
      ", " +
      b +
      ") : vec3(0.0))";

    // const f2 =
    //   "((" + cond + ") ? vec3(" + nx + ", " + ny + ", 0.0) : vec3(0.0))";

    // const f2 =
    //   "((" + cond + ") ? vec3(" + r + ", " + g + ", " + b + ") : vec3(0.0))";
    fs.push({
      nx: nx,
      ny: ny,
      f: f2,
      rf: f1
    });
  }
}
let s = "vec3 s = vec3(0.0);\n";
for (let i = 0; i < fs.length; i++) {
  // s += fs[i] + " + ";
  const d = fs[i];
  s += "    s += " + d.f + ";\n";
}

const reducer = (a, b) => randPattern(a, b);
const combo = fs.map(x => x.rf).reduce(reducer);
console.log(s);
// return "vec4(" + f + ", " + f + ", " + f + ", 1.0)";
// const prebody = s + " + vec3(" + combo + ")";
// s += "    s += vec3(" + combo + ");\n";
const prebody = s;
// const body = prebody + "\n;gl_FragColor = vec4(r, g, b, a);";
// const body = prebody + "\n;gl_FragColor = vec4(r, g, b, a);";
const body = prebody + "\n gl_FragColor = vec4(s, 1.0);";

quad.init();
const canvas = addCanvas(body);
quad.animate();

$("#app")
  .css("padding", "0px")
  .css("margin", "0px");
$("body")
  .css("padding", "0px")
  .css("margin", "0px");
$("canvas")
  .css("padding", "0px")
  .css("margin", "0px");
// .css("width", "200px")
// .css("height", "200px");

function randPattern(A, B) {
  const pats = [
    "exp2(A)",
    "log2(abs(A) + 1.0e-10)",
    "radians(A)",
    "degrees(A)",
    "abs(A)",
    "sqrt(abs(A))",
    "inversesqrt(abs(A))",
    "fract(A)",
    "sign(A)",
    "floor(A)",
    "ceil(A)",
    "exp(A)",
    "log(A)",
    "sin(A)",
    "cos(A)",
    "tan(A)",
    "atan(A == 0.0 ? 1.0 : A)",
    "asin(clamp(A, -1.0, 1.0))",
    "acos(clamp(A, -1.0, 1.0))",
    "atan(A, B)",
    "atan(B, A)",
    "mod(A, B)",
    "mod(B, A)",
    "min(A, B)",
    "min(B, A)",
    "max(A, B)",
    "max(B, A)",
    "pow(A > 0.0 ? A : 1.0e-10, B)",
    "pow(B > 0.0 ? B : 1.0e-10, A)",
    "length(vec2(A, B))",
    "length(vec2(B, A))",
    "distance(vec2(A, B), vec2(0.5))",
    "distance(vec2(B, A), vec2(0.5))",
    "A * B",
    "A + B",
    "A / max(B, 0.00001)",
    "A - B",
    "B * A",
    "B + A",
    "B / max(A, 0.00001)",
    "B - A",
    "distanceToMandelbrot(vec2(A, B))"
  ];
  const pr = Math.floor(Math.random() * pats.length);
  return pats[pr]
    .replace("A", A).replace("B", B)
    .replace("A", A).replace("B", B);
}

function randFun(x, y) {
  // const args = [x, y, "time", Math.random().toFixed(6)];
  const t = "time";
  const primeArgs = [x, x, x, x, x, y, y, y, y, y, t, t, t, "10.0", "0.1"];
  const args = primeArgs.slice();
  let s = t;
  let longest = "";
  let ssum = [];
  for (let i = 0; i < DEPTH; i++) {
    const ar1 = Math.floor(Math.random() * primeArgs.length);
    const ar2 = Math.floor(Math.random() * args.length);
    //s = randPattern(primeArgs[ar1], args[ar2]);
    s = randPattern(primeArgs[ar1], s);
    args.push(s);
    if (s.length > longest.length) {
      longest = s;
    }
    ssum.push(s);
  }
  // const reducer = (accumulator, currentValue) => "(" + accumulator + ", " + currentValue + ")";
  const reducer = (accumulator, currentValue) => "(" + accumulator + " + " + currentValue + ")";
  //const reducer = (a, b) => randPattern(a, b);
  const clamper = longest => "exp(clamp(" + longest + " * 2.0 - 1.0, -1.0, 1.0))"; // + fstr(args.length);
  return "log(abs(" + ssum.map(clamper).reduce(reducer) + "))";
  //return "log(abs(" + ssum.map(clamper).reduce(reducer) + "))";
  // return "clamp(" + longest + ", 0.0, 1.0)";
  return longest;
  // return ssum;
}

function randGLSL() {
  const f = randFun();
  console.log(f);
  return "vec4(" + f + ", " + f + ", " + f + ", 1.0)";
}

function addCanvas(body) {
  const vert = `
  precision mediump float;

  varying vec2 vUV;

  void main() {
    vUV = uv;
    gl_Position = vec4(position, 1.0);
  }
  `;

  const frag =
    `
  precision mediump float;

  uniform float time;

  varying vec2 vUV;

  ` +
    prelude +
    `

  void main() {
    ` +
    body +
    `;
  }
  `;

  return quad.initQuad(vert, frag);
}
