"use strict";

var vs = `#version 300 es

in vec4 a_position;
in vec4 a_color;

uniform mat4 u_matrix;

out vec4 v_color;

void main() {
  // Multiply the position by the matrix.
  gl_Position = u_matrix * a_position;

  // Pass the color to the fragment shader.
  v_color = a_color;
}
`;

var fs = `#version 300 es
precision highp float;

// Passed in from the vertex shader.
in vec4 v_color;

uniform vec4 u_colorMult;

out vec4 outColor;

void main() {
   outColor = v_color * u_colorMult;
}
`;

function main() {
    // Get A WebGL context
    /** @type {HTMLCanvasElement} */
    var canvas = document.querySelector("#gl-canvas");
    var gl = canvas.getContext("webgl2");
    if (!gl) {
        return;
    }

    // Tell the twgl to match position with a_position, n
    // normal with a_normal etc..
    twgl.setAttributePrefix("a_");


    

    var hydrogen1Vertices = twgl.primitives.createCubeVertices(12)


    hydrogen1Vertices.color = solidColor(hydrogen1Vertices.position, 255, 0, 0, 255)

    console.log(hydrogen1Vertices);

    var bufferInfo = twgl.createBufferInfoFromArrays(gl, hydrogen1Vertices)

    var oxygenBufferInfo = flattenedPrimitives.createCubeBufferInfo(gl, 16);
    var hydrogen1BufferInfo = twgl.primitives.createCubeBufferInfo(gl, 12)
    var hydrogen2BufferInfo = bufferInfo

    console.log(oxygenBufferInfo)
    console.log(hydrogen1BufferInfo)
    console.log(hydrogen2BufferInfo)

    // setup GLSL program
    var programInfo = twgl.createProgramInfo(gl, [vs, fs]);

    var oxygenVAO = twgl.createVAOFromBufferInfo(gl, programInfo, oxygenBufferInfo);
    var hydrogen1VAO = twgl.createVAOFromBufferInfo(gl, programInfo, hydrogen1BufferInfo);
    var hydrogen2VAO = twgl.createVAOFromBufferInfo(gl, programInfo, hydrogen2BufferInfo);

    function degToRad(d) {
        return d * Math.PI / 180;
    }

    var fieldOfViewRadians = degToRad(60);

    // Uniforms for each object.
    var oxygenUniforms = {
        u_colorMult: [0.5, 1, 0.5, 1],
        u_matrix: m4.identity(),
    };
    var hydrogen1Uniforms = {
        u_colorMult: [1, 0.5, 0.5, 1],
        u_matrix: m4.identity(),
    };
    var hydrogen2Uniforms = {
        u_colorMult: [0.5, 0.5, 1, 1],
        u_matrix: m4.identity(),
    };
    var oxygenTranslation = [0, 0, 0];
    var hydrogen1Translation = [-40, 0, 0];
    var hydrogen2Translation = [40, 0, 0];

    function computeMatrix(viewProjectionMatrix, translation, xRotation, yRotation) {
        var matrix = m4.translate(viewProjectionMatrix,
            translation[0],
            translation[1],
            translation[2]);
        matrix = m4.xRotate(matrix, xRotation);
        return m4.yRotate(matrix, yRotation);
    }

    requestAnimationFrame(drawScene);

    // Draw the scene.
    function drawScene(time) {
        time = time * 0.0005;

        twgl.resizeCanvasToDisplaySize(gl.canvas);

        // Tell WebGL how to convert from clip space to pixels
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.enable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);

        // Compute the projection matrix
        var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        var projectionMatrix =
            m4.perspective(fieldOfViewRadians, aspect, 1, 2000);

        // Compute the camera's matrix using look at.
        var cameraPosition = [0, 0, 100];
        var target = [0, 0, 0];
        var up = [0, 1, 0];
        var cameraMatrix = m4.lookAt(cameraPosition, target, up);

        // Make a view matrix from the camera matrix.
        var viewMatrix = m4.inverse(cameraMatrix);

        var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

        var oxygenXRotation = time;
        var oxygenYRotation = time;
        var hydrogen1XRotation = -time;
        var hydrogen1YRotation = time;
        var hydrogen2XRotation = time;
        var hydrogen2YRotation = -time;

        gl.useProgram(programInfo.program);

        // ------ Draw the oxygen --------

        // Setup all the needed attributes.
        gl.bindVertexArray(oxygenVAO);

        oxygenUniforms.u_matrix = computeMatrix(
            viewProjectionMatrix,
            oxygenTranslation,
            oxygenXRotation,
            oxygenYRotation);

        // Set the uniforms we just computed
        twgl.setUniforms(programInfo, oxygenUniforms);

        twgl.drawBufferInfo(gl, oxygenBufferInfo);

        // ------ Draw the hydrogen1 --------

        // Setup all the needed attributes.
        gl.bindVertexArray(hydrogen1VAO);

        hydrogen1Uniforms.u_matrix = computeMatrix(
            viewProjectionMatrix,
            hydrogen1Translation,
            hydrogen1XRotation,
            hydrogen1YRotation);

        // Set the uniforms we just computed
        twgl.setUniforms(programInfo, hydrogen1Uniforms);

        twgl.drawBufferInfo(gl, hydrogen1BufferInfo);

        // ------ Draw the hydrogen2 --------

        // Setup all the needed attributes.
        gl.bindVertexArray(hydrogen2VAO);

        hydrogen2Uniforms.u_matrix = computeMatrix(
            viewProjectionMatrix,
            hydrogen2Translation,
            hydrogen2XRotation,
            hydrogen2YRotation);

        // Set the uniforms we just computed
        twgl.setUniforms(programInfo, hydrogen2Uniforms);

        twgl.drawBufferInfo(gl, hydrogen2BufferInfo);

        requestAnimationFrame(drawScene);
    }
}

main();