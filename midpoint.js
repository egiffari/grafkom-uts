"use strict";

var gl;

var theta = 0.0;
var thetaLoc;
var thetaCompar = theta;

var silver = flatten(vec4(0.75, 0.75, 0.75, 1.0));
var black = flatten(vec4(0.0, 0.0, 0.0, 1.0));
var inColor = black;
var inColorLoc;

var speed = 100;
var direction = true;
var vertices = [];
init();

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


    midpoint_test();
    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer

    var positionLoc = gl.getAttribLocation( program, "aPosition" );
    gl.vertexAttribPointer( positionLoc, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray(positionLoc);

    thetaLoc = gl.getUniformLocation(program, "uTheta");
    inColorLoc = gl.getUniformLocation(program, "inColor")

    // Initialize event handlers

    // document.getElementById("slider").onchange = function(event) {
    //     speed = 100 - event.target.value;
    // };
    // document.getElementById("Direction").onclick = function (event) {
    //     direction = !direction;
    // };

    // document.getElementById("Controls").onclick = function( event) {
    //     switch(event.target.index) {
    //       case 0:
    //         direction = !direction;
    //         break;

    //      case 1:
    //         speed /= 2.0;
    //         break;

    //      case 2:
    //         speed *= 2.0;
    //         break;
    //    }
    // };

    // window.onkeydown = function(event) {
    //     var key = String.fromCharCode(event.keyCode);
    //     switch( key ) {
    //       case '1':
    //         direction = !direction;
    //         break;

    //       case '2':
    //         speed /= 2.0;
    //         break;

    //       case '3':
    //         speed *= 2.0;
    //         break;
    //     }
    // };


    render();
};

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT );

    // theta += (direction ? 0.1 : -0.1);
    // gl.uniform1f(thetaLoc, theta);
    // if( Math.abs(theta - thetaCompar) >= Math.PI * 2){
    //   if (inColor == silver){
    //     inColor = black
    //     gl.clearColor(1.0, 1.0, 0.0, 1.0);
    //   }
    //   else if (inColor == black){
    //     inColor = silver
    //     gl.clearColor(0.0, 0.0, 0.0, 1.0);
    //   }
    //   thetaCompar = theta
    // }
    gl.uniform4fv(inColorLoc, inColor)
    for (var i = 0; i < vertices.length; i++){
        var obj = vertices[i];
        console.log(obj);
        gl.drawArrays(gl.LINES, i, obj.length);
    }
    

    setTimeout(
        function () {requestAnimationFrame(render);},
        speed
    );
}

function midpoint_test(){
    midpoint(0,0,0,0.5);
    midpoint(0,0,0.1,0.4);
    midpoint(0,0,0.2,0.3);
    midpoint(0,0,0.3,0.2);
    midpoint(0,0,0.4,0.1);
    midpoint(0,0,0.5,0);
    midpoint(0,0,0.4,-0.1);
    midpoint(0,0,0.3,-0.2);
    midpoint(0,0,0.2,-0.3);
    midpoint(0,0,0.1,-0.4);
    midpoint(0,0,0,-0.5);
    midpoint(0,0,-0.1,-0.4);
    midpoint(0,0,-0.2,-0.3);
    midpoint(0,0,-0.3,-0.2);
    midpoint(0,0,-0.4,-0.1);
    midpoint(0,0,-0.5,0);
    midpoint(0,0,-0.4,0.1);
    midpoint(0,0,-0.3,0.2);
    midpoint(0,0,-0.2,0.3);
    midpoint(0,0,-0.1,0.4);
}

function midpoint(Xa,Ya,Xb,Yb){
    var line = [];
    var dy = Yb - Ya;
    var dx = Xb - Xa;
    var d = 2 * dy - dx;

    var x = Xa;
    var y = Ya;

    line.push(vec2(x, y));

    while(x < Xb) {
        x = x + 0.1;
        if (d < 0){
            d = d + 2 * dy;
        }
        else {
            d = d + 2 * (dy - dx);
            y = y + 0.1;
        }
        line.push(vec2(x, y))
    }
    vertices.push(line);
}
