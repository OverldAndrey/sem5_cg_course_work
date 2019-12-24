import { Injectable } from '@angular/core';
import {CubeModel} from '../../../models/cube-model';
import {ObjectPosition} from '../../../models/object-position';
import {Camera} from '../../../models/camera';

@Injectable({
  providedIn: 'root'
})
export class CubeRendererService {

  constructor() { }

  render(cube: ObjectPosition, camera: ObjectPosition, canvas: any) {
    const model = cube.object as CubeModel;
    const cam = camera.object as Camera;

    for (let polygon of model.triangles) {
      const projected = [];
      canvas.stroke(polygon.color);

      for (let point of polygon.points) {
        projected.push(cam.applyCam(camera.applyTransform(cube.applyTransform(point))));
      }

      for (let edge of polygon.edges) {
        const p1 = projected[edge[0]];
        const p2 = projected[edge[1]];
        canvas.line(
          p1[0] + canvas.canvasWidth / 2, p1[1] + canvas.canvasHeight / 2,
          p2[0] + canvas.canvasWidth / 2, p2[1] + canvas.canvasHeight / 2
        );
        // canvas.line(...p1, ...p2);
      }
    }
  }
}
