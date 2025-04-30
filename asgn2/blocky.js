/*Valentina Serrano
04-26-2025
blocky.js*/

// Global Variables
let canvas, gl;
let a_Position, a_Color;
let u_ModelMatrix, u_ViewMatrix, u_ProjMatrix;
let modelMatrix = new Matrix4();
let viewMatrix = new Matrix4();
let projMatrix = new Matrix4();

// Animation
let g_time = 0;
let g_startTime = performance.now();

console.log('blocky.js loaded');


function main() {
    // Get the canvas element from HTML
    canvas = document.getElementById('webgl');
  
    // Get WebGL context
    gl = getWebGLContext(canvas);
    if (!gl) {
      console.log('Failed to get WebGL context');
      return;
    }
  
    // Initialize shaders from HTML script tags
    if (!initShaders(gl,
      document.getElementById('vertex-shader').text,
      document.getElementById('fragment-shader').text)) {
      console.log('Failed to initialize shaders.');
      return;
    }
  
    // Get shader attribute/uniform locations
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
  
    if (a_Position < 0 || a_Color < 0 || !u_ModelMatrix || !u_ViewMatrix || !u_ProjMatrix) {
      console.log('Failed to get attribute/uniform locations');
      return;
    }
  
    // Set up the view and projection matrices
    viewMatrix.setLookAt(0, 0, 5, 0, 0, 0, 0, 1, 0);
    projMatrix.setPerspective(60, canvas.width / canvas.height, 1, 10);
  
    // Set up WebGL render state
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // black background
    gl.enable(gl.DEPTH_TEST);          // enable z-buffer
  
    // Call the animation loop
    tick();
  }
  

function tick() {
    g_time = (performance.now() - g_startTime) / 1000.0;
    updateAnimation(); 
    updateViewMatrix();
    renderScene();
    requestAnimationFrame(tick);
}

function updateViewMatrix() {
  let rad = g_cameraAngle * Math.PI / 180;
  let eyeX = 5 * Math.sin(rad);
  let eyeZ = 5 * Math.cos(rad);
  viewMatrix.setLookAt(eyeX, 0, eyeZ, 0, 0, 0, 0, 1, 0);
}

function renderScene() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
  gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);

  let baseMatrix = new Matrix4();
  baseMatrix.rotate(g_xModelRotate, 1, 0, 0);
  baseMatrix.rotate(g_globalRotate, 0, 1, 0);

  //Body
  modelMatrix.set(baseMatrix);
  modelMatrix.translate(0, -0.15, 0);
  modelMatrix.scale(0.25, 1.55, 0.25);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  drawCube();

  //Head
  modelMatrix.set(baseMatrix);
  modelMatrix.translate(0, 0.75, 0);
  modelMatrix.scale(0.35, 0.25, 0.35);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  drawCube();

  //left antenna 1
  modelMatrix.set(baseMatrix);
  modelMatrix.translate(-0.15, 1.05, 0.1);
  modelMatrix.rotate(g_lAntOne, 1, 0, 0);
  modelMatrix.scale(0.1, 0.35, 0.1);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  drawCube();

  //l antenna 2
  modelMatrix.translate(-0.15, 0.85, 0.1);
  modelMatrix.rotate(g_lAntTwo || 0, 1, 1, 0);
  modelMatrix.translate(0, -0.1, 0);
  modelMatrix.scale(0.5, 0.5, 0.5);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  drawCube();

  //r antenna 1
  modelMatrix.set(baseMatrix);
  modelMatrix.translate(0.15, 1.05, 0.1);
  modelMatrix.rotate(g_rAntOne, 1, 0, 0);
  modelMatrix.scale(0.1, 0.35, 0.1);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  drawCube();

  //r antenna 2
  modelMatrix.translate(0.15, 0.85, 0.1);
  modelMatrix.rotate(g_rAntTwo || 0, 1, 1, 0);
  modelMatrix.translate(0, -0.1, 0);
  modelMatrix.scale(0.5, 0.5, 0.5);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  drawCube();

  //Flutter SetUp
  let wingL1Angle = g_lTopWing;
  let wingL2Angle = g_lLowWing;
  let wingR1Angle = g_rTopWing;
  let wingR2Angle = g_rLowWing;

  modelMatrix.rotate(wingL1Angle, 0, 1, 0); 
  modelMatrix.rotate(wingL1Angle, 0, 1, 0);
  modelMatrix.rotate(wingL2Angle, 0, 1, 0); 
  modelMatrix.rotate(wingL2Angle, 0, 1, 0); 
  modelMatrix.rotate(wingR1Angle, 0, 1, 0); 
  modelMatrix.rotate(wingR1Angle, 0, 1, 0); 
  modelMatrix.rotate(wingR2Angle, 0, 1, 0); 
  modelMatrix.rotate(wingR2Angle, 0, 1, 0); 

  // Left Wing 1
  modelMatrix.set(baseMatrix);
  modelMatrix.translate(-0.5, 0.1, 0);
  modelMatrix.rotate(g_lTopWing, 0, -1, 0);
  modelMatrix.scale(0.9, 0.85, 0.2);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  drawCube();

  // L Wing 2
  modelMatrix.translate(0.1, -0.7, 0);
  modelMatrix.rotate(g_lLowWing || 0, 0, 1, 0);
  modelMatrix.translate(0, -0.15, 0);
  modelMatrix.scale(0.8, 0.65, 0.2);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  drawCube();

  // Right Wing 1
  modelMatrix.set(baseMatrix);
  modelMatrix.translate(0.5, 0.1, 0);
  modelMatrix.rotate(g_rTopWing, 0, -1, 0);
  modelMatrix.scale(0.9, 0.85, 0.2);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  drawCube();

  // R Wing 2
  modelMatrix.translate(-0.1, -0.7, 0);
  modelMatrix.rotate(g_rLowWing || 0, 0, 1, 0);
  modelMatrix.translate(0, -0.15, 0);
  modelMatrix.scale(0.8, 0.65, 0.2);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  drawCube();
}

// Camera rotation variable
let g_cameraAngle = 0;
let g_globalRotate = 0;

function yGlobalRotate(val) {
  g_globalRotate = parseFloat(val);
  renderScene();
}

let g_xModelRotate = 0;
function modelRotate(val) {
  g_xModelRotate = parseFloat(val);
  renderScene();
}

//Flutter Animation
let g_flutterSpeed = 5;
let g_FlutterAnim = false;

let g_lTopWing = 0;
let g_lLowWing = 0;
let g_rTopWing = 0;
let g_rLowWing = 0;

function animSpeed(val) {
  g_flutterSpeed = parseFloat(val);
}

function updateAnimation() {
  if (g_FlutterAnim) {
    g_lTopWing = 30 * Math.sin(g_time * g_flutterSpeed);
    g_lLowWing = 30 * Math.sin(g_time * g_flutterSpeed);
    g_rTopWing = 30 * Math.sin(g_time * g_flutterSpeed);
    g_rLowWing = 30 * Math.sin(g_time * g_flutterSpeed);
  }
}

function flutterToggle() {
  g_FlutterAnim = !g_FlutterAnim;
}

//Antenna Slides
let g_lAntOne = 0;
let g_lAntTwo = 0;
let g_rAntOne = 0;
let g_rAntTwo = 0;

function lAntOneRotate(val) {
  g_lAntOne = parseFloat(val);
  renderScene();
}

function lAntTwoRotate(val) {
  g_lAntTwo = parseFloat(val);
  renderScene();
}

function rAntOneRotate(val) {
  g_rAntOne = parseFloat(val);
  renderScene();
}

function rAntTwoRotate(val) {
  g_rAntTwo = parseFloat(val);
  renderScene();
}

//Wing Sliders
function lTopWingRotate(val) {
  g_lTopWing = parseFloat(val);
  renderScene();
}

function rTopWingRotate(val) {
  g_rTopWing = parseFloat(val);
  renderScene();
}


function lLowWingRotate(val) {
  g_lLowWing = parseFloat(val);
  renderScene();
}


function rLowWingRotate(val) {
  g_rLowWing = parseFloat(val);
  renderScene();
}

function drawCube() {
  let vertices = new Float32Array([
    // Positions         // Colors
    -0.5, -0.5, -0.5,    1.0, 0.0, 0.0,
     0.5, -0.5, -0.5,    0.0, 1.0, 0.0,
     0.5,  0.5, -0.5,    0.0, 0.0, 1.0,
    -0.5,  0.5, -0.5,    1.0, 1.0, 0.0,
    -0.5, -0.5,  0.5,    0.0, 1.0, 1.0,
     0.5, -0.5,  0.5,    1.0, 0.0, 1.0,
     0.5,  0.5,  0.5,    0.5, 0.5, 0.5,
    -0.5,  0.5,  0.5,    1.0, 1.0, 1.0,
  ]);

  let indices = new Uint8Array([
    0, 1, 2, 0, 2, 3,
    4, 5, 6, 4, 6, 7,
    0, 1, 5, 0, 5, 4,
    2, 3, 7, 2, 7, 6,
    0, 3, 7, 0, 7, 4,
    1, 2, 6, 1, 6, 5,
  ]);

  // Create buffers
  let vertexBuffer = gl.createBuffer();
  let indexBuffer = gl.createBuffer();
  if (!vertexBuffer || !indexBuffer) {
    console.log('Failed to create buffers');
    return;
  }

  // Bind and write vertex buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  let FSIZE = vertices.BYTES_PER_ELEMENT;

  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
  gl.enableVertexAttribArray(a_Position);

  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
  gl.enableVertexAttribArray(a_Color);

  // Bind and write index buffer
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  // Draw
  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);
}

  
