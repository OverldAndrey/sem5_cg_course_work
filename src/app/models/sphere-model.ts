import {TrianglePolygonModel} from './triangle-polygon-model';
import {Point} from './polygon';

export class SphereModel extends TrianglePolygonModel {
  radius: number;
  color = '#123456';
  approximationRate: number;

  constructor(radius = 100, approximationRate = 1) {
    super();
    this.radius = radius;
    this.approximationRate = approximationRate;
    this.approximate(6 * approximationRate);
  }

  approximate(rate) {
    const pointSets = [];
    const r = this.radius;
    const {sin, cos} = Math;

    for (let i = 0; i < rate; i++) {
      const alpha = 2 * Math.PI / rate * i;
      const pointSet = [];
      for (let j = 1; j < rate; j++) {
        const beta = Math.PI / rate * j;
        pointSet.push([r * sin(beta) * cos(alpha), r * sin(beta) * sin(alpha), r * cos(beta), 1]);
      }
      pointSets.push(pointSet);
    }

    for (let i = 0; i < rate - 1; i++) {
      this.addTriangle([0, 0, r, 1], pointSets[i][0], pointSets[i + 1][0], this.color);
    }
    this.addTriangle([0, 0, r, 1], pointSets[rate - 1][0], pointSets[0][0], this.color);
    // for (let i = 0; i < rate - 1; i++) {
    //   this.addTriangle([0, 0, -r, 1], pointSets[i][rate - 2], pointSets[i + 1][rate - 2], this.color, -1);
    // }
    // this.addTriangle([0, 0, -r, 1], pointSets[rate - 1][rate - 2], pointSets[0][rate - 2], this.color, -1);
    for (let i = rate - 2; i >= 0; i--) {
      this.addTriangle([0, 0, -r, 1], pointSets[i + 1][rate - 2], pointSets[i][rate - 2], this.color);
    }
    this.addTriangle([0, 0, -r, 1], pointSets[0][rate - 2], pointSets[rate - 1][rate - 2], this.color);

    for (let i = 0; i < rate - 2; i++) {
      for (let j = 0; j < rate - 1; j++) {
        this.addTriangle(pointSets[j][i], pointSets[j][i + 1], pointSets[j + 1][i], this.color);
        this.addTriangle(pointSets[j + 1][i + 1], pointSets[j + 1][i], pointSets[j][i + 1], this.color);
      }
      this.addTriangle(pointSets[rate - 1][i], pointSets[rate - 1][i + 1], pointSets[0][i], this.color);
      this.addTriangle(pointSets[0][i + 1], pointSets[0][i], pointSets[rate - 1][i + 1], this.color);
    }

    for (let t of this.triangles) {
      t.setSphericNVecs(this.radius);
    }
  }
}
