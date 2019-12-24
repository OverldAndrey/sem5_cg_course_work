import {SceneObject} from './scene-object';

export class BaseDrawable extends SceneObject {

  constructor() {
    super();
    this.isDrawable = true;
  }

}
