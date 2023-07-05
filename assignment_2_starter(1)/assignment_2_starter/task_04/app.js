let gl, program;
let vertexCount = 36; // Total vertex count for both cubes (36 vertices per cube)
let modelViewMatrix;
let projectionMatrix;

let eye = [0, 0, 0.1];
let at = [0, 0, 0];
let up = [0, 1, 0];

let left = -2;
let right = 2;
let bottom = -2;
let ytop = 2;

let vertices = [
  -1, -1, 1,
  -1, 1, 1,
  1, 1, 1,
  1, -1, 1,                  // First cube  
  -1, -1, -1,
  -1, 1, -1,
  1, 1, -1,
  1, -1, -1,
];
let vertices2 =  
[ 3, -1, -1, 
  3, 1, -1, 
  5, 1, -1, 
  5, -1, -1,                 // Second cube
  3, -1, -3, 
  3, 1, -3, 
  5, 1, -3, 
  5, -1, -3, ];

// Clipping volume parameters
let fovy = 45; // Field of view
let near = 1; // Near clipping plane
let far = 10; // Far clipping plane

window.onload = () => {
  let canvas = document.getElementById("webgl-canvas");

  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert('No webgl for you');
    return;
  }

  program = initShaders(gl, 'vertex-shader', 'fragment-shader');
  gl.useProgram(program);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.enable(gl.DEPTH_TEST);
  window.addEventListener('keydown', handleKeyDown);
  gl.clearColor(0, 0, 0, 0.5);

  let indices = [
    0, 3, 1,
    1, 3, 2,
    4, 7, 5,
    5, 7, 6,
    3, 7, 2,
    2, 7, 6,
    4, 0, 5,
    5, 0, 1,
    1, 2, 5,
    5, 2, 6,
    0, 3, 4,
    4, 3, 7,
  ];

  let colors = [
    0, 0, 0,
    0, 0, 1,
    0, 1, 0,
    0, 1, 1,
    1, 0, 0,
    1, 0, 1,
    1, 1, 0,
    1, 1, 1,
  ];

  

  let iBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);

  let cBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  let vColor = gl.getAttribLocation(program, 'vColor');
  gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vColor);

  modelViewMatrix = gl.getUniformLocation(program, 'modelViewMatrix');
  projectionMatrix = gl.getUniformLocation(program, 'projectionMatrix');

  document.addEventListener('keydown', handleKeyDown);

  render();
};
function generateCube(vertices){
  let vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  let vPosition = gl.getAttribLocation(program, 'vPosition');
  gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  gl.drawElements(gl.TRIANGLES, vertexCount, gl.UNSIGNED_BYTE, 0);
}
let p = "Perspective";  // To define mode
function render() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  let mvm = lookAt(eye, at, up);
  let pm;
  if(p === "Perspective"){
    pm = perspective(fovy, gl.canvas.width/gl.canvas.height, near, far);
  }else{
    pm = ortho(left, right, bottom, ytop, near, far);
  }
  gl.uniformMatrix4fv(modelViewMatrix, false, flatten(mvm));
  gl.uniformMatrix4fv(projectionMatrix, false, flatten(pm));
  generateCube(vertices);
  generateCube(vertices2);
  

  requestAnimationFrame(render);
}

function handleKeyDown(event) {
  if (event.key === 'D' || event.key === 'd') {
    rotateCameraClockwise(1);
  } else if (event.key === 'A' || event.key === 'a') {
    rotateCameraClockwise(-1);
  } else if (event.key === 'I' || event.key === 'i') {
    eye = [3, 2, 2];
    at = [0, 0, 0];
    up = [0, 1, 0]
  } else if (event.key === 'W' || event.key === 'w') {
    if(p === "Perspective"){
      scaleScene(5);
    }else if(p === "O"){
      scaleSceneOrtho(1.01);
    }
    
  } else if (event.key === 'S' || event.key === 's') {
    if(p === "Perspective"){
      scaleScene(-5);
    }else if(p === "O"){
      scaleSceneOrtho(0.99);
    }
  } else if(event.key === 'O' || event.key === 'o'){
    p = "O";
    mvm = lookAt(eye, at, up);
  }
  else if(event.key === 'P' || event.key === 'p'){
    p = "Perspective";
    mvm = lookAt(eye, at, up);
  }

  render();
}

function rotateCameraClockwise(theta) {
  let cosTheta = Math.cos(theta);
  let sinTheta = Math.sin(theta);

  let newUp0 = up[0] * cosTheta - up[1] * sinTheta;
  let newUp1 = up[0] * sinTheta + up[1] * cosTheta;
  let newUp2 = up[2];

  up = vec3(newUp0, newUp1, newUp2);

  render();
}

function scaleScene(factor) {
  fovy += factor;
  render();
}

function scaleSceneOrtho(factor) {
  left *= factor;
  right *= factor;
  bottom *= factor;
  ytop *= factor;

  render();
}
