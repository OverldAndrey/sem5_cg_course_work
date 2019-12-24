import {Matrix} from './matrix';

export class Projector {
  xangle: number;
  yangle: number;
  direction = [1, 0, 0, 1];
  private projScreen = 100;
  window: number[];
  private matrix: Matrix;
  private reversedMatrix: Matrix;
  private img;

  constructor(xangle = Math.PI / 2, yangle = 9 / 16 * Math.PI / 2, direction = [1, 0, 0, 1]) {
    this.xangle = xangle;
    this.yangle = yangle;
    this.direction = direction;
    const dirlen = Math.sqrt(direction[0] ** 2 + direction[1] ** 2 + direction[2] ** 2);
    const xydirlen = Math.sqrt(direction[0] ** 2 + direction[1] ** 2);
    const ax = -Math.acos(direction[2] / dirlen);
    const az = (xydirlen < 0.00001) ? 0 : -Math.acos(direction[1] / xydirlen) * Math.sign(direction[0] ? direction[0] : 1);
    console.log(az);
    this.matrix = new Matrix();
    this.matrix.multiplyByMatrix(new Matrix([
      [1, 0, 0, 0],
      [0, Math.cos(ax), Math.sin(ax), 0],
      [0, -Math.sin(ax), Math.cos(ax), 0],
      [0, 0, 0, 1]
    ]));
    this.matrix.multiplyByMatrix(new Matrix([
      [Math.cos(az), Math.sin(az), 0, 0],
      [-Math.sin(az), Math.cos(az), 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1]
    ]));
    this.reversedMatrix = new Matrix(this.matrix.matrix);
    this.reversedMatrix.reverse();
    this.window = [this.projScreen * Math.tan(xangle / 2) * 2,  this.projScreen * Math.tan(yangle / 2) * 2];
  }

  applyProjector(vec: number[]): number[] {
    const res = [];
    vec = this.reversedMatrix.multiplyVector(vec);

    res.push(vec[0] * this.projScreen / vec[2]);
    res.push(vec[1] * this.projScreen / vec[2]);
    // res.push(vec[1]);
    res.push(1 / vec[2]);
    res.push(1);

    return res;
  }

  unapplyProjector(vec: number[]): number[] {
    let res = [];

    res.push(vec[0] / this.projScreen / vec[2]);
    res.push(vec[1] / this.projScreen / vec[2]);
    // res.push(vec[1]);
    res.push(1 / vec[2]);
    res.push(1);
    res = this.matrix.multiplyVector(res);

    return res;
  }

  get image() {
    return this.img;
  }

  set image(img) {
    this.img = img;
  }
}
