import { Injectable } from '@angular/core';
import {TexMap} from '../../models/tex-map';

@Injectable({
  providedIn: 'root'
})
export class PolygonRendererService {

  constructor() { }

  private renderString(canvas: any, p1: number[], p2: number[], p3: number[], nvecs: number[][], color: string) {
    const lightRay = canvas.ambuentLighting;
    let {0: n1, 1: n2, 2: n3} = nvecs;

    if (p2[1] < p1[1]) {
      const t = [p1[0], p1[1], p1[2], p1[3]];
      p1 = [p2[0], p2[1], p2[2], p2[3]];
      p2 = t;
      const nt = [n1[0], n1[1], n1[2], n1[3]];
      n1 = [n2[0], n2[1], n2[2], n2[3]];
      n2 = nt;
    }
    if (p3[1] < p1[1]) {
      const t = [p1[0], p1[1], p1[2], p1[3]];
      p1 = [p3[0], p3[1], p3[2], p3[3]];
      p3 = t;
      const nt = [n1[0], n1[1], n1[2], n1[3]];
      n1 = [n3[0], n3[1], n3[2], n3[3]];
      n3 = nt;
    }
    if (p3[1] < p2[1]) {
      const t = [p2[0], p2[1], p2[2], p2[3]];
      p2 = [p3[0], p3[1], p3[2], p3[3]];
      p3 = t;
      const nt = [n2[0], n2[1], n2[2], n2[3]];
      n2 = [n3[0], n3[1], n3[2], n3[3]];
      n3 = nt;
    }
    const l1 = (lightRay[0] * n1[0] + lightRay[1] * n1[1] + lightRay[2] * n1[2]);
    const l2 = (lightRay[0] * n2[0] + lightRay[1] * n2[1] + lightRay[2] * n2[2]);
    const l3 = (lightRay[0] * n3[0] + lightRay[1] * n3[1] + lightRay[2] * n3[2]);

    const ym = p3[1] - p1[1];

    const c = [
        parseInt(color.slice(1, 3), 16),
        parseInt(color.slice(3, 5), 16),
        parseInt(color.slice(5, 7), 16),
        color.length > 7 ? parseInt(color.slice(7, 9), 16) : 255
      ];
    const carr = [...c];
    carr[0] = Math.round(c[0] - 50 * l1);
    carr[1] = Math.round(c[1] - 50 * l1);
    carr[2] = Math.round(c[2] - 50 * l1);
    carr[0] = (carr[0] > 255) ? 255 : (carr[0] < 0) ? 0 : carr[0];
    carr[1] = (carr[1] > 255) ? 255 : (carr[2] < 0) ? 0 : carr[1];
    carr[2] = (carr[2] > 255) ? 255 : (carr[2] < 0) ? 0 : carr[2];

    const {round: rnd} = Math;

    for (let i = 0; i <= ym; i++) {
      if (i + p1[1] < -canvas.canvasHeight / 2 || i + p1[1] >= canvas.canvasHeight / 2) {
        continue;
      }

      const secondHalf = i > p2[1] - p1[1] || p2[1] === p1[1];
      const yms = secondHalf ? p3[1] - p2[1] : p2[1] - p1[1];
      const v1 = i / ym;
      const v2 = (i - (secondHalf ? p2[1] - p1[1] : 0)) / yms;

      let pt1 = [rnd(p1[0] * (1 - v1) + p3[0] * v1), rnd(p1[1] * (1 - v1) + p3[1] * v1), p1[2] * (1 - v1) + p3[2] * v1, 1];
      let pt2 = secondHalf ?
        [rnd(p2[0] * (1 - v2) + p3[0] * v2), rnd(p2[1] * (1 - v2) + p3[1] * v2), p2[2] * (1 - v2) + p3[2] * v2, 1] :
        [rnd(p1[0] * (1 - v2) + p2[0] * v2), rnd(p1[1] * (1 - v2) + p2[1] * v2), p1[2] * (1 - v2) + p2[2] * v2, 1];

      let lt1 = l1 * (1 - v1) + l3 * v1;
      let lt2 = secondHalf ? l2 * (1 - v2) + l3 * v2 : l1 * (1 - v2) + l2 * v2;

      if (pt1[0] > pt2[0]) {
        const t = [pt1[0], pt1[1], pt1[2], pt1[3]];
        pt1 = [pt2[0], pt2[1], pt2[2], pt2[3]];
        pt2 = t;
        const tl = lt1;
        lt1 = lt2;
        lt2 = tl;
      }

      for (let j = pt1[0]; j < pt2[0]; j++) {
        if (j < -canvas.canvasWidth / 2 || j > canvas.canvasWidth / 2) {
          continue;
        }

        const u = pt1[0] === pt2[0] ? 1 : (j - pt1[0]) / (pt2[0] - pt1[0]);
        const pt = [rnd(pt1[0] * (1 - u) + pt2[0] * u), rnd(pt1[1] * (1 - u) + pt2[1] * u), pt1[2] * (1 - u) + pt2[2] * u, 1];
        const l = lt1 * (1 - u) + lt2 * u;

        const index = Math.round((canvas.canvasWidth * (pt[1] + canvas.canvasHeight / 2) + (pt[0] + canvas.canvasWidth / 2)) * 4);

        if (canvas.zbuf[pt[1] + canvas.canvasHeight / 2][pt[0] + canvas.canvasWidth / 2] < pt[2]) {
          canvas.zbuf[pt[1] + canvas.canvasHeight / 2][pt[0] + canvas.canvasWidth / 2] = pt[2];

          carr[0] = Math.round(c[0] - 50 * l);
          carr[1] = Math.round(c[1] - 50 * l);
          carr[2] = Math.round(c[2] - 50 * l);

          canvas.pixels[index] = (carr[0] > 255) ? 255 : (carr[0] < 0) ? 0 : carr[0];
          canvas.pixels[index + 1] = (carr[1] > 255) ? 255 : (carr[2] < 0) ? 0 : carr[1];
          canvas.pixels[index + 2] = (carr[2] > 255) ? 255 : (carr[2] < 0) ? 0 : carr[2];
          canvas.pixels[index + 3] = carr[3];
        }
      }
    }
  }

  // renderTexmap(canvas: any, p1: number[], p2: number[], p3: number[], nvecs: number[][], color: TexMap) {
  //   color.projectedVertices = [0, 1, 2];
  //   const lightRay = canvas.ambuentLighting;
  //   let {0: n1, 1: n2, 2: n3} = nvecs;
  //
  //   if (p2[1] < p1[1]) {
  //     const t = [p1[0], p1[1], p1[2], p1[3]];
  //     p1 = [p2[0], p2[1], p2[2], p2[3]];
  //     p2 = t;
  //     const nt = [n1[0], n1[1], n1[2], n1[3]];
  //     n1 = [n2[0], n2[1], n2[2], n2[3]];
  //     n2 = nt;
  //     const tt = color.projectedVertices[0];
  //     color.projectedVertices[0] = color.projectedVertices[1];
  //     color.projectedVertices[1] = tt;
  //   }
  //   if (p3[1] < p1[1]) {
  //     const t = [p1[0], p1[1], p1[2], p1[3]];
  //     p1 = [p3[0], p3[1], p3[2], p3[3]];
  //     p3 = t;
  //     const nt = [n1[0], n1[1], n1[2], n1[3]];
  //     n1 = [n3[0], n3[1], n3[2], n3[3]];
  //     n3 = nt;
  //     const tt = color.projectedVertices[0];
  //     color.projectedVertices[0] = color.projectedVertices[2];
  //     color.projectedVertices[2] = tt;
  //   }
  //   if (p3[1] < p2[1]) {
  //     const t = [p2[0], p2[1], p2[2], p2[3]];
  //     p2 = [p3[0], p3[1], p3[2], p3[3]];
  //     p3 = t;
  //     const nt = [n2[0], n2[1], n2[2], n2[3]];
  //     n2 = [n3[0], n3[1], n3[2], n3[3]];
  //     n3 = nt;
  //     const tt = color.projectedVertices[2];
  //     color.projectedVertices[2] = color.projectedVertices[1];
  //     color.projectedVertices[1] = tt;
  //   }
  //   const l1 = (lightRay[0] * n1[0] + lightRay[1] * n1[1] + lightRay[2] * n1[2]);
  //   const l2 = (lightRay[0] * n2[0] + lightRay[1] * n2[1] + lightRay[2] * n2[2]);
  //   const l3 = (lightRay[0] * n3[0] + lightRay[1] * n3[1] + lightRay[2] * n3[2]);
  //   // console.log(p1, p2, p3);
  //
  //   const x01 = this.interpolate(p1[1], p1[0], p2[1] + 1, p2[0]);
  //   const x12 = this.interpolate(p2[1], p2[0], p3[1] + 1, p3[0]);
  //   const x02 = this.interpolate(p1[1], p1[0], p3[1] + 1, p3[0]);
  //   const z01 = this.interpolate(p1[1], p1[2], p2[1] + 1, p2[2]);
  //   const z12 = this.interpolate(p2[1], p2[2], p3[1] + 1, p3[2]);
  //   const z02 = this.interpolate(p1[1], p1[2], p3[1] + 1, p3[2]);
  //   const l01 = this.interpolate(p1[1], l1, p2[1] + 1, l2);
  //   const l12 = this.interpolate(p2[1], l2, p3[1] + 1, l3);
  //   const l02 = this.interpolate(p1[1], l1, p3[1] + 1, l3);
  //   // const x01 = this.interpolate(Math.round(p1[1]), p1[0], Math.round(p2[1]), p2[0]);
  //   // const x12 = this.interpolate(Math.round(p2[1]), p2[0], Math.round(p3[1]), p3[0]);
  //   // const x02 = this.interpolate(Math.round(p1[1]), p1[0], Math.round(p3[1]), p3[0]);
  //   // const z01 = this.interpolate(Math.round(p1[1]), p1[2], Math.round(p2[1]), p2[2]);
  //   // const z12 = this.interpolate(Math.round(p2[1]), p2[2], Math.round(p3[1]), p3[2]);
  //   // const z02 = this.interpolate(Math.round(p1[1]), p1[2], Math.round(p3[1]), p3[2]);
  //
  //   x01.pop();
  //   // if (x01.length + x12.length > x02.length) {
  //   //   x12.shift();
  //   // }
  //   const x012 = x01.concat(x12);
  //   z01.pop();
  //   // if (z01.length + z12.length > z02.length) {
  //   //   z12.shift();
  //   // }
  //   const z012 = z01.concat(z12);
  //   l01.pop();
  //   // if (l01.length + l12.length > l02.length) {
  //   //   l12.shift();
  //   // }
  //   const l012 = l01.concat(l12);
  //   const yp = x01.length + p1[1];
  //   // console.log(x012.length, x02.length);
  //
  //   const mx = Math.floor(x012.length / 2);
  //   // const ymd = Math.round(p2[1] - p1[1]) + Math.round(p1[1]);
  //   let xleft: any[];
  //   let xright: any[];
  //   let zleft: any[];
  //   let zright: any[];
  //   let lleft: any[];
  //   let lright: any[];
  //   let pmd;
  //   if (x02[mx] < x012[mx]) {
  //     xleft = x02;
  //     xright = x012;
  //     zleft = z02;
  //     zright = z012;
  //     lleft = l02;
  //     lright = l012;
  //     pmd = 'r';
  //   } else {
  //     xleft = x012;
  //     xright = x02;
  //     zleft = z012;
  //     zright = z02;
  //     lleft = l012;
  //     lright = l02;
  //     pmd = 'l';
  //   }
  //
  //   const carr = [0, 0, 0, 255];
  //   carr[0] = Math.round(0 - 50 * l1);
  //   carr[1] = Math.round(0 - 50 * l1);
  //   carr[2] = Math.round(0 - 50 * l1);
  //   carr[0] = (carr[0] > 255) ? 255 : (carr[0] < 0) ? 0 : carr[0];
  //   carr[1] = (carr[1] > 255) ? 255 : (carr[2] < 0) ? 0 : carr[1];
  //   carr[2] = (carr[2] > 255) ? 255 : (carr[2] < 0) ? 0 : carr[2];
  //   const y1 = Math.round(p1[1]);
  //   let yk = p1[1];
  //
  //   for (let y = y1; y < Math.round(p3[1]) + 1; y++, yk += 1) {
  //     if (y < -canvas.canvasHeight / 2 || y >= canvas.canvasHeight / 2) {
  //       continue;
  //     }
  //     // console.log(y);
  //     const zsegment = this.interpolate(
  //       Math.round(xleft[y - y1]) - 1,
  //       zleft[y - y1],
  //       xright[y - y1],
  //       zright[y - y1]
  //     );
  //     const light = this.interpolate(
  //       xleft[y - y1] - 1,
  //       lleft[y - y1],
  //       xright[y - y1],
  //       lright[y - y1]
  //     );
  //
  //     let v1;
  //     let v2;
  //     // if ((y < yp) ? (yp - y1) < 4 : (Math.round(p3[1]) + 1 - yp) < 4) {
  //     //   v1 = (y <= yp) ?
  //     //     (pmd === 'l') ? (xleft[y - y1] - xleft[0]) / (xleft[yp - y1] - xleft[0]) :
  //     //       (xright[y - y1] - xright[0]) / (xright[yp - y1] - xright[0]) :
  //     //     (pmd === 'l') ? (xleft[y - y1] - xleft[yp - y1]) / (xleft[Math.round(p3[1]) - y1] - xleft[yp - y1]) :
  //     //       (xright[y - y1] - xright[yp - y1]) / (xright[Math.round(p3[1]) - y1] - xright[yp - y1]);
  //     //   v2 = (pmd === 'r') ? (xleft[y - y1] - xleft[0]) / (xleft[Math.round(p3[1]) - y1] - xleft[0]) :
  //     //     (xright[y - y1] - xright[0]) / (xright[Math.round(p3[1]) - y1] - xright[0]);
  //     //   // console.log(v1, v2);
  //     // } else {
  //     v1 = (y < yp) ? (y - y1) / (yp - y1) :
  //       (y === yp) ? 0 : (y - yp) / (Math.round(p3[1]) - yp);
  //     v2 = (y - y1) / (Math.round(p3[1]) - y1);
  //     // }
  //     const ln1 = (yk < yp) ?
  //       [color.projectedVertices[0], color.projectedVertices[1]] :
  //       [color.projectedVertices[1], color.projectedVertices[2]];
  //     const ln2 = [color.projectedVertices[0], color.projectedVertices[2]];
  //     const z1 = (yk < yp) ? [1 / p1[2], 1 / p2[2]] : [1 / p2[2], 1 / p3[2]];
  //     const z2 = [1 / p1[2], 1 / p3[2]];
  //     if (pmd === 'l') {
  //       color.setLineFunc(ln1, ln2, v1, v2, z1, z2);
  //     } else {
  //       color.setLineFunc(ln2, ln1, v2, v1, z2, z1);
  //     }
  //     const x1 = Math.round(xleft[y - y1]);
  //     let xk = xleft[y - y1];
  //
  //     for (let x = x1; x < xright[y - y1] + 1; x++, xk += 1) {
  //       if (x < -canvas.canvasWidth / 2 || x > canvas.canvasWidth / 2) {
  //         continue;
  //       }
  //       const index = Math.round((canvas.canvasWidth * (y + canvas.canvasHeight / 2) + (x + canvas.canvasWidth / 2)) * 4);
  //       const zi = x + canvas.canvasWidth / 2 - Math.round(canvas.canvasWidth / 2) - x1;
  //       if (canvas.zbuf[y + canvas.canvasHeight / 2][x + canvas.canvasWidth / 2] < zsegment[zi]) {
  //
  //         // const u = (y < yp) ? (x - x1) / (xright[y - y1] - x1) : (x - x1) / (xright[y - 1 - y1] - x1);
  //         const u = (xleft[y - y1] === xright[y - y1]) ? 1 : (x - xleft[y - y1]) / (xright[y - y1] - xleft[y - y1]);
  //         const c = color.getLinePixel(u, 1 / zleft[y - y1], 1 / zright[y - y1]);
  //         carr[0] = Math.round(c[0] - 50 * light[zi]);
  //         carr[1] = Math.round(c[1] - 50 * light[zi]);
  //         carr[2] = Math.round(c[2] - 50 * light[zi]);
  //
  //         canvas.pixels[index] = (carr[0] > 255) ? 255 : (carr[0] < 0) ? 0 : carr[0];
  //         canvas.pixels[index + 1] = (carr[1] > 255) ? 255 : (carr[2] < 0) ? 0 : carr[1];
  //         canvas.pixels[index + 2] = (carr[2] > 255) ? 255 : (carr[2] < 0) ? 0 : carr[2];
  //         canvas.pixels[index + 3] = carr[3];
  //         canvas.zbuf[y + canvas.canvasHeight / 2][x + canvas.canvasWidth / 2] =
  //           zsegment[zi];
  //       }
  //     }
  //   }
  // }

  private renderTexmap(canvas: any, p1: number[], p2: number[], p3: number[], nvecs: number[][], color: TexMap) {
    // if (
    //   p1.filter((e, i) => Math.abs(p2[i] - e) === 0).length === 3 ||
    //   p2.filter((e, i) => Math.abs(p3[i] - e) === 0).length === 3 ||
    //   p3.filter((e, i) => Math.abs(p1[i] - e) === 0).length === 3
    // ) {
    //   return;
    // }
    color.projectedVertices = [0, 1, 2];
    const lightRay = canvas.ambuentLighting;
    let {0: n1, 1: n2, 2: n3} = nvecs;

    if (p2[1] < p1[1]) {
      const t = [p1[0], p1[1], p1[2], p1[3]];
      p1 = [p2[0], p2[1], p2[2], p2[3]];
      p2 = t;
      const nt = [n1[0], n1[1], n1[2], n1[3]];
      n1 = [n2[0], n2[1], n2[2], n2[3]];
      n2 = nt;
      const tt = color.projectedVertices[0];
      color.projectedVertices[0] = color.projectedVertices[1];
      color.projectedVertices[1] = tt;
    }
    if (p3[1] < p1[1]) {
      const t = [p1[0], p1[1], p1[2], p1[3]];
      p1 = [p3[0], p3[1], p3[2], p3[3]];
      p3 = t;
      const nt = [n1[0], n1[1], n1[2], n1[3]];
      n1 = [n3[0], n3[1], n3[2], n3[3]];
      n3 = nt;
      const tt = color.projectedVertices[0];
      color.projectedVertices[0] = color.projectedVertices[2];
      color.projectedVertices[2] = tt;
    }
    if (p3[1] < p2[1]) {
      const t = [p2[0], p2[1], p2[2], p2[3]];
      p2 = [p3[0], p3[1], p3[2], p3[3]];
      p3 = t;
      const nt = [n2[0], n2[1], n2[2], n2[3]];
      n2 = [n3[0], n3[1], n3[2], n3[3]];
      n3 = nt;
      const tt = color.projectedVertices[2];
      color.projectedVertices[2] = color.projectedVertices[1];
      color.projectedVertices[1] = tt;
    }
    const l1 = (lightRay[0] * n1[0] + lightRay[1] * n1[1] + lightRay[2] * n1[2]);
    const l2 = (lightRay[0] * n2[0] + lightRay[1] * n2[1] + lightRay[2] * n2[2]);
    const l3 = (lightRay[0] * n3[0] + lightRay[1] * n3[1] + lightRay[2] * n3[2]);

    const {round: rnd} = Math;

    const ym = p3[1] - p1[1];

    const uv1 = color.vertices[color.projectedVertices[0]];
    const uv2 = color.vertices[color.projectedVertices[1]];
    const uv3 = color.vertices[color.projectedVertices[2]];

    // const carr = [
    //   color.image.pixels[(rnd(uv1[0]) + rnd(uv1[1]) * color.image.width) * 4],
    //   color.image.pixels[(rnd(uv1[0]) + rnd(uv1[1]) * color.image.width) * 4 + 1],
    //   color.image.pixels[(rnd(uv1[0]) + rnd(uv1[1]) * color.image.width) * 4 + 2],
    //   255
    // ];
    // carr[0] = rnd(carr[0] - 50 * l1);
    // carr[1] = rnd(carr[1] - 50 * l1);
    // carr[2] = rnd(carr[2] - 50 * l1);
    // carr[0] = (carr[0] > 255) ? 255 : (carr[0] < 0) ? 0 : carr[0];
    // carr[1] = (carr[1] > 255) ? 255 : (carr[2] < 0) ? 0 : carr[1];
    // carr[2] = (carr[2] > 255) ? 255 : (carr[2] < 0) ? 0 : carr[2];
    const carr = [0, 0, 0, 255];

    for (let i = 0; i <= ym; i++) {
      if (i + p1[1] < -canvas.canvasHeight / 2 || i + p1[1] >= canvas.canvasHeight / 2) {
        continue;
      }

      const secondHalf = i > p2[1] - p1[1] || p2[1] === p1[1];
      const yms = secondHalf ? p3[1] - p2[1] : p2[1] - p1[1];
      const v1 = i / ym;
      const v2 = (i - (secondHalf ? p2[1] - p1[1] : 0)) / yms;

      let pt1 = [rnd(p1[0] * (1 - v1) + p3[0] * v1), rnd(p1[1] * (1 - v1) + p3[1] * v1), p1[2] * (1 - v1) + p3[2] * v1, 1];
      let pt2 = secondHalf ?
        [rnd(p2[0] * (1 - v2) + p3[0] * v2), rnd(p2[1] * (1 - v2) + p3[1] * v2), p2[2] * (1 - v2) + p3[2] * v2, 1] :
        [rnd(p1[0] * (1 - v2) + p2[0] * v2), rnd(p1[1] * (1 - v2) + p2[1] * v2), p1[2] * (1 - v2) + p2[2] * v2, 1];

      let lt1 = l1 * (1 - v1) + l3 * v1;
      let lt2 = secondHalf ? l2 * (1 - v2) + l3 * v2 : l1 * (1 - v2) + l2 * v2;

      let u1 = [
        rnd((uv1[0] * (1 - v1) * p1[2] + uv3[0] * v1 * p3[2]) / ((1 - v1) * p1[2] + v1 * p3[2])),
        rnd((uv1[1] * (1 - v1) * p1[2] + uv3[1] * v1 * p3[2]) / ((1 - v1) * p1[2] + v1 * p3[2]))
      ];
      let u2 = secondHalf ?
        [
          rnd((uv2[0] * (1 - v2) * p2[2] + uv3[0] * v2 * p3[2]) / ((1 - v2) * p2[2] + v2 * p3[2])),
          rnd((uv2[1] * (1 - v2) * p2[2] + uv3[1] * v2 * p3[2]) / ((1 - v2) * p2[2] + v2 * p3[2]))
        ] : [
          rnd((uv1[0] * (1 - v2) * p1[2] + uv2[0] * v2 * p2[2]) / ((1 - v2) * p1[2] + v2 * p2[2])),
          rnd((uv1[1] * (1 - v2) * p1[2] + uv2[1] * v2 * p2[2]) / ((1 - v2) * p1[2] + v2 * p2[2]))
        ];

      if (pt1[0] > pt2[0]) {
        const t = [pt1[0], pt1[1], pt1[2], pt1[3]];
        pt1 = [pt2[0], pt2[1], pt2[2], pt2[3]];
        pt2 = t;
        const tu = [u1[0], u1[1]];
        u1 = [u2[0], u2[1]];
        u2 = tu;
        const tl = lt1;
        lt1 = lt2;
        lt2 = tl;
      }

      for (let j = pt1[0]; j < pt2[0]; j++) {
        if (j < -canvas.canvasWidth / 2 || j > canvas.canvasWidth / 2) {
          continue;
        }

        const u = pt1[0] === pt2[0] ? 1 : (j - pt1[0]) / (pt2[0] - pt1[0]);
        const pt = [rnd(pt1[0] * (1 - u) + pt2[0] * u), rnd(pt1[1] * (1 - u) + pt2[1] * u), pt1[2] * (1 - u) + pt2[2] * u, 1];
        const l = lt1 * (1 - u) + lt2 * u;
        const uv = [
          (u1[0] * (1 - u) * pt1[2] + u2[0] * u * pt2[2]) / ((1 - u) * pt1[2] + u * pt2[2]),
          (u1[1] * (1 - u) * pt1[2] + u2[1] * u * pt2[2]) / ((1 - u) * pt1[2] + u * pt2[2])
        ];

        const index = rnd((canvas.canvasWidth * (pt[1] + canvas.canvasHeight / 2) + (pt[0] + canvas.canvasWidth / 2)) * 4);

        if (canvas.zbuf[pt[1] + canvas.canvasHeight / 2][pt[0] + canvas.canvasWidth / 2] < pt[2]) {
          canvas.zbuf[pt[1] + canvas.canvasHeight / 2][pt[0] + canvas.canvasWidth / 2] = pt[2];

          const c = [
            color.image.pixels[(rnd(uv[0]) + rnd(uv[1]) * color.image.width) * 4],
            color.image.pixels[(rnd(uv[0]) + rnd(uv[1]) * color.image.width) * 4 + 1],
            color.image.pixels[(rnd(uv[0]) + rnd(uv[1]) * color.image.width) * 4 + 2]
          ];
          carr[0] = rnd(c[0] - 50 * l);
          carr[1] = rnd(c[1] - 50 * l);
          carr[2] = rnd(c[2] - 50 * l);

          canvas.pixels[index] = (carr[0] > 255) ? 255 : (carr[0] < 0) ? 0 : carr[0];
          canvas.pixels[index + 1] = (carr[1] > 255) ? 255 : (carr[2] < 0) ? 0 : carr[1];
          canvas.pixels[index + 2] = (carr[2] > 255) ? 255 : (carr[2] < 0) ? 0 : carr[2];
          canvas.pixels[index + 3] = carr[3];
        }
      }
    }
  }

  render(canvas: any, p1: number[], p2: number[], p3: number[], nvecs: number[][], color: string | TexMap) {
    if (color instanceof TexMap) {
      this.renderTexmap(canvas, p1, p2, p3, nvecs, color);
    } else {
      this.renderString(canvas, p1, p2, p3, nvecs, color);
    }
  }
}
