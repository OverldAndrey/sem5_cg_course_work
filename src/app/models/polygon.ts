import {BaseDrawable} from './base-drawable';
import {TexMap} from './tex-map';

export type Point = number[];
export type Edge = number[];

export class Polygon extends BaseDrawable {
  edges: Edge[] = [];
  points: Point[] = [];
  color: string | TexMap = '#000000';

  constructor(color?: string | TexMap) {
    super();
    if (color) {
      this.color = color;
    }
  }

  addEdge(p1: Point, p2: Point) {
    let i1 = this.points.indexOf(p1);
    let i2 = this.points.indexOf(p2);

    if (i1 === -1) { i1 = this.points.length; this.points.push(p1); }
    if (i2 === -1) { i2 = this.points.length; this.points.push(p2); }

    this.edges.push([i1, i2]);
  }

  resetEdges() {
    this.points = [];
    this.edges = [];
  }
}
