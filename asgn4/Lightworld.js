/*
Valentina Serrano
5-26-2025
1848892 
Lightworld.js
*/

var VSHADER_SOURCE = `
    precision mediump float;
    attribute vec4 a_Position;
    attribute vec2 a_UV;
    attribute vec3 a_Normal;
    varying vec2 v_UV;
    varying vec3 v_Normal;
    varying vec4 v_VertPos;
    uniform mat4 u_ModelMatrix;
    uniform mat4 u_GlobalRotateMatrix;
    uniform mat4 u_ViewMatrix;
    uniform mat4 u_ProjectionMatrix;

    void main() {
        gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
        v_UV = a_UV;
        v_Normal = a_Normal;
        v_VertPos = u_ModelMatrix * a_Position;
    }`;

//Fragment shader program
var FSHADER_SOURCE =`
    precision mediump float;
    varying vec2 v_UV;
    varying vec3 v_Normal;
    uniform vec4 u_FragColor;
    uniform sampler2D u_Sampler0;
    uniform sampler2D u_Sampler1;
    uniform sampler2D u_Sampler2;
    uniform int u_whichTexture;
    uniform vec3 u_lightPos;
    uniform vec3 u_cameraPos;
    uniform vec3 u_lightColor;
    uniform int u_light;
    uniform int u_lightC;
    varying vec4 v_VertPos;
    
    uniform vec3 u_spotLightPos;
    
    void main() {
      if(u_whichTexture == -3){
           gl_FragColor = vec4((v_Normal+1.0)/2.0, 1.0);
       } else if(u_whichTexture == -2){
           gl_FragColor = u_FragColor;
       } else if (u_whichTexture ==-1){
           gl_FragColor = vec4(v_UV,1.0,1.0);
       } else if(u_whichTexture == 0){
           gl_FragColor = texture2D(u_Sampler0, v_UV);
       } else if(u_whichTexture == 1){
           gl_FragColor = texture2D(u_Sampler1, v_UV);
       } else if(u_whichTexture == 2){
           gl_FragColor = texture2D(u_Sampler2, v_UV);
       } else{
           gl_FragColor = vec4(1,.2,.2,1);
       }
    
       if (u_light==1){
    
       vec3 lightVector = u_lightPos - vec3(v_VertPos);
       float r = length(lightVector);
       vec3 L = normalize(lightVector);
       vec3 N = normalize(v_Normal);
       float nDotL = max(dot(N,L), 0.0);
    
       vec3 R = reflect(-L,N);
    
       vec3 E = normalize(u_cameraPos - vec3(v_VertPos));
    
       float specular = pow(max(dot(E,R), 0.0), 100.0);
    
       vec3 diffuse = vec3(gl_FragColor) * nDotL;
       vec3 ambient = vec3(gl_FragColor) * 0.3;
       if(u_whichTexture == 0 || u_whichTexture == 1|| u_whichTexture == -2)
           specular = 0.0;
           if(u_lightC == 0){
           gl_FragColor = vec4(specular+diffuse+ambient, 1.0);
           
           } else{
           gl_FragColor = vec4(u_lightColor*(diffuse+ambient), 1.0);
           }
       } else if (u_light == 2){
    
       vec3 lightVector = u_spotLightPos - vec3(v_VertPos);
       vec3 L = normalize(lightVector);
       vec3 N = normalize(v_Normal);
       float nDotL = dot(N,L);
           float spotFactor = 1.0;
           vec3 D = -vec3(0,-1,0);
       float spotCosine = dot(D,L);
           float spotCosineCutoff = 0.98; 
           if (spotCosine >= spotCosineCutoff) { 
                spotFactor = pow(spotCosine,2.0);
           } else { 
                spotFactor = 0.0;
           }
           if(dot(N,L) <=0.0){
               gl_FragColor = vec4(0.0,0.0,0.0,1.0);
          } else{
               vec3 diffuse = vec3(gl_FragColor) * nDotL;
               vec3 ambient = vec3(gl_FragColor) * 0.3;
               vec3 reflection = dot(L,N) * u_lightColor * diffuse;
               vec3 R = reflect(-L,N);
               vec3 E = normalize(u_cameraPos - vec3(v_VertPos));
               float specular = pow(max(dot(E,R), 0.0), 100.0);
               if(dot(R,E)>0.0){
                   float factor = pow(dot(R,E),2.0);
                   reflection += factor *specular* u_lightColor;
                 }
               vec3 color = spotFactor*reflection;
               gl_FragColor = vec4(color, 1.0);
           }
    
       }
    }`;

let canvas, gl;
let a_Position, a_UV;
let u_FragColor, u_ModelMatrix, u_ProjectionMatrix;
let u_ViewMatrix, u_GlobalRotateMatrix, u_whichTexture;

let a_Normal = false;
let g_normal = false;

let u_Sampler0, u_Sampler1, u_Sampler2;

let g_SummoningSpell = false;
let g_migong = false;
let g_Animation = false;
let g_set_Location = 0;
let Shift_and_Click = false;

var g_vertexBufferCube = null;
var g_Angle = 0;
var head_animation = 0;
var g_tails_animation = 0;
var g_Angle2 = 0;

let g_BoolTailAnimation = false;
let g_globalBool = true;

var g_start_time = performance.now() / 1000.0;
var g_seconds = performance.now() / 1000.0 - g_start_time;
let g_camera = new Camera();

let g_yaw = -90;
let g_pitch = 0;

let u_spotLightPos;
let g_lightPos = [10,3,12]
let drawMap_bool = false;
let g_globalAngleY = 0;
let g_globalAngleX = 0;
let g_globalAngleZ = 0;
let g_lightColor = [1,1,1];
let g_lightMoveOn = false;
let g_spotlightPos = [10.125, g_set_Location + 0.4, 7.15];

let u_lightColor;
let u_lightC;

function setupCanvas() {
    canvas = document.getElementById('webgl');
    gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function connectVariablesToGLSL() {
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to initialize shaders.');
        return;
    }

    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }
    a_UV = gl.getAttribLocation(gl.program, 'a_UV');
    if (a_UV < 0) {
        console.log('Failed to get the storage location of a_UV');
        return;
    }

    a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
    if (a_Normal < 0) {
        console.log('Failed to get the storage location of a_Normal');
        return;
    }

    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
    }
    u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
    if (!u_GlobalRotateMatrix) {
        console.log('Failed to get the storage location of u_GlobalRotateMatrix');
        return;
    }
    u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    if (!u_ViewMatrix) {
        console.log('Failed to get the storage location of u_ViewMatrix');
        return;
    }
    u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
    if (!u_ProjectionMatrix) {
        console.log('Failed to get the storage location of u_ProjectionMatrix');
        return;
    }
    u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
        console.log('Failed to get the storage location of u_ModelMatrix');
        return;
    }
    var u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
    if (!u_Sampler0) {
        console.log('Failed to get the storage location of u_sampler0');
        return false;
    }
    u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
    if (!u_Sampler1) {
        console.log('Failed to get the storage location of u_sampler1');
        return;
    }
    u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
    if (!u_Sampler2) {
        console.log('Failed to get the storage location of u_sampler2');
        return;
    }
    u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
    if (!u_whichTexture) {
        console.log('Failed to get the storage location of u_sampler3');
        return;
    }

    u_lightPos = gl.getUniformLocation(gl.program, 'u_lightPos');
    if (!u_lightPos) {
        console.log('Failed to get the storage location of u_lightPos');
        return;
    }

    u_spotLightPos = gl.getUniformLocation(gl.program, 'u_spotLightPos');
    if (!u_spotLightPos) {
        console.log('Failed to get the storage location of u_spotLightPos');
        return;
    }

    u_cameraPos = gl.getUniformLocation(gl.program, 'u_cameraPos');
    if (!u_cameraPos) {
        console.log('Failed to get the storage location of u_cameraPos');
        return;
    }

    u_lightColor = gl.getUniformLocation(gl.program, 'u_lightColor');
    if (!u_lightColor) {
        console.log('Failed to get the storage location of u_lightColor');
        return;
    }

    u_light = gl.getUniformLocation(gl.program, 'u_light');
    if (!u_light) {
        console.log('Failed to get the storage location of u_light');
        return;
    }

    u_lightC = gl.getUniformLocation(gl.program, 'u_lightC');
    if (!u_lightC) {
        console.log('Failed to get the storage location of u_lightC');
        return;
    }
    
    var identityM = new Matrix4();
    gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

function lightCalls() {
    document.getElementById('Normal_On').addEventListener('click', function() {
        g_normal = !g_normal;
        renderAllShapes();
    });

    const lightSliders = ['X', 'Y', 'Z'];
    lightSliders.forEach((axis, i) => {
        document.getElementById(`lightSlide${axis}`).addEventListener('mousemove', function (ev) {
        if (ev.buttons === 1) {
            g_lightPos[i] = this.value / 100;
            renderAllShapes();
        }
        });
    });

    const spotSliders = ['X', 'Y', 'Z'];
    spotSliders.forEach((axis, i) => {
        document.getElementById(`SpotlightSlide${axis}`).addEventListener('mousemove', function (ev) {
        if (ev.buttons === 1) {
            g_spotlightPos[i] = this.value / 10;
        }
        });
    });

    document.getElementById('toggle_light_animation').addEventListener('click', () => {
        g_lightMoveOn = !g_lightMoveOn;
        renderAllShapes();

        document.getElementById('toggle_light_animation').textContent =
        g_lightMoveOn ? 'Turn Off Light Animation' : 'Turn On Light Animation';
    });


    let lightOn = true;

    document.getElementById('toggleLight').onclick = () => {
        lightOn = !lightOn;
        
        if (lightOn) {
            gl.uniform1i(u_light, 1);
        } else {
            gl.uniform1i(u_light, 0);
            gl.uniform1i(u_lightC, 0);
            g_lightColor = [1, 1, 1];
            
            ['Red', 'Green', 'Blue'].forEach((col, i) => {
                document.getElementById(`light${col}`).value = g_lightColor[i] * 255;
            });
        }

        document.getElementById('toggleLight').textContent =
        lightOn ? 'Turn Off Light' : 'Turn On Light';
    };

    let spotlightOn = false;
    document.getElementById('SpotlightToggle').onclick = () => {
        spotlightOn = !spotlightOn;
        if (spotlightOn) {
            gl.uniform1i(u_light, 2);
        } else {
            gl.uniform1i(u_light, 0);
            gl.uniform1i(u_lightC, 0);
            g_lightColor = [1, 1, 1];
            ['Red', 'Green', 'Blue'].forEach((col, i) => {
            document.getElementById(`light${col}`).value = g_lightColor[i] * 255;
            });
        }
        document.getElementById('SpotlightToggle').textContent =
        lightOn ? 'Turn Off Spotlight' : 'Turn On Spotlight';
    };

    ['Red', 'Green', 'Blue'].forEach((col, i) => {
        document.getElementById(`light${col}`).addEventListener('mousemove', function (ev) {
        if (ev.buttons === 1) {
            gl.uniform1i(u_lightC, 1);
            g_lightColor[i] = this.value / 100;
        }
        });
    });
}


function initTextures() {
    var image0 = new Image();
    if (!image0) {
        console.log('Failed to create the image0 object');
        return false;
    }

    image0.onload = function () {
        sendTextureToTEXTURE0(image0);
    };

    if (g_globalBool === true) {
        image0.src = 'dirt.jpeg';
    }
    var image1 = new Image();
    if (!image1) {
        console.log('Failed to create the image1 object');
        return false;
    }
     image1.onload = function () {
        sendTextureToTEXTURE1(image1);
    };
    if (g_globalBool === true) {
        image1.src = 'sky.png';
    }
    var image2 = new Image();
    if (!image2) {
        console.log('Failed to create the image2 object');
        return false;
    }

    image2.onload = function () {
        sendTextureToTEXTURE2(image2);
    };
    if (g_globalBool === true) {
        image2.src = 'grass.png';
    }

}

function sendTextureToTEXTURE0(image) {
    var texture = gl.createTexture();
    if (!texture) {
        console.log('Failed to create the texture0 object');
        return false;
    }

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(u_Sampler0, 0);

    console.log("Rendered the sky texture");
}

function sendTextureToTEXTURE1(image) {
    var texture = gl.createTexture();
    if (!texture) {
        console.log('Failed to create the texture1 object');
        return false;
    }


    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(u_Sampler1, 1);

    console.log("Rendered the Grass texture")
}

function sendTextureToTEXTURE2(image) {
    var texture = gl.createTexture();

    if (!texture) {
        console.log('Failed to create the texture2 object');
        return false;
    }

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(u_Sampler2, 2);

    console.log("Rendered the dirt texture")
}

function main() {
    setupCanvas();
    connectVariablesToGLSL();
    lightCalls();
    initTextures();
    document.onkeydown = keydown;
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    const dragRotation = [g_globalAngleX, g_globalAngleY];
    initEventHandlers(canvas, dragRotation);
    requestAnimationFrame(tick);
}

function tick() {
    g_seconds = performance.now() / 1000.0 - g_start_time;
    updateAnimation();
    renderAllShapes();
    requestAnimationFrame(tick);
}

function updateAnimation() {
    if (g_Animation) {
        g_set_Location = ((Math.sin(g_seconds * 3)) / 30) - (.3);
        g_Angle = 10 * Math.sin(g_seconds);
        head_animation = 12 * Math.sin(g_seconds);
        g_Angle2 = 3 * Math.sin(g_seconds);
    }
    if (g_BoolTailAnimation) {
        g_tails_animation = 5 * Math.sin(g_seconds);
    }

    if (g_lightMoveOn) {
        const yOscillation = Math.cos(g_seconds) * 2;
        g_lightPos[1] = yOscillation;
        g_spotlightPos[1] = yOscillation;
    }
}

function keydown(ev) {
   ev.preventDefault();

   switch (ev.keyCode) {
       case 87: // W
       case 38: // Up Arrow
           g_camera.forward();
           break;
       case 83: // S
       case 40: // Down Arrow
           g_camera.backward();
           break;
       case 65: // A
       case 37: // Left Arrow
           g_camera.left();
           break;
       case 68: // D
       case 39: // Right Arrow
           g_camera.right();
           break;
       case 69: // E
           g_camera.rotateRight();
           break;
       case 81: // Q
           g_camera.rotateLeft();
           break;
       case 90: // Z
           g_camera.upward();
           break;
       case 88: // X
           g_camera.downward();
           break;
           case 70: // F = add block
           tryPlaceBlock();
           break;
       case 71: // G = delete block
           tryRemoveBlock();
           break;       
   }

   renderAllShapes();
}


function renderAllShapes() {
    var startTime = performance.now();

    var projMat = new Matrix4();
    projMat.setPerspective(60, canvas.width / canvas.height, .1, 100);
    gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

    var viewMat = new Matrix4();
    viewMat.setLookAt(
        g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2],
        g_camera.at.elements[0], g_camera.at.elements[1], g_camera.at.elements[2],
        g_camera.up.elements[0], g_camera.up.elements[1], g_camera.up.elements[2]
    );
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);
    
    const globalRotMat = new Matrix4()
    .rotate(g_globalAngleX, 1, 0, 0)
    .rotate(g_globalAngleY, 0, 1, 0)
    .rotate(g_globalAngleZ, 0, 0, 1);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

    // === Clear Canvas ===
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // === Lighting Uniforms ===
    gl.uniform3fv(u_lightPos, g_lightPos);
    gl.uniform3fv(u_spotLightPos, g_spotlightPos);
    gl.uniform3fv(u_lightColor, g_lightColor);
    gl.uniform3fv(u_cameraPos, g_camera.eye.elements);

    // === Draw Floor ===
    const floor = new Cube();
    floor.textureNum = g_normal ? -3 : 2;
    floor.matrix.translate(0, -0.75, 0);
    floor.matrix.scale(20, 0.01, 20);
    floor.matrix.translate(0, -0.5, 0);
    floor.drawCubeFast();

    // === Draw Light Cube ===
    const lightCube = new Cube();
    lightCube.color = [2, 2, 0, 1];
    lightCube.textureNum = g_normal ? -3 : -2;
    lightCube.matrix.translate(...g_lightPos);
    lightCube.matrix.scale(-0.1, -0.1, -0.1);
    lightCube.matrix.translate(-0.5, -0.5, -0.5);
    lightCube.drawCubeFast();

    // === Draw Scene Objects ===
    drawSetting();

    drawSetting();
    if (g_migong) {
        draw_migong();
    } else {
        drawMap();
    }
    if (g_SummoningSpell) {
        guardianSummon()
    }
    drawMap();

    const duration = performance.now() - startTime;
    const fpsText = `ms: ${Math.floor(duration)} fps: ${Math.floor(10000 / duration) / 10}`;
    SendTextToHTML(fpsText, "fps");
}

function SendTextToHTML(text, htmlID) {
    var htmlElm = document.getElementById(htmlID);
    htmlElm.innerHTML = text;
}

function drawSetting() {
    let floor = new Cube();
    floor.textureNum = 2;
    floor.matrix.translate(-16, -0.76, -16);
    floor.matrix.scale(32, 0.01, 32);
    floor.drawCubeFast();
    
    let sky = new Cube();
    sky.textureNum = 1;
    sky.matrix.translate(0,0,);
    sky.matrix.scale(30,30,30);
    sky.drawCubeFast();

    // === Decorative Sphere ===
    const redSphere = new Sphere();
    redSphere.color = [1, 0, 0, 1];         // red
    redSphere.textureNum = -2;             // force flat color
    redSphere.matrix.translate(12, 1, 12);
    redSphere.render();
}

let g_map = [];

for (let i = 0; i < 32; i++) {
    let row = [];
    for (let j = 0; j < 32; j++) {
        let rand = Math.random();
        if (rand < 0.1) {
            row.push(1);
        } else if (rand < 0.2) {
            row.push(2);
        } else {
            row.push(0);
        }
    }
    g_map.push(row);
}

let terrainMap = [];

for (let i = 0; i < 32; i++) {
  let row = [];
  for (let j = 0; j < 32; j++) {
    let h = Math.floor(2 * Math.abs(Math.sin(i * 0.3 + j * 0.2)));
    row.push(h);
  }
  terrainMap.push(row);
}

function drawMap() {
   for (let x = 0; x < 32; x++) {
       for (let y = 0; y < 32; y++) {
           let height = g_map[x][y];

           for (let h = 0; h < height; h++) {
               let cube = new Cube();
               cube.textureNum = 0;
               cube.matrix.translate(y - 16, h - 0.75, x - 16);
               cube.drawCubeFast();
           }
       }
   }
}



let g_migongmap = [
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [2, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 2, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 2, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 2, 0, 0, 0, 0, 2, 0, 2, 2, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 4, 6, 6, 6, 6, 4, 0, 0, 0, 0, 2, 0, 0, 0, 0, 4, 4, 4, 4, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 4, 6, 4, 4, 6, 4, 0, 2, 0, 0, 2, 0, 0, 0, 0, 4, 6, 6, 4, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 4, 6, 4, 4, 6, 4, 0, 0, 0, 0, 2, 0, 0, 0, 0, 4, 6, 6, 4, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 4, 6, 6, 6, 6, 4, 0, 0, 0, 0, 2, 0, 0, 0, 0, 4, 4, 4, 4, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 4,4, 4, 4, 4, 4, 4, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0,4,0, 4,0, 0, 0, 0, 0, 6, 6, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 6, 6, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 12, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 2, 2, 0, 0, 0, 0, 0, 0, 12, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
]

function draw_migong() {
    for (x = 0; x < 32; x++) {
        for (y = 0; y < 32; y++) {
            for (z = 0; z < g_migongmap[x][y]; z++) {
                var cube_rendering = new Cube();
                if (g_migongmap[x][y] === 0) {
                    cube_rendering.textureNum = 0;
                    cube_rendering.matrix.translate(y - 4, z - 0.75, x - 4);
                    cube_rendering.drawCubeFast();
                } else if (g_migongmap[x][y] === 2) {
                    cube_rendering.textureNum = 2;
                    cube_rendering.matrix.translate(y - 4, z - 0.75, x - 4);
                    cube_rendering.drawCubeFast();
                } else if (g_migongmap[x][y] > 2 && g_migongmap[x][y] < 7) {
                    cube_rendering.textureNum = 0;
                    cube_rendering.matrix.translate(y - 4, z - 0.75, x - 4);
                    cube_rendering.drawCubeFast();
                } else if (g_migongmap[x][y] >= 7) {
                    cube_rendering.color = [1, 1, 1, 1];
                    cube_rendering.matrix.translate(y - 4, z - 0.75, x - 4);
                    cube_rendering.drawCubeFast();
                }
            }
        }
    }
}


function initEventHandlers(canvas) {
   let isDragging = false;
   let lastX = -1, lastY = -1;

   canvas.addEventListener('mousedown', (ev) => {
       isDragging = true;
       lastX = ev.clientX;
       lastY = ev.clientY;
   });

   canvas.addEventListener('mouseup', () => {
       isDragging = false;
   });

   canvas.addEventListener('mousemove', (ev) => {
       if (!isDragging) return;

       let dx = ev.clientX - lastX;
       let dy = ev.clientY - lastY;

       lastX = ev.clientX;
       lastY = ev.clientY;

       const sensitivity = 0.3; 

       g_yaw += dx * sensitivity;
       g_pitch -= dy * sensitivity;

       
       g_pitch = Math.max(-89, Math.min(89, g_pitch));

       
       const radYaw = g_yaw * Math.PI / 180;
       const radPitch = g_pitch * Math.PI / 180;

       const dirX = Math.cos(radPitch) * Math.cos(radYaw);
       const dirY = Math.sin(radPitch);
       const dirZ = Math.cos(radPitch) * Math.sin(radYaw);

       const eye = g_camera.eye;
       g_camera.at = new Vector3([
           eye.elements[0] + dirX,
           eye.elements[1] + dirY,
           eye.elements[2] + dirZ
       ]);

       renderAllShapes();
   });
}

function tryPlaceBlock() {
   const dir = g_camera.at.sub(g_camera.eye).normalize();
   const targetX = g_camera.eye.elements[0] + dir.elements[0];
   const targetZ = g_camera.eye.elements[2] + dir.elements[2];

   const col = Math.floor(targetX + 16);
   const row = Math.floor(targetZ + 16);

   if (row >= 0 && row < 32 && col >= 0 && col < 32 && g_map[row][col] < 4) {
       g_map[row][col] += 1;
   }

   renderAllShapes();
}

function tryRemoveBlock() {
   const dir = g_camera.at.sub(g_camera.eye).normalize();
   const targetX = g_camera.eye.elements[0] + dir.elements[0];
   const targetZ = g_camera.eye.elements[2] + dir.elements[2];

   const col = Math.floor(targetX + 16);
   const row = Math.floor(targetZ + 16);

   if (row >= 0 && row < 32 && col >= 0 && col < 32 && g_map[row][col] > 0) {
       g_map[row][col] -= 1;
   }

   renderAllShapes();
}
