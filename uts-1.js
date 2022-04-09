"use strict";

var canvas;
var gl;

var numPositions = 10000;

var positions = [];
var colors = [];

var colorArray = [];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var axis = 1;
var theta = [0, 0, 0];

var cBuffer;
var vBuffer;

var matrixLoc;
var colorLoc;
var positionLoc;

const OFFSET = 1/16 *1.25 / 4;
const START_X = OFFSET * 32 * -1 / 2;
const START_Y = OFFSET * 32;
const START_Z = 0;

var pokemon1 = new Pokemon(1, M3.identity());
var pokemon2 = new Pokemon(4, M3.translation(0.6, 0));
var pokemon3 = new Pokemon(7, M3.translation(-0.6, 0));

init();

async function init() {
    canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(85/255, 85/255, 85/255, 1.0);

    gl.enable(gl.DEPTH_TEST);

    await pokemon1.init()
    await pokemon2.init()
    await pokemon3.init()

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    cBuffer = gl.createBuffer();
    vBuffer = gl.createBuffer();
    colorLoc = gl.getAttribLocation(program, "aColor");
    positionLoc = gl.getAttribLocation(program, "aPosition");

    matrixLoc = gl.getUniformLocation(program, "uMatrix");

    //event listeners for buttons

    render()
}    

function updateColorBuffer(cBuffer, colorArray) {
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colorArray), gl.STATIC_DRAW);
    gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLoc);
}

function updatePositionBuffer(vBuffer, positionArray) {
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(positionArray), gl.STATIC_DRAW);
    gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);
}

function updateMatrixData(matrix) {
    gl.uniformMatrix3fv(matrixLoc, false, matrix);
}

function draw(numVert) {
    gl.drawArrays(gl.TRIANGLES, 0, numVert);
}

function drawPokemon(cBuffer, vBuffer, pokemon) {
    updatePositionBuffer(vBuffer, pokemon.mesh)
    updateColorBuffer(cBuffer, pokemon.color)
    updateMatrixData(pokemon.originMatrix);
    draw(pokemon.mesh.length)
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    drawPokemon(cBuffer, vBuffer, pokemon1);
    drawPokemon(cBuffer, vBuffer, pokemon2);
    drawPokemon(cBuffer, vBuffer, pokemon3);
    requestAnimationFrame(render);
}
