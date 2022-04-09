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
    // gl.uniform4fv(inColorLoc, inColor)
    // console.log(vertices);
    // var idx = 0;
    gl.drawArrays(gl.LINE_STRIP, 0, vertices.length);
    // for (var i = 0; i < vertices.length; i++){
        
    //     var obj = vertices[i];
    //     gl.bindBuffer(gl.ARRAY_BUFFER, vbuffer);
    //     gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (idx + obj.length), flatten(obj));
    //     gl.drawArrays(gl.LINES, idx, obj.length);
    //     idx  = idx + obj.length;
    //     console.log(idx);
    //     console.log(vertices);
    // }
    

    // setTimeout(
    //     function () {requestAnimationFrame(render);},
    //     speed
    // );
}

function midpoint_test(){
    vertices = [];
    var coor = document.getElementById("coor");
    var Xa = parseInt(coor.elements[0].value);
    var Ya = parseInt(coor.elements[1].value);
    var Xb = parseInt(coor.elements[2].value);
    var Yb = parseInt(coor.elements[3].value);
    midpoint(Xa,Ya,Xb,Yb);
    init();
    // midpoint(1,1,7,3);
    // midpoint(3,2,5,1);
    // midpoint(0,0,6,7);
    // midpoint(0,0,5,9);
    // midpoint(0,0,3,2);
    // midpoint(0,0,4,1);
    // midpoint(0,0,5,0);
    // midpoint(0,0,0.4,-0.1);
    // midpoint(0,0,0.3,-0.2);
    // midpoint(0,0,0.2,-0.3);
    // midpoint(0,0,0.1,-0.4);
    // midpoint(0,0,0,-0.5);
    // midpoint(0,0,-0.1,-0.4);
    // midpoint(0,0,-0.2,-0.3);
    // midpoint(0,0,-0.3,-0.2);
    // midpoint(0,0,-0.4,-0.1);
    // midpoint(0,0,-0.5,0,);
    // midpoint(0,0,-0.4,0.1);
    // midpoint(0,0,-0.3,0.2);
    // midpoint(0,0,-0.2,0.3);
    // midpoint(0,0,-0.1,0.4);
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
        }
    }
    // if(dy <= dx) {
    //     if(dy > 0){
    //         while(x < Xb) {
    //             x++;
    //             if (d <= 0){
    //                 d = d + 2 * dy;
    //             }
    //             else {
    //                 d = d + 2 * (dy - dx);
    //                 y++;
    //             }
    //             vertices.push(vec2(x/10, y/10));
    //         }
    //     }
    //     else{
    //         if(dx > 0){
    //             if (dyAbs <= dxAbs) {
    //                 while(x < Xb) {
    //                     x++;
    //                     if (d <= 0){
    //                         d = d + 2 * dyAbs;
    //                     }
    //                     else {
    //                         d = d + 2 * (dyAbs - dx);
    //                         y--;
    //                     }
    //                     vertices.push(vec2(x/10, y/10));
    //                 }
    //             }
    //             else{
    //                 while(y > Yb) {
    //                     y--;
    //                     if (d <= 0){
    //                         d = d + 2 * dyAbs;
    //                     }
    //                     else {
    //                         d = d + 2 * (dyAbs - dx);
    //                         y--;
    //                     }
    //                     vertices.push(vec2(x/10, y/10));
    //                 }
    //             }
                
    //         }
    //         else{

    //         }
    //     }
        
    // }
    // else if (dy > dx && dx > 0){
    //     d = 2 * dx - dy;
    //     var x = Xa;
    //     var y = Ya;
    //     line.push(vec2(x, y));
    //     while(y < Yb) {
    //         y++;
    //         if (d <= 0){
    //             d = d + 2 * dy;
    //         }
    //         else {
    //             d = d + 2 * (dy - dx);
    //             y++;
    //         }
    //         vertices.push(vec2(x/10, y/10));
    //     }
    // }    
    
    

    // vertices.push(line);

    console.log(vertices)
}
