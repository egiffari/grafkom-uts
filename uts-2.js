"use strict";

var gl;

var theta = 0.0;
var thetaLoc;
var thetaCompar = theta;

var black = flatten(vec4(0.0, 0.0, 0.0, 1.0));
var inColor = black;
var inColorLoc;

var speed = 100;
var direction = true;
var vertices = [];
// init();

function init()
{
    var canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");

    //
    //  Configure WebGL
    //
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    //  Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram( program );

    
    // Load the data into the GPU
    console.log("vertices: ", vertices);
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer

    var positionLoc = gl.getAttribLocation( program, "aPosition" );
    gl.vertexAttribPointer( positionLoc, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray(positionLoc);

    thetaLoc = gl.getUniformLocation(program, "uTheta");
    inColorLoc = gl.getUniformLocation(program, "inColor")

    render();
};

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays(gl.LINES, 0, vertices.length);
}

function midpoint_test(){
    var coor = document.getElementById("coor");
    var Xa = parseInt(coor.elements[0].value);
    var Ya = parseInt(coor.elements[1].value);
    var Xb = parseInt(coor.elements[2].value);
    var Yb = parseInt(coor.elements[3].value);
    midpoint(Xa,Ya,Xb,Yb);
    init();
}

function midpoint(Xa,Ya,Xb,Yb){

    var line = [];
    var dy = Yb - Ya;

    var dx = Xb - Xa;
    var d = 2 * dy - dx;
    var dyAbs = Math.abs(dy);
    var dxAbs = Math.abs(dx);
    var x = Xa;
    var y = Ya;
    vertices.push(vec2(x/10, y/10));
    if (dy >= 0 && dx >= 0 && dyAbs <= dxAbs){
        while(x < Xb) {
            x++;
            if (d <= 0){
                d = d + 2 * dy;
            }
            else {
                d = d + 2 * (dy - dx);
                y++;
            }
            vertices.push(vec2(x/10, y/10));
            vertices.push(vec2(x/10, y/10));
        }
    }
    else if (dy >= 0 && dx >= 0 && dyAbs > dxAbs){
        d = 2 * dx - dy;
        while(y < Yb) {
            y++;
            if (d <= 0){
                d = d + 2 * dx;
            }
            else {
                d = d + 2 * (dx - dy);
                x++;
            }
            vertices.push(vec2(x/10, y/10));
            vertices.push(vec2(x/10, y/10));
        }
    }
    else if (dy < 0 && dx >= 0 && dyAbs <= dxAbs){
        d = 2 * dyAbs - dx;
        while(x < Xb) {
            x++;
            if (d <= 0){
                d = d + 2 * dyAbs;
            }
            else {
                d = d + 2 * (dyAbs - dx);
                y--;
            }
            vertices.push(vec2(x/10, y/10));
            vertices.push(vec2(x/10, y/10));
        }
    }
    else if (dy < 0 && dx >= 0 && dyAbs > dxAbs){
        d = 2 * dx - dyAbs;
        while(y > Yb) {
            y--;
            if (d <= 0){
                d = d + 2 * dx;
            }
            else {
                d = d + 2 * (dx - dyAbs);
                x++;
            }
            vertices.push(vec2(x/10, y/10));
            vertices.push(vec2(x/10, y/10));
        }
    }
    else if (dy < 0 && dx < 0 && dyAbs <= dxAbs){
        d = 2 * dyAbs - dxAbs;
        while(x > Xb) {
            x--;
            if (d <= 0){
                d = d + 2 * dyAbs;
            }
            else {
                d = d + 2 * (dyAbs - dxAbs);
                y--;
            }
            vertices.push(vec2(x/10, y/10));
            vertices.push(vec2(x/10, y/10));
        }
    }
    else if (dy < 0 && dx < 0 && dyAbs > dxAbs){
        d = 2 * dxAbs - dyAbs;
        while(y > Yb) {
            y--;
            if (d <= 0){
                d = d + 2 * dxAbs;
            }
            else {
                d = d + 2 * (dxAbs - dyAbs);
                x--;
            }
            vertices.push(vec2(x/10, y/10));
            vertices.push(vec2(x/10, y/10));
        } 
    }
    else if (dy >= 0 && dx < 0 && dyAbs <= dxAbs){
        d = 2 * dy - dxAbs;
        while(x > Xb) {
            x--;
            if (d <= 0){
                d = d + 2 * dy;
            }
            else {
                d = d + 2 * (dy - dxAbs);
                y++;
            }
            vertices.push(vec2(x/10, y/10));
            vertices.push(vec2(x/10, y/10));
        }
    }
    else if (dy >= 0 && dx < 0 && dyAbs > dxAbs){
        d = 2 * dxAbs - dy;
        while(y < Yb) {
            y++;
            if (d <= 0){
                d = d + 2 * dxAbs;
            }
            else {
                d = d + 2 * (dxAbs - dy);
                x--;
            }
            vertices.push(vec2(x/10, y/10));
            vertices.push(vec2(x/10, y/10));
        }
    }
    vertices.pop();
    console.log(vertices)
}
