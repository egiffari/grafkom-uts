"use strict";

var canvas;
var gl;

var numPositions = 100000;

var positions = [];
var colors = [];

var colorArray = [];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var axis = 1;
var theta = [0, 0, 0];

var thetaLoc;

const OFFSET = 1/16 *1.25 *0.25;
const START_X = OFFSET * 32 * -1 / 2;
const START_Y = OFFSET * 32 ;
const START_Z = OFFSET / 2 * -1 ;

var pokemon1;
var pokemon2;

init();

async function init() {

    canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");

    // Get voxel texture
    await initPaintedVoxels();
    initVoxels();

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1, 1, 1, 1.0);

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    var colorLoc = gl.getAttribLocation(program, "aColor");
    gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLoc);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(positions), gl.STATIC_DRAW);


    var positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    thetaLoc = gl.getUniformLocation(program, "uTheta");

    //event listeners for buttons

    render();
}

async function initPaintedVoxels() {
    var textureCanvas = document.getElementById('texture');
    var context = textureCanvas.getContext('2d');

    return new Promise ((resolve) => {
        var texture = new Image();
        texture.crossOrigin = "Anonymous"
        texture.src = 'https://raw.githubusercontent.com/egiffari/grafkom-uts/main/images/'+pokemon1+'.png';
        texture.onload = async () => {
            context.drawImage(texture, 0, 0);
            for (let i = 0; i < 64; i++) {
                var row = []
                for (let j = 63; j >= 0; j--) {
                    var imgData = context.getImageData(i, j, 1, 1).data;
                    row.push([imgData[0] / 255, imgData[1] / 255, imgData[2] / 255, imgData[3] / 255])
                }
                colorArray.push(row)
            }
            resolve(true)
        }
    })
}

function initVoxels() {
    for (let i = 63; i >= 0; i--) {
        for (let j = 63; j >= 0; j--) {
            let color = colorArray[i][j];
            if (color[3] != 0) {
                voxel(i, j, vec4(color[0], color[1], color[2], color[3]))
            }
        }
    }
}

function voxel(x, y, color) {
    quad(x, y, 1, 0, 3, 2, color);
    quad(x, y, 2, 3, 7, 6, color);
    quad(x, y, 3, 0, 4, 7, color);
    quad(x, y, 6, 5, 1, 2, color);
    quad(x, y, 4, 5, 6, 7, color);
    quad(x, y, 5, 4, 0, 1, color);
}

function quad(x, y, a, b, c, d, color) {
    
    let L = OFFSET / 2 * x + START_X;
    let U = OFFSET * y - START_Y;
    let B = START_Z;

    let R = L + OFFSET / 2;
    let D = U + OFFSET;
    let F = B + 0;

    var vertices = [
        vec4(L, D, F, 1.0),
        vec4(L, U, F, 1.0),
        vec4(R, U, F, 1.0),
        vec4(R, D, F, 1.0),
        vec4(L, D, B, 1.0),
        vec4(L, U, B, 1.0),
        vec4(R, U, B, 1.0),
        vec4(R, D, B, 1.0)
    ];

    var indices = [a, b, c, a, c, d];
    

    for (var i = 0; i < indices.length; ++i) {
        positions.push(vertices[indices[i]]);
        colors.push(vec4(color));
    }
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    theta[axis] += 2.0;
    gl.uniform3fv(thetaLoc, theta);

    gl.drawArrays(gl.TRIANGLES, 0, positions.length);
    requestAnimationFrame(render);
}
