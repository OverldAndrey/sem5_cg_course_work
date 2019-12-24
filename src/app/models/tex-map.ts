export class TexMap {
  private texture: any;
  private top: number;
  private left: number;
  private height: number;
  private width: number;
  private readonly pts: number[][];
  private projId: number;
  vertices: number[][];
  projectedVertices = [0, 1, 2];

  // private lineFunc;

  constructor(tex: any, p1: number[], p2: number[], p3: number[]) {
    this.texture = tex;
    this.pts = [[...p1], [...p2], [...p3]];
    p1[0] = Math.round(p1[0] * tex.width);
    p2[0] = Math.round(p2[0] * tex.width);
    p3[0] = Math.round(p3[0] * tex.width);
    p1[1] = Math.round(p1[1] * tex.height);
    p2[1] = Math.round(p2[1] * tex.height);
    p3[1] = Math.round(p3[1] * tex.height);
    if (p1[0] >= tex.width) { p1[0] = tex.width - 1; }
    if (p2[0] >= tex.width) { p2[0] = tex.width - 1; }
    if (p3[0] >= tex.width) { p3[0] = tex.width - 1; }
    if (p1[1] >= tex.height) { p1[1] = tex.height - 1; }
    if (p2[1] >= tex.height) { p2[1] = tex.height - 1; }
    if (p3[1] >= tex.height) { p3[1] = tex.height - 1; }
    this.vertices = [p1, p2, p3];
    this.top = Math.min(p1[1], p2[1], p3[1]);
    this.left = Math.min(p1[0], p2[0], p3[0]);
    this.height = Math.max(p3[1], p1[1], p2[1]) - this.top;
    this.width = Math.max(p1[0], p2[0], p3[0]) - this.left;
    this.texture.loadPixels();
  }

  set projectorId(id) {
    this.projId = id;
  }

  get projectorId() {
    return this.projId;
  }

  set image(img) {
    this.texture = img;
    const p1 = [0, 0, 0, 1];
    const p2 = [0, 0, 0, 1];
    const p3 = [0, 0, 0, 1];
    p1[0] = Math.round(this.pts[0][0] * img.width);
    p2[0] = Math.round(this.pts[1][0] * img.width);
    p3[0] = Math.round(this.pts[2][0] * img.width);
    p1[1] = Math.round(this.pts[0][1] * img.height);
    p2[1] = Math.round(this.pts[1][1] * img.height);
    p3[1] = Math.round(this.pts[2][1] * img.height);
    if (p1[0] >= img.width) { p1[0] = img.width - 1; }
    if (p2[0] >= img.width) { p2[0] = img.width - 1; }
    if (p3[0] >= img.width) { p3[0] = img.width - 1; }
    if (p1[1] >= img.height) { p1[1] = img.height - 1; }
    if (p2[1] >= img.height) { p2[1] = img.height - 1; }
    if (p3[1] >= img.height) { p3[1] = img.height - 1; }
    this.vertices = [p1, p2, p3];
    this.top = Math.min(p1[1], p2[1], p3[1]);
    this.left = Math.min(p1[0], p2[0], p3[0]);
    this.height = Math.max(p3[1], p1[1], p2[1]) - this.top;
    this.width = Math.max(p1[0], p2[0], p3[0]) - this.left;
    this.texture.loadPixels();
  }

  get image() {
    return this.texture;
  }

  // setLineFunc(l1, l2, v1, v2, z1, z2) {
  //   let x1;
  //   let x2;
  //   let y1;
  //   let y2;
  //   let v11 = v1;
  //   let v12 = v1;
  //   let v21 = v2;
  //   let v22 = v2;
  //   let z11 = z1[0];
  //   let z12 = z1[1];
  //   let z21 = z2[0];
  //   let z22 = z2[1];
  //   let zleft1, zleft2;
  //   let zright1, zright2;
  //   let ztop1, ztop2;
  //   let zbottom1, zbottom2;
  //   let xleft1, xleft2;
  //   let xright1, xright2;
  //   let ytop1, ytop2;
  //   let ybottom1, ybottom2;
  //
  //   if (this.vertices[l1[1]][0] - this.vertices[l1[0]][0] < 0) {
  //     v11 = 1 - v11;
  //     xleft1 = this.vertices[l1[1]][0];
  //     xright1 = this.vertices[l1[0]][0];
  //     zleft1 = z12;
  //     zright1 = z11;
  //   } else {
  //     xleft1 = this.vertices[l1[0]][0];
  //     xright1 = this.vertices[l1[1]][0];
  //     zleft1 = z11;
  //     zright1 = z12;
  //   }
  //   if (this.vertices[l2[1]][0] - this.vertices[l2[0]][0] < 0) {
  //     v21 = 1 - v21;
  //     xleft2 = this.vertices[l2[1]][0];
  //     xright2 = this.vertices[l2[0]][0];
  //     zleft2 = z22;
  //     zright2 = z21;
  //   } else {
  //     xleft2 = this.vertices[l2[0]][0];
  //     xright2 = this.vertices[l2[1]][0];
  //     zleft2 = z21;
  //     zright2 = z22;
  //   }
  //   if (this.vertices[l1[1]][1] - this.vertices[l1[0]][1] < 0) {
  //     v12 = 1 - v12;
  //     ytop1 = this.vertices[l1[1]][1];
  //     ybottom1 = this.vertices[l1[0]][1];
  //     ztop1 = z12;
  //     zbottom1 = z11;
  //   } else {
  //     ytop1 = this.vertices[l1[0]][1];
  //     ybottom1 = this.vertices[l1[1]][1];
  //     ztop1 = z11;
  //     zbottom1 = z12;
  //   }
  //   if (this.vertices[l2[1]][1] - this.vertices[l2[0]][1] < 0) {
  //     v22 = 1 - v22;
  //     ytop2 = this.vertices[l2[1]][1];
  //     ybottom2 = this.vertices[l2[0]][1];
  //     ztop2 = z22;
  //     zbottom2 = z21;
  //   } else {
  //     ytop2 = this.vertices[l2[0]][1];
  //     ybottom2 = this.vertices[l2[1]][1];
  //     ztop2 = z21;
  //     zbottom2 = z22;
  //   }
  //   x1 = (xleft1 * (1 - v11) / zleft1 + xright1 * v11 / zright1) / ((1 - v11) / zleft1 + v11 / zright1);
  //   x2 = (xleft2 * (1 - v21) / zleft2 + xright2 * v21 / zright2) / ((1 - v21) / zleft2 + v21 / zright2);
  //   y1 = (ytop1 * (1 - v12) / ztop1 + ybottom1 * v12 / zbottom1) / ((1 - v12) / ztop1 + v12 / zbottom1);
  //   y2 = (ytop2 * (1 - v22) / ztop2 + ybottom2 * v22 / zbottom2) / ((1 - v22) / ztop2 + v22 / zbottom2);
  //   this.lineFunc = {
  //     p1: [x1, y1],
  //     p2: [x2, y2]
  //   };
  // }
  //
  // getLinePixel(u, z1, z2) {
  //   let u1 = u;
  //   let u2 = u;
  //   let zleft = z1;
  //   let zright = z2;
  //   let ztop = z1;
  //   let zbottom = z2;
  //   if (this.lineFunc.p1[0] - this.lineFunc.p2[0] > 0) { u1 = 1 - u; zleft = z2; zright = z1; }
  //   if (this.lineFunc.p1[1] - this.lineFunc.p2[1] >= 0) { u2 = 1 - u; ztop = z2; zbottom = z1; }
  //   let xleft = this.lineFunc.p1[0];
  //   let xright = this.lineFunc.p2[0];
  //   let ytop = this.lineFunc.p1[1];
  //   let ybottom = this.lineFunc.p2[1];
  //   if (this.lineFunc.p1[0] < this.lineFunc.p2[0]) {
  //     xleft = this.lineFunc.p1[0];
  //     xright = this.lineFunc.p2[0];
  //   } else {
  //     xleft = this.lineFunc.p2[0];
  //     xright = this.lineFunc.p1[0];
  //   }
  //   if (this.lineFunc.p1[1] < this.lineFunc.p2[1]) {
  //     ytop = this.lineFunc.p1[1];
  //     ybottom = this.lineFunc.p2[1];
  //   } else {
  //     ytop = this.lineFunc.p2[1];
  //     ybottom = this.lineFunc.p1[1];
  //   }
  //   // const x = Math.round(Math.abs(this.lineFunc.p2[0] - this.lineFunc.p1[0]) * u1 + Math.min(this.lineFunc.p1[0], this.lineFunc.p2[0]));
  //   // const y = Math.round(Math.abs(this.lineFunc.p2[1] - this.lineFunc.p1[1]) * u2 + Math.min(this.lineFunc.p1[1], this.lineFunc.p2[1]));
  //   const x = Math.round((xleft * (1 - u1) / zleft + xright * u1 / zright) / ((1 - u1) / zleft + u1 / zright));
  //   const y = Math.round((ytop * (1 - u2) / ztop + ybottom * u2 / zbottom) / ((1 - u2) / ztop + u2 / zbottom));
  //   // const x = Math.round(xleft * (1 - u1) + xright * u1);
  //   // const y = Math.round(ytop * (1 - u2) + ybottom * u2);
  //   const index = Math.round(
  //     this.texture.width * (y) + x
  //   ) * 4;
  //   return [this.texture.pixels[index], this.texture.pixels[index + 1], this.texture.pixels[index + 2]];
  // }
}
