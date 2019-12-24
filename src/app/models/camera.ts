import {SceneObject} from './scene-object';

export class Camera extends SceneObject {
  angle: number;
  frontScreen: number;
  backScreen: number;
  screenWidth: number;
  screenHeight: number;
  window: number[];

  constructor(angle: number, screenWidth: number, screenHeight: number, frontScreen: number, backScreen: number) {
    super();
    this.angle = angle;
    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;
    this.frontScreen = frontScreen;
    this.backScreen = backScreen;
    const k = screenHeight / screenWidth;
    this.window = [frontScreen * Math.tan(angle / 2) * 2, frontScreen * Math.tan(angle / 2) * 2 * k];
    // console.log(this.window);
  }

  applyCam(vec: number[]): number[] {
    const res = [];

    res.push(Math.round(vec[0] * this.frontScreen / vec[2] / this.window[0] * this.screenWidth));
    res.push(Math.round(vec[1] * this.frontScreen / vec[2] / this.window[1] * this.screenHeight));
    res.push(1 / vec[2]);
    res.push(1);

    return res;
  }

  unapplyCam(vec: number[]): number[] {
    const res = [];

    res.push(vec[0] / this.frontScreen * vec[2] * this.window[0] / this.screenWidth);
    res.push(vec[1] / this.frontScreen * vec[2] * this.window[1] / this.screenHeight);
    res.push(1 / vec[2]);
    res.push(1);

    return res;
  }
}
