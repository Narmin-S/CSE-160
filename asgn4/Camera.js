class Camera {
    constructor() {
      this.eye = new Vector3([8, 1.2, 5]);
      this.at = new Vector3([8, 0, 100]);
      this.up = new Vector3([0, 1, 0]);
    }
  
    forward() {
      const dir = this.at.sub(this.eye).normalize();
      const targetX = this.eye.elements[0] + dir.elements[0] * 0.2;
      const targetZ = this.eye.elements[2] + dir.elements[2] * 0.2;
  
      const height = this._getTerrainHeight(targetX, targetZ);
      if (height !== null) {
        const y = height + 1.0;
        this.eye = new Vector3([targetX, y, targetZ]);
        this.at = new Vector3([
          targetX + dir.elements[0],
          y,
          targetZ + dir.elements[2]
        ]);
      }
    }
  
    backward() {
      const dir = this.at.sub(this.eye).normalize();
      const targetX = this.eye.elements[0] - dir.elements[0] * 0.2;
      const targetZ = this.eye.elements[2] - dir.elements[2] * 0.2;
  
      const height = this._getTerrainHeight(targetX, targetZ);
      if (height !== null) {
        const y = height + 1.0;
        this.eye = new Vector3([targetX, y, targetZ]);
        this.at = new Vector3([
          targetX + dir.elements[0],
          y,
          targetZ + dir.elements[2]
        ]);
      }
    }
  
    left() {
      const dir = this.at.sub(this.eye).normalize();
      const strafe = Vector3.cross(new Vector3([0, 1, 0]), dir).normalize();
      const targetX = this.eye.elements[0] + strafe.elements[0] * 0.2;
      const targetZ = this.eye.elements[2] + strafe.elements[2] * 0.2;
  
      const height = this._getTerrainHeight(targetX, targetZ);
      if (height !== null) {
        const y = height + 1.0;
        this.eye = new Vector3([targetX, y, targetZ]);
        this.at = new Vector3([
          targetX + dir.elements[0],
          y,
          targetZ + dir.elements[2]
        ]);
      }
    }
  
    right() {
      const dir = this.at.sub(this.eye).normalize();
      const strafe = Vector3.cross(dir, new Vector3([0, 1, 0])).normalize();
      const targetX = this.eye.elements[0] + strafe.elements[0] * 0.2;
      const targetZ = this.eye.elements[2] + strafe.elements[2] * 0.2;
  
      const height = this._getTerrainHeight(targetX, targetZ);
      if (height !== null) {
        const y = height + 1.0;
        this.eye = new Vector3([targetX, y, targetZ]);
        this.at = new Vector3([
          targetX + dir.elements[0],
          y,
          targetZ + dir.elements[2]
        ]);
      }
    }
  
    rotateRight() {
      const f = this.at.sub(this.eye);
      const rotationMatrix = new Matrix4();
      rotationMatrix.setRotate(-5, ...this.up.elements);
      const f_prime = rotationMatrix.multiplyVector3(f);
      this.at = f_prime.add(this.eye);
    }
  
    rotateLeft() {
      const f = this.at.sub(this.eye);
      const rotationMatrix = new Matrix4();
      rotationMatrix.setRotate(5, ...this.up.elements);
      const f_prime = rotationMatrix.multiplyVector3(f);
      this.at = f_prime.add(this.eye);
    }
  
    upward() {
      this.eye.elements[1] += 1;
      this.at.elements[1] += 1;
    }
  
    downward() {
      this.eye.elements[1] -= 1;
      this.at.elements[1] -= 1;
    }
  
    _getTerrainHeight(x, z) {
      const col = Math.floor(x + 16);
      const row = Math.floor(z + 16);
  
      if (
        row < 0 || row >= terrainMap.length ||
        col < 0 || col >= terrainMap[0].length
      ) {
        return null;
      }
  
      return terrainMap[row][col] * 1.0;
    }
  }
  