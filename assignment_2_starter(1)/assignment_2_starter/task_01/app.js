let gl, program;
let vertexCount = 36;
let modelViewMatrix;

let eye = [0, 0, 0];
let at = [0, 0, 0];
let up = [0, 1, 0];


let mvm = lookAt(eye, at, up);

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

    // You should get rid of the line below eventually
    vertices = scale(0.5, vertices);

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

    render();
};


function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.uniformMatrix4fv(modelViewMatrix, false, flatten(mvm));

    gl.drawElements(gl.TRIANGLES, vertexCount, gl.UNSIGNED_BYTE, 0);

    requestAnimationFrame(render);
}

// Handle keyboard events
function handleKeyDown(event) {
    if (event.key === 'T' || event.key === 't') {
        eye = [0, 1, 0];
        up = [0, 0, 1];
        mvm = lookAt(eye, at, up);
    } else if (event.key === 'L' || event.key === 'l') {
        eye = [-1, 0, 0];
        up = [0, 1, 0];
        mvm = lookAt(eye, at, up);
    } else if (event.key === 'F' || event.key === 'f') {
        eye = [0, 0, 0.1];
        up = [0, 1, 0];
        mvm = lookAt(eye, at, up);
    } else if (event.key === 'D' || event.key === 'd') {
        rotateCameraClockwise(0.2);
        mvm = lookAt(eye, at, up);
    } else if (event.key === 'A' || event.key === 'a') {
        rotateCameraClockwise(-0.2);
        mvm = lookAt(eye, at, up);
    }
}



function rotateCameraClockwise(theta) {
    let cosTheta = Math.cos(theta);
    let sinTheta = Math.sin(theta);
    if(eye[0] === 0 && eye[1] === 1 && eye[2] === 0){
        let up0 = up[0] * cosTheta + up[2] * sinTheta;
        let up2 = -up[0] * sinTheta + up[2] * cosTheta;
        let up1 = up[1];
        up = [up0, up1, up2];  
    }else if(eye[0] === -1 && eye[1] === 0 && eye[2] === 0){
        let up2 = up[2] * cosTheta - up[1] * sinTheta;
        let up1 = up[2] * sinTheta + up[1] * cosTheta;
        let up0 = up[0];
        up = [up0, up1, up2];
    }else{
        let up0 = up[0] * cosTheta - up[1] * sinTheta;
        let up1 = up[0] * sinTheta + up[1] * cosTheta;
        let up2 = up[2];
        up = [up0, up1, up2];
    }

}
