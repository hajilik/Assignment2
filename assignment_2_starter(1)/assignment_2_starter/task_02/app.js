let gl, program;
let vertexCount = 36;
let modelViewMatrix;
let projectionMatrix;

let eye = [0, 0, 0.1];
let at = [0, 0, 0];
let up = [0, 1, 0];

// Define the clipping volume parameters
let left = -2;
let right = 2;
let bottom = -2;
let ytop = 2;
let near = -10;
let far = 10;

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

    gl.clearColor(0, 0, 0, 0.5);

    let vertices = [
        -1, -1, 1,
        -1, 1, 1,
        1, 1, 1,
        1, -1, 1,
        -1, -1, -1,
        -1, 1, -1,
        1, 1, -1,
        1, -1, -1,
    ];

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
    
    let vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    let vPosition = gl.getAttribLocation(program, 'vPosition');
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

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

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    let mvm = lookAt(eye, at, up);
    let pm = ortho(left, right, bottom, ytop, near, far);

    gl.uniformMatrix4fv(modelViewMatrix, false, flatten(mvm));
    gl.uniformMatrix4fv(projectionMatrix, false, flatten(pm));

    gl.drawElements(gl.TRIANGLES, vertexCount, gl.UNSIGNED_BYTE, 0);

    requestAnimationFrame(render);
}

function handleKeyDown(event) {
    if (event.key === 'T' || event.key === 't') {
        eye = [0, 1, 0.1];
        at = [0, 0, 0];
    } else if (event.key === 'L' || event.key === 'l') {
        eye = [-1, 0, 0.1];
        at = [0, 0, 0];
    } else if (event.key === 'F' || event.key === 'f') {
        eye = [0, 0, 1];
        at = [0, 0, 0];
    } else if (event.key === 'D' || event.key === 'd') {
        rotateCameraClockwise(1);
    } else if (event.key === 'A' || event.key === 'a') {
        rotateCameraClockwise(-1);
    } else if (event.key === 'I' || event.key === 'i') {
        eye = [1, 1, 1];
        at = [0, 0, 0];
    } else if (event.key === 'W' || event.key === 'w') {
        scaleScene(1.1);
    } else if (event.key === 'S' || event.key === 's') {
        scaleScene(0.9);
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
    left *= factor;
    right *= factor;
    bottom *= factor;
    ytop *= factor;

    render();
}
