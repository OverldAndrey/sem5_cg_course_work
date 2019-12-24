import {Camera} from './camera';
import {BaseDrawable} from './base-drawable';
import {ObjectPosition} from './object-position';

export class Scene {
  protected cameras: ObjectPosition[] = [];
  protected drawables: ObjectPosition[] = [];
  protected currentCamera: ObjectPosition;
  protected ambuentLightDirection = [-1 / Math.sqrt(3), -1 / Math.sqrt(3), -1 / Math.sqrt(3), 1];

  constructor(screenWidth?: number, screenHeight?: number) {
    const cam = new Camera(Math.PI / 3, screenWidth, screenHeight, 20, 2000);
    this.addCamera(cam);
    this.currentCamera = this.cameras[0];
  }

  addSceneObject(bd: BaseDrawable) {
    const pos = new ObjectPosition(bd);
    this.drawables.push(pos);
  }

  addCamera(c: Camera) {
    const pos = new ObjectPosition(c);
    this.cameras.push(pos);
  }

  setCamera() {
    // const res = this.currentCamera.next();
    // if (res.done) {
    //   this.currentCamera = this.cameras[Symbol.iterator]();
    // }
  }

  get sceneObjects() {
    return this.drawables;
  }

  get camera() {
    return this.currentCamera;
  }

  get ambuentLight() {
    return this.ambuentLightDirection;
  }
}
