import {Point, Polygon} from './polygon';
import {TexMap} from './tex-map';

export class PolygonTriangle extends Polygon {
  direct: number;
  color: string | TexMap;
  nvector: number[];
  point_nvecs: number[][];

  constructor(p1: Point, p2: Point, p3: Point, color?: string | TexMap, direct = 1) {
    super(color);
    this.points.push(p1, p2, p3);
    this.edges.push([0, 1], [1, 2], [2, 0]);
    this.direct = direct;

    this.nvector = [0, 0, 0, 1];
    this.nvector[0] = ((p2[1] - p1[1]) * (p3[2] - p1[2]) - (p3[1] - p1[1]) * (p2[2] - p1[2])) * this.direct;
    this.nvector[1] = (-(p2[0] - p1[0]) * (p3[2] - p1[2]) + (p3[0] - p1[0]) * (p2[2] - p1[2])) * this.direct;
    this.nvector[2] = ((p2[0] - p1[0]) * (p3[1] - p1[1]) - (p3[0] - p1[0]) * (p2[1] - p1[1])) * this.direct;
    this.point_nvecs = [];
    this.point_nvecs.push(this.nvector, this.nvector, this.nvector);
  }

  addEdge(p1: number[], p2: number[]) { }
  resetEdges() { }

  setSphericNVecs(r: number) {
    const sx = -this.direct; // Math.sign(this.nvector[0] * this.direct);
    const sy = -this.direct; // Math.sign(this.nvector[1] * this.direct);
    const sz = -this.direct; // Math.sign(this.nvector[2] * this.direct);
    this.point_nvecs[0] =
      [this.points[0][0] / r * sx, this.points[0][1] / r * sx, this.points[0][2] / r * sx, 1];
    this.point_nvecs[1] =
      [this.points[1][0] / r * sy, this.points[1][1] / r * sy, this.points[1][2] / r * sy, 1];
    this.point_nvecs[2] =
      [this.points[2][0] / r * sz, this.points[2][1] / r * sz, this.points[2][2] / r * sz, 1];
    if (this.point_nvecs[0][2] === 0 || this.point_nvecs[1][2] === 0 || this.point_nvecs[2][2] === 0) {
      console.log(this.points, this.point_nvecs);
    }
  }
}
