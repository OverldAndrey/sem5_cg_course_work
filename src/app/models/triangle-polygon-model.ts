import {BaseDrawable} from './base-drawable';
import {PolygonTriangle} from './polygon-triangle';
import {Point} from './polygon';
import {TexMap} from './tex-map';

export class TrianglePolygonModel extends BaseDrawable {
  triangles: PolygonTriangle[] = [];
  points: Point[] = [];

  constructor() {
    super();
  }

  addTriangle(p1: Point, p2: Point, p3: Point, color?: string | TexMap, direct = 1) {
    const i1 = this.points.indexOf(p1);
    const i2 = this.points.indexOf(p2);
    const i3 = this.points.indexOf(p3);

    if (i1 !== -1) { p1 = this.points[i1]; }
    if (i2 !== -1) { p2 = this.points[i2]; }
    if (i3 !== -1) { p3 = this.points[i3]; }

    this.triangles.push(new PolygonTriangle(p1, p2, p3, color, direct));
  }
}
