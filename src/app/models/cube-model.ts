import {BaseDrawable} from './base-drawable';
import {PolygonTriangle} from './polygon-triangle';
import {Point} from './polygon';
import {TrianglePolygonModel} from './triangle-polygon-model';

export class CubeModel extends TrianglePolygonModel {

  constructor(size?: number) {
    super();
    if (size) {
      this.addTriangle([0, 0, 0, 1], [size, 0, 0, 1], [size, 0, size, 1], '#700000');
      this.addTriangle([0, 0, 0, 1], [0, 0, size, 1], [size, 0, size, 1], '#770000', -1);
      this.addTriangle([0, 0, 0, 1], [0, size, 0, 1], [0, size, size, 1], '#F70000', -1);
      this.addTriangle([0, 0, 0, 1], [0, 0, size, 1], [0, size, size, 1], '#FF0000');
      this.addTriangle([0, 0, 0, 1], [0, size, 0, 1], [size, 0, 0, 1], '#007000');
      this.addTriangle([size, size, 0, 1], [0, size, 0, 1], [size, 0, 0, 1], '#007700', -1);
      this.addTriangle([0, 0, size, 1], [0, size, size, 1], [size, 0, size, 1], '#00F700', -1);
      this.addTriangle([size, size, size, 1], [0, size, size, 1], [size, 0, size, 1], '#00FF00');
      this.addTriangle([size, 0, 0, 1], [size, size, 0, 1], [size, size, size, 1], '#000070');
      this.addTriangle([size, 0, 0, 1], [size, 0, size, 1], [size, size, size, 1], '#000077', -1);
      this.addTriangle([0, size, 0, 1], [size, size, 0, 1], [size, size, size, 1], '#0000F0', -1);
      this.addTriangle([0, size, 0, 1], [0, size, size, 1], [size, size, size, 1], '#0000FF');
    }
  }
}
