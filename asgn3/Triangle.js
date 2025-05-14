class Triangle{
    constructor() {
        this.type = 'triangle';
        this.position = [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];

        this.buffer = null;

    }

    render(){
        var xy = this.position;
        var rgba = this.color;

        if(this.buffer === null){
            this.buffer = gl.createBuffer();
            if (!this.buffer){
                console.log("Fail to create the buffer object");
                return -1;
            }
        }

        gl.disableVertexAttribArray(a_Position);
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.uniform1f(u_Size, size);
        drawT( [xy[0], xy[1], xy[0]+.05*size/10, xy[1]-.1*size/10, xy[0]-.05*size/10, xy[1]-.1*size/10]);
    }
}


function drawT(vertices){
    var n = vertices.length/3;

    var vertexBuffer = gl.createBuffer();
    if(!vertexBuffer){
        console.log('Failed to create the buffer object');
        return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
    gl.drawArrays(gl.TRIANGLES, 0, n);
}


function drawTriangle3D(vertices){

    let n = vertices.length/3;

    var vertexBuffer = gl.createBuffer();
    if(!vertexBuffer){
        console.log('Failed to create the buffer object');
        return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
    gl.drawArrays(gl.TRIANGLES, 0, n);
}


var g_vertexBufferCube = null;

function initTriangle3D(vertices){
    g_vertexBufferCube = gl.createBuffer();
    if(!g_vertexBufferCube){
        console.log('Failed to create the buffer object');
        return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, g_vertexBufferCube);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
    console.log("use")
}

var g_uvBuffer = null;
function initUV(uv){
    g_uvBuffer = gl.createBuffer();
    if(!g_uvBuffer){
        console.log('Failed to create the buffer object');
        return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, g_uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_UV);
}

function drawTriangle3DUV(vertices, uv){
    let n = vertices.length/3;

    if(g_vertexBufferCube == null){

        g_vertexBufferCube = gl.createBuffer();
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, g_vertexBufferCube);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    if(g_uvBuffer == null){
        initUV(uv);
    }
    gl.drawArrays(gl.TRIANGLES, 0, n);
}