import { Injectable } from '@angular/core';
import {Scene} from '../../models/scene';
import {CubeRendererService} from './cube/cube-renderer.service';
import {CubeModel} from '../../models/cube-model';
import {ObjectPosition} from '../../models/object-position';
import {TrianglePolygonModelRendererService} from './trianglePoly/triangle-polygon-model-renderer.service';
import {BaseDrawable} from '../../models/base-drawable';

@Injectable({
  providedIn: 'root'
})
export class RendererService {

  i = 0.01;
  constructor(
    private cubeRenderer: CubeRendererService,
    private trianglePolygonModelRenderer: TrianglePolygonModelRendererService
  ) { }

  render(scene: Scene, canvas: any) {
    // canvas.fill(0);
    // canvas.box(30);
    // canvas.translate(100,100,-100);
    // canvas.rotate(canvas.PI/4, [1,1,0]);
    // canvas.box(30);
    // this.translate(scene.sceneObjects[0], this.i * 10, this.i * 10, this.i * 10);
    // this.rotate(scene.sceneObjects[0], this.i, this.i, this.i);
    const drawable = scene.sceneObjects.filter(e => e.object.isDrawable);
    canvas.ambuentLighting = scene.ambuentLight;
    for (let o of drawable) {
      this.trianglePolygonModelRenderer.render(o, scene.camera, canvas);
    }
  }

  translate(obj: ObjectPosition, dx: number, dy: number, dz: number) {
    obj.translate = {dx, dy, dz};
  }

  rotate(obj: ObjectPosition, ax: number, ay: number, az: number) {
    obj.rotate = {ax, ay, az};
  }
}
