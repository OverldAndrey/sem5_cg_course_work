import { Injectable } from '@angular/core';
import {ObjectPosition} from '../../../models/object-position';
import {Camera} from '../../../models/camera';
import {PolygonRendererService} from '../polygon-renderer.service';
import {TrianglePolygonModel} from '../../../models/triangle-polygon-model';

@Injectable({
  providedIn: 'root'
})
export class TrianglePolygonModelRendererService {

  constructor(private polygonRenderer: PolygonRendererService) { }

  render(cube: ObjectPosition, camera: ObjectPosition, canvas: any) {
    const model = cube.object as TrianglePolygonModel;
    const cam = camera.object as Camera;

    for (let polygon of model.triangles) {
      const transformed = [];
      const projected = [];
      // canvas.stroke(polygon.color);

      for (let point of polygon.points) {
        // projected.push(cam.applyCam(camera.applyTransform(cube.applyTransform(point))));
        const tr = cube.applyTransform(point);
        transformed.push(tr);
      }
      for (let point of transformed) {
        projected.push(cam.applyCam(camera.applyReverse(point)));
      }

      // for (let edge of polygon.edges) {
      //   // const p1 = projected[edge[0]];
      //   // const p2 = projected[edge[1]];
      //   // canvas.line(
      //   //   p1[0] + canvas.canvasWidth / 2, p1[1] + canvas.canvasHeight / 2,
      //   //   p2[0] + canvas.canvasWidth / 2, p2[1] + canvas.canvasHeight / 2
      //   // );
      //   // canvas.line(...p1, ...p2);
      // }
      const p1 = projected[polygon.edges[0][0]];
      const p2 = projected[polygon.edges[1][0]];
      const p3 = projected[polygon.edges[2][0]];
      // console.log(1 / p1[2], 1 / p2[2], 1 / p3[2]);
      if (1 / p1[2] < cam.frontScreen || 1 / p2[2] < cam.frontScreen || 1 / p3[2] < cam.frontScreen) { continue; }

      const NVector = [0, 0, 0, 1];
      NVector[0] = ((p2[1] - p1[1]) * (1 / p3[2] - 1 / p1[2]) - (p3[1] - p1[1]) * (1 / p2[2] - 1 / p1[2])) * polygon.direct;
      NVector[1] = (-(p2[0] - p1[0]) * (1 / p3[2] - 1 / p1[2]) + (p3[0] - p1[0]) * (1 / p2[2] - 1 / p1[2])) * polygon.direct;
      NVector[2] = ((p2[0] - p1[0]) * (p3[1] - p1[1]) - (p3[0] - p1[0]) * (p2[1] - p1[1])) * polygon.direct;
      if (NVector[2] >= 0) { continue; }
      if (
        p1.filter((e, i) => Math.abs(p2[i] - e) === 0).length === 3 ||
        p2.filter((e, i) => Math.abs(p3[i] - e) === 0).length === 3 ||
        p3.filter((e, i) => Math.abs(p1[i] - e) === 0).length === 3
      ) {
        return;
      }

      this.polygonRenderer.render(canvas, p1, p2, p3, polygon.point_nvecs, polygon.color);
    }
  }
}
