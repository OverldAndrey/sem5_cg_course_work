import {SceneObject} from './scene-object';
import {Matrix} from './matrix';

export class ObjectPosition {
  protected x = 0;
  protected y = 0;
  protected z = 0;

  protected obj: SceneObject;

  protected transformMatrix: Matrix;
  protected reversedMatrix: Matrix;

  constructor(object: SceneObject) {
    this.obj = object;
    this.transformMatrix = new Matrix();
    this.reversedMatrix = new Matrix();
    this.reversedMatrix.reverse();
  }

  get position() {
    return {x: this.x, y: this.y, z: this.z};
  }

  get transform() {
    return this.transformMatrix;
  }

  get reversed() {
    return this.reversedMatrix;
  }

  set positionX(x: number) {
    this.x = x;
  }

  set positionY(y: number) {
    this.y = y;
  }

  set positionZ(z: number) {
    this.z = z;
  }

  set translate(move: {dx: number, dy: number, dz: number}) {
    this.transformMatrix.multiplyByMatrix(new Matrix([
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [move.dx, move.dy, move.dz, 1]
    ]));
    this.reversedMatrix = new Matrix(this.transform.getMatrix);
    this.reversedMatrix.reverse();
  }

  set scale(scale: {kx: number, ky: number, kz: number}) {
    this.transformMatrix.multiplyByMatrix(new Matrix([
      [scale.kx, 0, 0, 0],
      [0, scale.ky, 0, 0],
      [0, 0, scale.kz, 0],
      [0, 0, 0, 1]
    ]));
    this.reversedMatrix = new Matrix(this.transform.getMatrix);
    this.reversedMatrix.reverse();
  }

  set rotate(rotate: {ax: number, ay: number, az: number}) {
   //  this.transform.rotate = rotate;
    this.transformMatrix.multiplyByMatrix(new Matrix([
      [1, 0, 0, 0],
      [0, Math.cos(rotate.ax), Math.sin(rotate.ax), 0],
      [0, -Math.sin(rotate.ax), Math.cos(rotate.ax), 0],
      [0, 0, 0, 1]
    ]));
    this.transformMatrix.multiplyByMatrix(new Matrix([
      [Math.cos(rotate.ay), 0, -Math.sin(rotate.ay), 0],
      [0, 1, 0, 0],
      [Math.sin(rotate.ay), 0, Math.cos(rotate.ay), 0],
      [0, 0, 0, 1]
    ]));
    this.transformMatrix.multiplyByMatrix(new Matrix([
      [Math.cos(rotate.az), Math.sin(rotate.az), 0, 0],
      [-Math.sin(rotate.az), Math.cos(rotate.az), 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1]
    ]));
    this.reversedMatrix = new Matrix(this.transform.getMatrix);
    this.reversedMatrix.reverse();
  }

  set transf(m: Matrix) {
    this.transformMatrix.multiplyByMatrix(m);
    this.reversedMatrix = new Matrix(this.transform.getMatrix);
    this.reversedMatrix.reverse();
  }

  get object() {
    return this.obj;
  }

  applyTransform(vec: number[]) {
    const tr = this.transform.multiplyVector(vec);
    return [tr[0] + this.x, tr[1] + this.y, tr[2] + this.z, tr[3]];
  }

  applyReverse(vec: number[]) {
    const tr = [vec[0] - this.x, vec[1] - this.y, vec[2] - this.z, vec[3]];
    return this.reversed.multiplyVector(tr);
  }
}
