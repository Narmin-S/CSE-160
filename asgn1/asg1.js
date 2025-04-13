// Valentina Serrano
// 04-12-2025
//asg1.js


// Vertex shader program
var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    uniform float u_Size;
    void main() {
        gl_Position = a_Position;
        gl_PointSize = u_Size;
    }
`; 

// Fragment shader program
var FSHADER_SOURCE = `
    precision mediump float;
    uniform vec4 u_FragColor;
    void main() {
        gl_FragColor = u_FragColor;
    }
`;

//Global variables
let canvas, gl;
let a_Position;
let u_FragColor;
let u_Size;
let shapesList = [];

//default brush settings
let g_defaultColor = [1.0, 1.0, 1.0, 1.0];
let g_defaultSize = 5.0;
let g_CurrShape = 'square';

function main() {
  // Retrieve <canvas> element
    canvas = document.getElementById('webgl');
    gl = getWebGLContext(canvas);
    
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }

    // Get the storage location of a_Position
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');

    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');

    u_Size = gl.getUniformLocation(gl.program, 'u_Size');

    canvas.onmousedown = (ev) => handleClick(ev);
    canvas.onmousemove = (ev) => {if (ev.buttons === 1) handleClick(ev); };

    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    clearCanvas();
}

function clearCanvas() {
    shapesList = [];
    gl.clear(gl.COLOR_BUFFER_BIT);
}

function handleClick(ev) {
    const [x, y] = convertCoordinates(ev);
    const color = getCurrColor();
    const size = getCurrSize();
    const segments = getCurrSegments();

    shapesList.push({type: g_CurrShape, x, y, color, size, segments});
    renderAllShapes();
}

function renderAllShapes() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    for (const shape of shapesList) {
        gl.uniform4f(u_FragColor, ...shape.color);
        gl.uniform1f(u_Size, shape.size||10);

        if (shape.type === 'triangle') {
            drawTri(shape);
        } else if (shape.type === 'circle') {
            drawCircle(shape);
        } else if (shape.type === 'square') {
            drawSquare(shape);
        } else if (shape.type === 'customTriangle') {
            drawCustomTriangle(shape);
        }
    }
}

function drawTri(shape) {
    const [x, y] = [shape.x, shape.y];
    const size = shape.size / 100; // Scale size for triangle vertices
  
    const vertices = new Float32Array([
      x, y + size,
      x - size, y - size,
      x + size, y - size
    ]);
  
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  
function drawCircle(shape) {
    const [x, y] = [shape.x, shape.y];
    const r = shape.size / 200; // scale radius
    const n = shape.segments;

    const vertices = [x, y]; // Center of the circle
    for (let i = 0; i <= n; i++) {
        const angle = (i * 2 * Math.PI) / n;
        vertices.push(x + r * Math.cos(angle));
        vertices.push(y + r * Math.sin(angle));
    }

    const vertexData = new Float32Array(vertices);
    const buffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, n + 2);
}

function drawSquare(shape) {
    const [x, y] = [shape.x, shape.y];
    const halfSize = shape.size / 200; // Scale size for square vertices

    // Define the vertices of the square (centered at x, y)
    const vertices = new Float32Array([
        x - halfSize, y + halfSize, // Top-left
        x - halfSize, y - halfSize, // Bottom-left
        x + halfSize, y + halfSize, // Top-right
        x + halfSize, y - halfSize  // Bottom-right
    ]);

    // Create a buffer and bind the vertices
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Pass the vertex data to the shader
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    // Pass the color and size to the shader
    gl.uniform4f(u_FragColor, ...shape.color);
    gl.uniform1f(u_Size, shape.size);

    // Draw the square as two triangles
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}


function convertCoordinates(ev) {
    const rect = canvas.getBoundingClientRect();
    const x = ((ev.clientX - rect.left) - canvas.width / 2) / (canvas.width / 2);
    const y = (canvas.height / 2 - (ev.clientY - rect.top)) / (canvas.height / 2);
    return [x, y];
}

function getCurrColor() {
    const r = parseFloat(document.getElementById('redSlider').value);
    const g = parseFloat(document.getElementById('greenSlider').value);
    const b = parseFloat(document.getElementById('blueSlider').value);
    return [r, g, b, 1.0];
}

function getCurrSize() {
    return parseFloat(document.getElementById('sizeSlider').value);
}

function getCurrSegments() {
    return parseInt(document.getElementById('segmentSlider').value);
}

function setShapeType(type) {
    g_CurrShape = type;
}

function addSpirit() {
    const spiritTri = [
      // head
        { verts: [0.0, 0.2, -0.1, 0.4, 0.1, 0.4], color: [1.0, 1.0, 0.0, 1.0] }, // Top petal
        
        //wings/eyes
        { verts: [0.0, 0.2, -0.2, 0.3, -0.1, 0.2], color: [1.0,10.0, 1.0, 1.0] },
        { verts: [0.0, 0.2, -0.2, 0.5, -0.1, 0.2], color: [1.0,10.0, 1.0, 1.0] },
        { verts: [0.0, 0.2, -0.2, 0.8, -0.1, 0.2], color: [1.0,10.0, 1.0, 1.0] },
        
        { verts: [0.0, 0.2, 0.2, 0.3, 0.1, 0.2], color: [1.0,10.0, 1.0, 1.0] },
        { verts: [0.0, 0.2, 0.2, 0.5, 0.1, 0.2], color: [1.0,10.0, 1.0, 1.0] },
        { verts: [0.0, 0.2, 0.2, 0.8, 0.1, 0.2], color: [1.0,10.0, 1.0, 1.0] },

        { verts: [0.0, 0.2, -0.2, 0.2, -0.1, 0.0], color: [0.72, 0.53, 0.04, 1.0] },
        { verts: [0.0, 0.2, 0.2, 0.2, 0.1, 0.0], color: [0.72, 0.53, 0.04, 1.0] },
        { verts: [0.0, 0.2, -0.1, 0.0, 0.0, -0.2], color: [0.6, 0.45, 0.03, 1.0] },
        { verts: [0.0, 0.2, 0.1, 0.0, 0.0, -0.2], color: [0.6, 0.45, 0.03, 1.0] },

        { verts: [0.0, -0.2, 0.2, -0.3, 0.1, -0.2], color: [0.9, 0.6, 0.3, 1.0] },
        { verts: [0.0, -0.2, -0.2, -0.3, -0.1, -0.2], color: [0.9, 0.6, 0.3, 1.0] },
        
        // Vase
        { verts: [-0.05, -0.2, -0.05, -0.6, 0.05, -0.6], color: [0.45, 0.81, 0.94, 1.0] }, 
        { verts: [-0.05, -0.2, 0.05, -0.6, 0.05, -0.2], color: [0.45, 0.81, 0.94, 1.0] },

        
        { verts: [-0.05, -0.4, -0.2, -0.5, -0.05, -0.6], color: [0.27, 0.41, 0.47, 1.0] },
        { verts: [0.05, -0.4, 0.2, -0.5, 0.05, -0.6], color: [0.27, 0.41, 0.47, 1.0] },

        //detailing with color
        { verts: [0.05, -0.4, -0.2, -0.5, 0.05, -0.55], color: [1.0,0.0, 1.0, 0.2] },
        { verts: [0.05, -0.4, 0.2, -0.5, -0.05, -0.55], color: [1.0,0.0, 1.0, 1.0] },
        { verts: [0.0, -0.5, -0.2, -0.5, 0.05, -0.55], color: [1.0,1.0, 0, 0] },
        { verts: [0.0, -0.45, 0.2, -0.5, -0.1, -0.55], color: [0,0.0, 1.0, 1.0] }
    ];
  
    for (const tri of spiritTri) {
      shapesList.push({
        type: 'customTriangle',
        vertices: tri.verts,
        color: tri.color
      });
    }
  
    renderAllShapes();
  }
  
  function drawCustomTriangle(shape) {
    const vertices = new Float32Array(shape.vertices);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }