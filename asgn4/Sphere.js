class Sphere {
    constructor(segments = 20) {
        this.type = 'sphere';
        this.segments = segments;  // number of segments both vertically and horizontally
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
        this.textureNum = -2;
        
        this.initVertices();
    }

    initVertices() {
    this.vertices = [];
    this.uvs = [];
    this.normals = [];

    let dTheta = Math.PI / this.segments;
    let dPhi = 2 * Math.PI / this.segments;

    for (let lat = 0; lat < this.segments; lat++) {
        let theta = lat * dTheta;
        let nextTheta = (lat + 1) * dTheta;

        for (let long = 0; long < this.segments; long++) {
            let phi = long * dPhi;
            let nextPhi = (long + 1) * dPhi;

            let p1 = [Math.sin(theta) * Math.cos(phi), Math.cos(theta), Math.sin(theta) * Math.sin(phi)];
            let p2 = [Math.sin(nextTheta) * Math.cos(phi), Math.cos(nextTheta), Math.sin(nextTheta) * Math.sin(phi)];
            let p3 = [Math.sin(theta) * Math.cos(nextPhi), Math.cos(theta), Math.sin(theta) * Math.sin(nextPhi)];
            let p4 = [Math.sin(nextTheta) * Math.cos(nextPhi), Math.cos(nextTheta), Math.sin(nextTheta) * Math.sin(nextPhi)];

            // Two triangles per quad
            this.vertices.push(...p1, ...p2, ...p4);
            this.vertices.push(...p1, ...p4, ...p3);

            // UVs (dummy, you can improve this)
            for (let i = 0; i < 6; i++) {
                this.uvs.push(0, 0);
            }

            // Normals (same as position for unit sphere)
            this.normals.push(...p1, ...p2, ...p4);
            this.normals.push(...p1, ...p4, ...p3);
        }
    }
}

render() {
    let rgba = this.color;
    gl.uniform1i(u_whichTexture, this.textureNum);
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    drawTriangle3DUVNormal(this.vertices, this.uvs, this.normals);
}

} 