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

var cameraContext = 0

async function main() {
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

    var oxygenVertices = twgl.primitives.createTorusVertices(16, 4, 16, 16)
    oxygenVertices.color = pseudoshadeColor(oxygenVertices.position, 255, 0, 0, 255)
    delete oxygenVertices.texcoord

    var hydrogen1Vertices = twgl.primitives.createTorusVertices(12, 4, 16, 16)
    hydrogen1Vertices.color = pseudoshadeColor(hydrogen1Vertices.position, 0, 125, 255, 255)
    delete hydrogen1Vertices.texcoord

    var hydrogen2Vertices = twgl.primitives.createTorusVertices(12, 4, 16, 16)
    hydrogen2Vertices.color = pseudoshadeColor(hydrogen2Vertices.position, 0, 255, 255, 255)
    delete hydrogen2Vertices.texcoord

    var oxygenBufferInfo = twgl.createBufferInfoFromArrays(gl, oxygenVertices)
    var hydrogen1BufferInfo = twgl.createBufferInfoFromArrays(gl, hydrogen1Vertices)
    var hydrogen2BufferInfo = twgl.createBufferInfoFromArrays(gl, hydrogen2Vertices)

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
        u_colorMult: [1, 1, 1, 1],
        u_matrix: twgl.m4.identity(),
    };
    var hydrogen1Uniforms = {
        u_colorMult: [1, 1, 1, 1],
        u_matrix: twgl.m4.identity(),
    };
    var hydrogen2Uniforms = {
        u_colorMult: [1, 1, 1, 1],
        u_matrix: twgl.m4.identity(),
    };

    var dist = 50

    var oxygenTranslation = [0, 0, 0];
    var hydrogen1Translation = [-dist, 0, 0];
    var hydrogen2Translation = [dist, 0, 0];

    var hydrogen1Revolution = 90;
    var hydrogen1Inclination = 60;

    var hydrogen2Revolution = 90;
    var hydrogen2Inclination = -60;

    var cameras = [
        [[0, 0, 100], oxygenTranslation],
        [oxygenTranslation, [0, 0, 100]],
        [hydrogen1Translation, oxygenTranslation],
        [hydrogen2Translation, oxygenTranslation],
    ]
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
            twgl.m4.perspective(fieldOfViewRadians, aspect, 1, 2000);

        // Camera Logic
        // Compute the camera's matrix using look at.
        var cameraPosition = cameras[cameraContext][0];
        var target = cameras[cameraContext][1];
        var up = [0, 1, 0];
        var cameraMatrix = twgl.m4.lookAt(cameraPosition, target, up);

        // Make a view matrix from the camera matrix.
        var viewMatrix = twgl.m4.inverse(cameraMatrix);

        var viewProjectionMatrix = twgl.m4.multiply(projectionMatrix, viewMatrix);

        hydrogen1Revolution += 3;
        hydrogen1Inclination -= 9/36;
        hydrogen1Translation[2] = dist*Math.cos(degToRad(hydrogen1Revolution))
        hydrogen1Translation[1] = dist*Math.sin(degToRad(hydrogen1Revolution))*Math.cos(degToRad(hydrogen1Inclination))
        hydrogen1Translation[0] = dist*Math.sin(degToRad(hydrogen1Revolution))*Math.sin(degToRad(hydrogen1Inclination))

        
        hydrogen2Revolution -= 3;
        hydrogen2Inclination += 9/36;
        hydrogen2Translation[2] = dist*Math.cos(degToRad(hydrogen2Revolution))
        hydrogen2Translation[1] = dist*Math.sin(degToRad(hydrogen2Revolution))*Math.cos(degToRad(hydrogen2Inclination))
        hydrogen2Translation[0] = dist*Math.sin(degToRad(hydrogen2Revolution))*Math.sin(degToRad(hydrogen2Inclination))

        var oxygenXRotation = 0;
        var oxygenYRotation = time * 10;
        var hydrogen1XRotation = time * 10;
        var hydrogen1YRotation = 0;
        var hydrogen2XRotation = -time * 10;
        var hydrogen2YRotation = 0;

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

function changeCamera() {
    let select = document.getElementById("select");
    cameraContext = select.value
}

main();