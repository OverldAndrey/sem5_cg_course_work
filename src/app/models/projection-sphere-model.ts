import {SphereModel} from './sphere-model';
import {TexMap} from './tex-map';
import {Projector} from './projector';
import {PolygonTriangle} from './polygon-triangle';

export class ProjectionSphereModel extends SphereModel {
  projectors: Projector[];

  constructor(radius = 100, approximationRate = 1) {
    super(radius, approximationRate);
    this.projectors = [];
    for (let tr of this.triangles) {
      tr.direct *= -1;
    }
  }

  reproject() {
    this.points = [];
    this.triangles = [];
    this.approximate(this.approximationRate * 6);
    for (let p of this.projectors) {
      this.project(p);
    }
    for (let tr of this.triangles) {
      tr.direct *= -1;
    }
  }

  setImage(prn: number, img) {
    const pr = this.projectors[prn];
    pr.image = img;
    for (let t of this.triangles) {
      if (t.color instanceof TexMap && t.color.projectorId === prn) {
        t.color.image = img;
      }
    }
  }

  addProjector(projector: Projector) {
    this.projectors.push(projector);
  }

  project(projector: Projector) {
    const l1 = this.triangles.length;
    const id = this.projectors.indexOf(projector);

    for (let i = 0; i < l1; i++) {
      const tr = this.triangles[i];
      if (tr.color instanceof TexMap) {
        continue;
      }
      // if (tr.nvector[2] * projector.direction[2] +
      //   tr.nvector[0] * projector.direction[0] +
      //   tr.nvector[1] * projector.direction[1] >= 0) {
      //   continue;
      // }

      const projected = [];
      for (let point of tr.points) {
        projected.push(projector.applyProjector(point));
      }

      const e = 10 ** -3;
      if (projected[0][0] - -projector.window[0] / 2 <= e &&
        projected[1][0] - -projector.window[0] / 2 <= e &&
        projected[2][0] - -projector.window[0] / 2 <= e ||
        projected[0][0] - projector.window[0] / 2 >= -e &&
        projected[1][0] - projector.window[0] / 2 >= -e &&
        projected[2][0] - projector.window[0] / 2 >= -e ||
        projected[0][1] - -projector.window[1] / 2 <= e &&
        projected[1][1] - -projector.window[1] / 2 <= e &&
        projected[2][1] - -projector.window[1] / 2 <= e ||
        projected[0][1] - projector.window[1] / 2 >= -e &&
        projected[1][1] - projector.window[1] / 2 >= -e &&
        projected[2][1] - projector.window[1] / 2 >= -e ||
        projected[0][2] < 0 || projected[1][2] < 0 || projected[2][2] < 0
      ) {
        if (tr.color === '#F00000') {
          tr.color = this.color;
        }
        continue;
      }

      let {0: p1, 1: p2, 2: p3} = projected;

      this.verticalCut(i, p1, p2, p3, tr, projector);
    }

    const l2 = this.triangles.length;
    for (let i = 0; i < l2; i++) {
      const tr = this.triangles[i];
      if (tr.color instanceof TexMap) {
        continue;
      }
      // if (tr.nvector[2] * projector.direction[2] +
      //   tr.nvector[0] * projector.direction[0] +
      //   tr.nvector[1] * projector.direction[1] >= 0) {
      //   continue;
      // }

      const projected = [];
      for (let point of tr.points) {
        projected.push(projector.applyProjector(point));
      }

      const e = 10 ** -3;
      if (projected[0][0] - -projector.window[0] / 2 <= e &&
        projected[1][0] - -projector.window[0] / 2 <= e &&
        projected[2][0] - -projector.window[0] / 2 <= e ||
        projected[0][0] - projector.window[0] / 2 >= -e &&
        projected[1][0] - projector.window[0] / 2 >= -e &&
        projected[2][0] - projector.window[0] / 2 >= -e ||
        projected[0][1] - -projector.window[1] / 2 <= e &&
        projected[1][1] - -projector.window[1] / 2 <= e &&
        projected[2][1] - -projector.window[1] / 2 <= e ||
        projected[0][1] - projector.window[1] / 2 >= -e &&
        projected[1][1] - projector.window[1] / 2 >= -e &&
        projected[2][1] - projector.window[1] / 2 >= -e ||
        projected[0][2] < 0 || projected[1][2] < 0 || projected[2][2] < 0
      ) {
        if (tr.color === '#F00000') {
          tr.color = this.color;
        }
        continue;
      }

      let {0: p1, 1: p2, 2: p3} = projected;

      this.horizontalCut(i, p1, p2, p3, tr, projector);
    }

    if (!projector.image) { return; }

    const l3 = this.triangles.length;
    for (let i = 0; i < l3; i++) {
      const tr = this.triangles[i];
      if (tr.color instanceof TexMap) {
        continue;
      }
      tr.setSphericNVecs(this.radius);
      // if (tr.nvector[2] * projector.direction[2] +
      //   tr.nvector[0] * projector.direction[0] +
      //   tr.nvector[1] * projector.direction[1] >= 0) {
      //   continue;
      // }

      const projected = [];
      for (let point of tr.points) {
        projected.push(projector.applyProjector(point));
      }

      const e = 10 ** -3;
      if (projected[0][0] - -projector.window[0] / 2 <= e &&
        projected[1][0] - -projector.window[0] / 2 <= e &&
        projected[2][0] - -projector.window[0] / 2 <= e ||
        projected[0][0] - projector.window[0] / 2 >= -e &&
        projected[1][0] - projector.window[0] / 2 >= -e &&
        projected[2][0] - projector.window[0] / 2 >= -e ||
        projected[0][1] - -projector.window[1] / 2 <= e &&
        projected[1][1] - -projector.window[1] / 2 <= e &&
        projected[2][1] - -projector.window[1] / 2 <= e ||
        projected[0][1] - projector.window[1] / 2 >= -e &&
        projected[1][1] - projector.window[1] / 2 >= -e &&
        projected[2][1] - projector.window[1] / 2 >= -e ||
        projected[0][2] < 0 || projected[1][2] < 0 || projected[2][2] < 0
      ) {
        if (tr.color === '#F00000') {
          tr.color = this.color;
        }
        continue;
      }

      let {0: p1, 1: p2, 2: p3} = projected;

      if (p1[0] === p2[0] === p3[0] || p1[1] === p2[1] === p3[1]) {
        tr.color = '#00000000';
      }

      tr.color = new TexMap(
        projector.image,
        [(p1[0] + projector.window[0] / 2) / projector.window[0], (p1[1] + projector.window[1] / 2) / projector.window[1], 0, 1],
        [(p2[0] + projector.window[0] / 2) / projector.window[0], (p2[1] + projector.window[1] / 2) / projector.window[1], 0, 1],
        [(p3[0] + projector.window[0] / 2) / projector.window[0], (p3[1] + projector.window[1] / 2) / projector.window[1], 0, 1]
      );
      tr.color.projectorId = id;
    }
  }

  private vinterception(l1: number[][], l2: number[][]): number[] {
    const y = l1[0][1] + (l2[0][0] - l1[0][0]) * (l1[1][1] - l1[0][1]) / (l1[1][0] - l1[0][0]);
    const z = l1[0][2] + (l2[0][0] - l1[0][0]) * (l1[1][2] - l1[0][2]) / (l1[1][0] - l1[0][0]);
    return [
      l2[0][0],
      y,
      z,
      1
    ];
  }

  private hinterception(l1: number[][], l2: number[][]): number[] {
    const x = l1[0][0] + (l2[0][1] - l1[0][1]) * (l1[1][0] - l1[0][0]) / (l1[1][1] - l1[0][1]);
    const z = l1[0][2] + (l2[0][1] - l1[0][1]) * (l1[1][2] - l1[0][2]) / (l1[1][1] - l1[0][1]);
    return [
      x,
      l2[0][1],
      z,
      1
    ];
  }

  private verticalCut(i, p1, p2, p3, tr, projector) {
    if (1 // projected[0][1] > -projector.window[1] / 2 &&
    //   projected[1][1] > -projector.window[1] / 2 &&
    //   projected[2][1] > -projector.window[1] / 2 &&
    //   projected[0][1] < projector.window[1] / 2 &&
    //   projected[1][1] < projector.window[1] / 2 &&
    //   projected[2][1] < projector.window[1] / 2
    ) {
      const e = 10 ** -5;
      while (p1[0] > p2[0] || p1[0] > p3[0]) {
        const t = p2;
        p2 = p1;
        p1 = p3;
        p3 = t;
      }
      if (p1[0] - -projector.window[0] / 2 <= -e) {
        this.leftCut(i, p1, p2, p3, tr, projector);
      } else {
      while (p1[0] < p2[0] || p1[0] < p3[0]) {
        const t = p2;
        p2 = p1;
        p1 = p3;
        p3 = t;
      }
      if (p1[0] - projector.window[0] / 2 >= e) {
        this.rightCut(i, p1, p2, p3, tr, projector);
      } else {
        tr.color = '#F00000';
      }
      }
    } else {
      tr.color = '#F00000';
    }
  }

  private horizontalCut(i, p1, p2, p3, tr, projector) {
    if (1 // p1[0] > -projector.window[0] / 2 &&
      // p2[0] > -projector.window[0] / 2 &&
      // p3[0] > -projector.window[0] / 2 &&
      // p1[0] < projector.window[0] / 2 &&
      // p2[0] < projector.window[0] / 2 &&
      // p3[0] < projector.window[0] / 2
    ) {
      const e = 10 ** -5;
      while (p1[1] > p2[1] || p1[1] > p3[1]) {
        const t = p2;
        p2 = p1;
        p1 = p3;
        p3 = t;
      }
      if (p1[1] - -projector.window[1] / 2 <= -e) {
        this.topCut(i, p1, p2, p3, tr, projector);
      } else {
        while (p1[1] < p2[1] || p1[1] < p3[1]) {
          const t = p2;
          p2 = p1;
          p1 = p3;
          p3 = t;
        }
        if (p1[1] - projector.window[1] / 2 >= e) {
          this.bottomCut(i, p1, p2, p3, tr, projector);
        } else {
          tr.color = '#F00000';
        }
      }
    } else {
      tr.color = '#F00000';
    }
  }

  private leftCut(i, p1, p2, p3, tr, projector: Projector) {
    if (p2[0] < -projector.window[0] / 2) {
      const np1 = this.vinterception(
        [p3, p1],
        [[-projector.window[0] / 2, -projector.window[1] / 2], [-projector.window[0] / 2, projector.window[1] / 2]]
      );
      const np2 = this.vinterception(
        [p3, p2],
        [[-projector.window[0] / 2, -projector.window[1] / 2], [-projector.window[0] / 2, projector.window[1] / 2]]
      );

      this.triangles[i] = new PolygonTriangle(
        projector.unapplyProjector(np1),
        projector.unapplyProjector(np2),
        projector.unapplyProjector(p3),
        '#F00000', tr.direct);
      this.addTriangle(
        projector.unapplyProjector(p1),
        projector.unapplyProjector(np2),
        projector.unapplyProjector(np1),
        this.color, tr.direct
      );
      this.addTriangle(
        projector.unapplyProjector(p1),
        projector.unapplyProjector(p2),
        projector.unapplyProjector(np2),
        this.color, tr.direct
      );
    } else if (p3[0] < -projector.window[0] / 2) {
      const np1 = this.vinterception(
        [p2, p1],
        [[-projector.window[0] / 2, -projector.window[1] / 2], [-projector.window[0] / 2, projector.window[1] / 2]]
      );
      const np2 = this.vinterception(
        [p2, p3],
        [[-projector.window[0] / 2, -projector.window[1] / 2], [-projector.window[0] / 2, projector.window[1] / 2]]
      );

      this.triangles[i] = new PolygonTriangle(
        projector.unapplyProjector(np1),
        projector.unapplyProjector(p2),
        projector.unapplyProjector(np2),
        '#F00000', tr.direct);
      this.addTriangle(
        projector.unapplyProjector(p1),
        projector.unapplyProjector(np1),
        projector.unapplyProjector(np2),
        this.color, tr.direct
      );
      this.addTriangle(
        projector.unapplyProjector(p1),
        projector.unapplyProjector(np2),
        projector.unapplyProjector(p3),
        this.color, tr.direct
      );
    } else {
      const np1 = this.vinterception(
        [p2, p1],
        [[-projector.window[0] / 2, -projector.window[1] / 2], [-projector.window[0] / 2, projector.window[1] / 2]]
      );
      const np2 = this.vinterception(
        [p3, p1],
        [[-projector.window[0] / 2, -projector.window[1] / 2], [-projector.window[0] / 2, projector.window[1] / 2]]
      );

      this.triangles[i] = new PolygonTriangle(
        projector.unapplyProjector(p1),
        projector.unapplyProjector(np1),
        projector.unapplyProjector(np2),
        this.color, tr.direct);
      this.addTriangle(
        projector.unapplyProjector(np2),
        projector.unapplyProjector(np1),
        projector.unapplyProjector(p2),
        '#F00000', tr.direct
      );
      this.addTriangle(
        projector.unapplyProjector(np2),
        projector.unapplyProjector(p2),
        projector.unapplyProjector(p3),
        '#F00000', tr.direct
      );
    }
  }

  private rightCut(i, p1, p2, p3, tr, projector) {
    if (p2[0] > projector.window[0] / 2) {
      const np1 = this.vinterception(
        [p3, p1],
        [[projector.window[0] / 2, -projector.window[1] / 2], [projector.window[0] / 2, projector.window[1] / 2]]
      );
      const np2 = this.vinterception(
        [p3, p2],
        [[projector.window[0] / 2, -projector.window[1] / 2], [projector.window[0] / 2, projector.window[1] / 2]]
      );

      this.triangles[i] = new PolygonTriangle(
        projector.unapplyProjector(np1),
        projector.unapplyProjector(np2),
        projector.unapplyProjector(p3),
        '#F00000', tr.direct);
      this.addTriangle(
        projector.unapplyProjector(p1),
        projector.unapplyProjector(np2),
        projector.unapplyProjector(np1),
        this.color, tr.direct
      );
      this.addTriangle(
        projector.unapplyProjector(p1),
        projector.unapplyProjector(p2),
        projector.unapplyProjector(np2),
        this.color, tr.direct
      );
    } else if (p3[0] > projector.window[0] / 2) {
      const np1 = this.vinterception(
        [p2, p1],
        [[projector.window[0] / 2, -projector.window[1] / 2], [projector.window[0] / 2, projector.window[1] / 2]]
      );
      const np2 = this.vinterception(
        [p2, p3],
        [[projector.window[0] / 2, -projector.window[1] / 2], [projector.window[0] / 2, projector.window[1] / 2]]
      );

      this.triangles[i] = new PolygonTriangle(
        projector.unapplyProjector(np1),
        projector.unapplyProjector(p2),
        projector.unapplyProjector(np2),
        '#F00000', tr.direct);
      this.addTriangle(
        projector.unapplyProjector(p1),
        projector.unapplyProjector(np1),
        projector.unapplyProjector(np2),
        this.color, tr.direct
      );
      this.addTriangle(
        projector.unapplyProjector(p1),
        projector.unapplyProjector(np2),
        projector.unapplyProjector(p3),
        this.color, tr.direct
      );
    } else {
      const np1 = this.vinterception(
        [p2, p1],
        [[projector.window[0] / 2, -projector.window[1] / 2], [projector.window[0] / 2, projector.window[1] / 2]]
      );
      const np2 = this.vinterception(
        [p3, p1],
        [[projector.window[0] / 2, -projector.window[1] / 2], [projector.window[0] / 2, projector.window[1] / 2]]
      );

      this.triangles[i] = new PolygonTriangle(
        projector.unapplyProjector(p1),
        projector.unapplyProjector(np1),
        projector.unapplyProjector(np2),
        this.color, tr.direct);
      this.addTriangle(
        projector.unapplyProjector(np2),
        projector.unapplyProjector(np1),
        projector.unapplyProjector(p2),
        '#F00000', tr.direct
      );
      this.addTriangle(
        projector.unapplyProjector(np2),
        projector.unapplyProjector(p2),
        projector.unapplyProjector(p3),
        '#F00000', tr.direct
      );
    }
  }

  private bottomCut(i, p1, p2, p3, tr, projector) {
    if (p2[1] > projector.window[1] / 2) {
      const np1 = this.hinterception(
        [p3, p1],
        [[-projector.window[0] / 2, projector.window[1] / 2], [projector.window[0] / 2, projector.window[1] / 2]]
      );
      const np2 = this.hinterception(
        [p3, p2],
        [[-projector.window[0] / 2, projector.window[1] / 2], [projector.window[0] / 2, projector.window[1] / 2]]
      );

      this.triangles[i] = new PolygonTriangle(
        projector.unapplyProjector(np1),
        projector.unapplyProjector(np2),
        projector.unapplyProjector(p3),
        '#F00000', tr.direct);
      this.addTriangle(
        projector.unapplyProjector(p1),
        projector.unapplyProjector(np2),
        projector.unapplyProjector(np1),
        this.color, tr.direct
      );
      this.addTriangle(
        projector.unapplyProjector(p1),
        projector.unapplyProjector(p2),
        projector.unapplyProjector(np2),
        this.color, tr.direct
      );
    } else if (p3[1] > projector.window[1] / 2) {
      const np1 = this.hinterception(
        [p2, p1],
        [[-projector.window[0] / 2, projector.window[1] / 2], [projector.window[0] / 2, projector.window[1] / 2]]
      );
      const np2 = this.hinterception(
        [p2, p3],
        [[-projector.window[0] / 2, projector.window[1] / 2], [projector.window[0] / 2, projector.window[1] / 2]]
      );

      this.triangles[i] = new PolygonTriangle(
        projector.unapplyProjector(np1),
        projector.unapplyProjector(p2),
        projector.unapplyProjector(np2),
        '#F00000', tr.direct);
      this.addTriangle(
        projector.unapplyProjector(p1),
        projector.unapplyProjector(np1),
        projector.unapplyProjector(np2),
        this.color, tr.direct
      );
      this.addTriangle(
        projector.unapplyProjector(p1),
        projector.unapplyProjector(np2),
        projector.unapplyProjector(p3),
        this.color, tr.direct
      );
    } else {
      const np1 = this.hinterception(
        [p2, p1],
        [[-projector.window[0] / 2, projector.window[1] / 2], [projector.window[0] / 2, projector.window[1] / 2]]
      );
      const np2 = this.hinterception(
        [p3, p1],
        [[-projector.window[0] / 2, projector.window[1] / 2], [projector.window[0] / 2, projector.window[1] / 2]]
      );

      this.triangles[i] = new PolygonTriangle(
        projector.unapplyProjector(p1),
        projector.unapplyProjector(np1),
        projector.unapplyProjector(np2),
        this.color, tr.direct);
      this.addTriangle(
        projector.unapplyProjector(np2),
        projector.unapplyProjector(np1),
        projector.unapplyProjector(p2),
        '#F00000', tr.direct
      );
      this.addTriangle(
        projector.unapplyProjector(np2),
        projector.unapplyProjector(p2),
        projector.unapplyProjector(p3),
        '#F00000', tr.direct
      );
    }
  }

  private topCut(i, p1, p2, p3, tr, projector) {
    if (p2[1] < -projector.window[1] / 2) {
      const np1 = this.hinterception(
        [p3, p1],
        [[-projector.window[0] / 2, -projector.window[1] / 2], [projector.window[0] / 2, -projector.window[1] / 2]]
      );
      const np2 = this.hinterception(
        [p3, p2],
        [[-projector.window[0] / 2, -projector.window[1] / 2], [projector.window[0] / 2, -projector.window[1] / 2]]
      );

      this.triangles[i] = new PolygonTriangle(
        projector.unapplyProjector(np1),
        projector.unapplyProjector(np2),
        projector.unapplyProjector(p3),
        '#F00000', tr.direct);
      this.addTriangle(
        projector.unapplyProjector(p1),
        projector.unapplyProjector(np2),
        projector.unapplyProjector(np1),
        this.color, tr.direct
      );
      this.addTriangle(
        projector.unapplyProjector(p1),
        projector.unapplyProjector(p2),
        projector.unapplyProjector(np2),
        this.color, tr.direct
      );
    } else if (p3[1] < -projector.window[1] / 2) {
      const np1 = this.hinterception(
        [p2, p1],
        [[-projector.window[0] / 2, -projector.window[1] / 2], [projector.window[0] / 2, -projector.window[1] / 2]]
      );
      const np2 = this.hinterception(
        [p2, p3],
        [[-projector.window[0] / 2, -projector.window[1] / 2], [projector.window[0] / 2, -projector.window[1] / 2]]
      );

      this.triangles[i] = new PolygonTriangle(
        projector.unapplyProjector(np1),
        projector.unapplyProjector(p2),
        projector.unapplyProjector(np2),
        '#F00000', tr.direct);
      this.addTriangle(
        projector.unapplyProjector(p1),
        projector.unapplyProjector(np1),
        projector.unapplyProjector(np2),
        this.color, tr.direct
      );
      this.addTriangle(
        projector.unapplyProjector(p1),
        projector.unapplyProjector(np2),
        projector.unapplyProjector(p3),
        this.color, tr.direct
      );
    } else {
      const np1 = this.hinterception(
        [p2, p1],
        [[-projector.window[0] / 2, -projector.window[1] / 2], [projector.window[0] / 2, -projector.window[1] / 2]]
      );
      const np2 = this.hinterception(
        [p3, p1],
        [[-projector.window[0] / 2, -projector.window[1] / 2], [projector.window[0] / 2, -projector.window[1] / 2]]
      );

      this.triangles[i] = new PolygonTriangle(
        projector.unapplyProjector(p1),
        projector.unapplyProjector(np1),
        projector.unapplyProjector(np2),
        this.color, tr.direct);
      this.addTriangle(
        projector.unapplyProjector(np2),
        projector.unapplyProjector(np1),
        projector.unapplyProjector(p2),
        '#F00000', tr.direct
      );
      this.addTriangle(
        projector.unapplyProjector(np2),
        projector.unapplyProjector(p2),
        projector.unapplyProjector(p3),
        '#F00000', tr.direct
      );
    }
  }
}
