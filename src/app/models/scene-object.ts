import {AbstractSceneObject} from './abstract-scene-object';

export class SceneObject implements AbstractSceneObject {
  static objectCount = 0;
  isDrawable = false;
  isComposite = false;
  readonly id: number;

  constructor() {
    this.id = ++SceneObject.objectCount;
  }

  getId(): number {
    return this.id;
  }
}
