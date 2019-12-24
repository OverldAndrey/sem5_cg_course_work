import {Component, Input, OnInit} from '@angular/core';
import * as p5 from 'p5';
import {RendererService} from '../../services/renderer/renderer.service';
import {Scene} from '../../models/scene';
import {CubeModel} from '../../models/cube-model';
import {Matrix} from '../../models/matrix';
import {ProjectionSphereModel} from '../../models/projection-sphere-model';
import {Projector} from '../../models/projector';
import {isNumeric} from 'rxjs/internal-compatibility';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit {
  private p5;
  private canvas;
  private width = 1000; // 600
  private height = 800; // 480

  private scene: Scene;

  private pressedKeys = [];

  private panoramaMode = false;
  private paused = false;

  @Input() xangle = '90';
  @Input() yangle = '90';
  @Input() direction = '1 0 0';

  constructor(public renderer: RendererService) { }

  addProjector() {
    const adir = this.direction.split(' ');
    if (!isNumeric(this.xangle) || !isNumeric(this.yangle) || adir.length !== 3 || adir.filter(e => isNumeric(e)).length !== 3) {
      alert('Некорректный ввод!');
      return;
    }

    const xa = +this.xangle / 180 * Math.PI;
    const ya = +this.yangle / 180 * Math.PI;
    const dir = this.direction.split(' ').map(e => +e);

    if (xa > 2 / 3 * Math.PI || ya > 2 / 3 * Math.PI || xa < 0 || ya < 0) {
      alert('Некорректный ввод!');
      return;
    }
    if (dir[0] + dir[1] + dir[2] === 0) {
      alert('Некорректный ввод!');
      return;
    }

    // const s = this.scene.sceneObjects[0].object as ProjectionSphereModel;
    // const ca = (dir[0] === 0) ? Math.PI / 2 * Math.sign(dir[1]) :
    //   Math.atan(dir[1] / dir[0]) + Math.PI * ((dir[0] < 0) ? ((dir[1] < 0) ? -1 : 1) : 0);
    // const cb = (Math.sqrt(dir[0] ** 2 + dir[1] ** 2) === 0) ? Math.PI / 2 * Math.sign(dir[2]) :
    //   Math.atan(dir[2] / Math.sqrt(dir[0] ** 2 + dir[1] ** 2));
    // for (let p of s.projectors) {
    //   const a = (p.direction[0] === 0) ? Math.PI / 2 * Math.sign(p.direction[1]) :
    //     Math.atan(p.direction[1] / p.direction[0]) + Math.PI * ((p.direction[0] < 0) ? ((p.direction[1] < 0) ? -1 : 1) : 0);
    //   const b = (Math.sqrt(p.direction[0] ** 2 + p.direction[1] ** 2) === 0) ? Math.PI / 2 * Math.sign(p.direction[2]) :
    //     Math.atan(p.direction[2] / Math.sqrt(p.direction[0] ** 2 + p.direction[1] ** 2));
    //   if (Math.abs(a - ca) < (p.xangle + xa) / 2 && Math.abs(b - cb) < (p.yangle + ya) / 2) {
    //     return;
    //   }
    // }
    if (this.panoramaMode) {
      this.panoramaMode = false;
      const spc = this.scene.sceneObjects[0].object as ProjectionSphereModel;
      spc.projectors = [];
      spc.reproject();
      this.p5.i = [0];
      for (let i of this.p5.intervals) { clearInterval(i); }
      this.p5.intervals = [];
    }

    const cbk = (p, scene, pn) => {
      let is;
      if (pn >= p.imageSets.length) {
        is = p.reserveSet;
      } else {
        is = p.imageSets[pn];
      }
      if (p.i[pn] === is.length) { p.i[pn] = 0; }
      const img = is[p.i[pn]];
      for (let o of scene.sceneObjects) {
        if (o.object instanceof ProjectionSphereModel) {
          o.object.setImage(pn, img);
        }
      }
      p.i[pn]++;
    };

    dir.push(1);
    const sp = this.scene.sceneObjects[0].object as ProjectionSphereModel;
    sp.addProjector(new Projector(xa, ya, dir));
    sp.projectors[sp.projectors.length - 1].image = this.p5.img;
    sp.reproject();

    this.p5.i.push(0);
    this.p5.intervals.push(setInterval(cbk, 1000, this.p5, this.scene, sp.projectors.length - 1));
  }

  setPanorama() {
    // if (this.panoramaMode) { return; }
    this.panoramaMode = true;

    const sp = this.scene.sceneObjects[0].object as ProjectionSphereModel;
    sp.projectors = [];
    sp.reproject();
    this.p5.i = [0];
    for (let i of this.p5.intervals) { clearInterval(i); }
    this.p5.intervals = [];

    const cbk = (p, scene, pn) => {
      let is;
      if (pn >= p.panormaImageSets.length) {
        is = p.reserveSet;
      } else {
        is = p.panormaImageSets[pn];
      }
      if (p.i[pn] === is.length) { p.i[pn] = 0; }
      const img = is[p.i[pn]];
      for (let o of scene.sceneObjects) {
        if (o.object instanceof ProjectionSphereModel) {
          o.object.setImage(pn, img);
        }
      }
      p.i[pn]++;
    };
    const addPan = (xa, ya, dir) => {
      dir.push(1);
      const sp = this.scene.sceneObjects[0].object as ProjectionSphereModel;
      sp.addProjector(new Projector(xa, ya, dir));
      sp.projectors[sp.projectors.length - 1].image = this.p5.img;
      sp.reproject();

      this.p5.i.push(0);
      this.p5.intervals.push(setInterval(cbk, 3000, this.p5, this.scene, sp.projectors.length - 1));
    };
    addPan(Math.PI / 2, Math.PI / 2, [-1, 0, 0]);
    addPan(Math.PI / 2, Math.PI / 2, [1, 0, 0]);
    addPan(Math.PI / 2, Math.PI / 2, [0, 1, 0]);
    addPan(Math.PI / 2, Math.PI / 2, [0, -1, 0]);
    addPan(Math.PI / 2, Math.PI / 2, [0, 0, 1]);
    addPan(Math.PI / 2, Math.PI / 2, [0, 0, -1]);
  }

  pauseTimers() {
    if (!this.panoramaMode) { return; }
    if (this.paused) {
      this.paused = false;
      const cbk = (p, scene, pn) => {
        let is;
        if (pn >= p.panormaImageSets.length) {
          is = p.reserveSet;
        } else {
          is = p.panormaImageSets[pn];
        }
        if (p.i[pn] === is.length) { p.i[pn] = 0; }
        const img = is[p.i[pn]];
        for (let o of scene.sceneObjects) {
          if (o.object instanceof ProjectionSphereModel) {
            o.object.setImage(pn, img);
          }
        }
        p.i[pn]++;
      };
      for (let i = 0; i < this.p5.intervals.length; i++) {
        this.p5.intervals[i] = setInterval(cbk, 3000, this.p5, this.scene, i);
      }
    } else {
      this.paused = true;
      for (let i of this.p5.intervals) { clearInterval(i); }
    }
  }

  ngOnInit() {
    this.p5 = new p5(this.sketch.bind(this));
    this.canvas = this.createCanvas();

    this.scene = new Scene(this.width, this.height);
    // this.scene.camera.positionZ = 300;
    this.scene.camera.positionZ = 200;
    this.scene.camera.positionX = -150;
    this.scene.camera.positionY = 300;
    // this.renderer.translate(this.scene.camera, 0, 0, -300);

    const c1 = new ProjectionSphereModel(100, 10);
    // const pr1 = new Projector(Math.PI / 2 * 18 / 16, 19 / 16 * Math.PI / 2, [10, 0, 80, 1]);
    // c1.addProjector(pr1);
    // c1.reproject();
    this.scene.addSceneObject(c1);
    // const c2 = new CubeModel(100);
    // this.scene.addSceneObject(c2);

    // this.renderer.translate(this.scene.sceneObjects[1], 200, 100, -100);

    // Make const, not var
    const coordSys = new CubeModel();
    coordSys.addTriangle([0, 0, 0, 1], [0, 0, 0, 1], [150, 0, 0, 1], '#FF0000');
    coordSys.addTriangle([0, 0, 0, 1], [0, 0, 0, 1], [0, 150, 0, 1], '#0000FF');
    coordSys.addTriangle([0, 0, 0, 1], [0, 0, 0, 1], [0, 0, 150, 1], '#00FF00');

    this.scene.addSceneObject(coordSys);

    // this.renderer.translate(this.scene.sceneObjects[0], 0, 0, 300);
    this.renderer.rotate(this.scene.camera, -Math.PI / 2 - 0.7, 0, Math.PI + 0.7);
  }

  private createCanvas() {
    this.p5.mouseMoved = (ev) => {
      if (this.p5.mouseIsPressedC) {
        this.scene.camera.rotate = {
          ax: 0,
          ay: 0,
          az: -(ev.movementX) / 1000
        };
        // const dir = this.scene.camera.transform.multiplyVector([0, 0, 1, 1]);
        const hor = this.scene.camera.transform.multiplyVector([1, 0, 0, 1]);
        // const ver = this.scene.camera.transform.multiplyVector([0, 1, 0, 1]);
        const a = -ev.movementX / 1000;
        const b = ev.movementY / 1000;
        // const csa = Math.cos(a);
        // const sna = Math.sin(a);
        const csb = Math.cos(b);
        const snb = Math.sin(b);
        // const ma = new Matrix([
        //   [csa + (1 - csa) * ver[0] ** 2, (1 - csa) * ver[0] * ver[1] - sna * ver[2], (1 - csa) * ver[0] * ver[2] + sna * ver[1], 0],
        //   [(1 - csa) * ver[0] * ver[1] + sna * ver[2], csa + (1 - csa) * ver[1] ** 2, (1 - csa) * ver[1] * ver[2] - sna * ver[0], 0],
        //   [(1 - csa) * ver[0] * ver[2] - sna * ver[1], (1 - csa) * ver[1] * ver[2] + sna * ver[0], csa + (1 - csa) * ver[2] ** 2, 0],
        //   [0, 0, 0, 1]
        // ]);
        const mb = new Matrix([
          [csb + (1 - csb) * hor[0] ** 2, (1 - csb) * hor[0] * hor[1] - snb * hor[2], (1 - csb) * hor[0] * hor[2] + snb * hor[1], 0],
          [(1 - csb) * hor[0] * hor[1] + snb * hor[2], csb + (1 - csb) * hor[1] ** 2, (1 - csb) * hor[1] * hor[2] - snb * hor[0], 0],
          [(1 - csb) * hor[0] * hor[2] - snb * hor[1], (1 - csb) * hor[1] * hor[2] + snb * hor[0], csb + (1 - csb) * hor[2] ** 2, 0],
          [0, 0, 0, 1]
        ]);
        // this.scene.camera.transf = ma;
        this.scene.camera.transf = mb;
      }
      return false;
    };

    // this.p5.mouseWheel = (e) => {
    //   if (this.p5.mouseIsPressedC) {
    //     this.scene.camera.rotate = {ax: 0, ay: 0, az: Math.sign(e.delta) / 10};
    //   }
    //   this.p5.prevWH += e.delta;
    //   return false;
    // };

    return this.p5.canvas;
  }

  private sketch(p: any) {
    p.preload = () => {
      // const cb = (p, scene, pn) => {
      //   let is;
      //   if (pn >= p.imageSets.length) {
      //     is = p.reserveSet;
      //   } else {
      //     is = p.imageSets[pn];
      //   }
      //   if (p.i[pn] === is.length) { p.i[pn] = 0; }
      //   const img = is[p.i[pn]];
      //   for (let o of scene.sceneObjects) {
      //     if (o.object instanceof ProjectionSphereModel) {
      //       o.object.setImage(pn, img);
      //     }
      //   }
      //   p.i[pn]++;
      // };
      p.imageSets = [];
      let imageSet = [];
      imageSet.push(p.loadImage('../../assets/photogid.net_img_1255i.jpg'));
      imageSet.push(p.loadImage('../../assets/Do-kb0FWwAAsdRH.jpg'));
      imageSet.push(p.loadImage('../../assets/EG3QCw5X4AImb-4.jpg'));
      p.imageSets.push(imageSet);
      imageSet = [];
      imageSet.push(p.loadImage('../../assets/352cdd30110245.5613e92c3826a.jpg'));
      imageSet.push(p.loadImage('../../assets/20707c72-79a8-4c29-8c06-1e5882213a33.png._CB270500429_.png'));
      p.imageSets.push(imageSet);
      imageSet = [];
      imageSet.push(p.loadImage('../../assets/mvGO9GLnzfE.jpg'));
      imageSet.push(p.loadImage('../../assets/s1200.jpg'));
      imageSet.push(p.loadImage('../../assets/Worley.png'));
      p.imageSets.push(imageSet);

      p.panormaImageSets = [];
      imageSet = [];
      imageSet.push(p.loadImage('../../assets/left.png'));
      imageSet.push(p.loadImage('../../assets/left1.png'));
      imageSet.push(p.loadImage('../../assets/left2.png'));
      p.panormaImageSets.push(imageSet);
      imageSet = [];
      imageSet.push(p.loadImage('../../assets/right.png'));
      imageSet.push(p.loadImage('../../assets/right1.png'));
      imageSet.push(p.loadImage('../../assets/right2.png'));
      p.panormaImageSets.push(imageSet);
      imageSet = [];
      imageSet.push(p.loadImage('../../assets/front.png'));
      imageSet.push(p.loadImage('../../assets/front1.png'));
      imageSet.push(p.loadImage('../../assets/front2.png'));
      p.panormaImageSets.push(imageSet);
      imageSet = [];
      imageSet.push(p.loadImage('../../assets/back.png'));
      imageSet.push(p.loadImage('../../assets/back1.png'));
      imageSet.push(p.loadImage('../../assets/back2.png'));
      p.panormaImageSets.push(imageSet);
      imageSet = [];
      imageSet.push(p.loadImage('../../assets/top.png'));
      imageSet.push(p.loadImage('../../assets/top1.png'));
      imageSet.push(p.loadImage('../../assets/top2.png'));
      p.panormaImageSets.push(imageSet);
      imageSet = [];
      imageSet.push(p.loadImage('../../assets/bottom.png'));
      imageSet.push(p.loadImage('../../assets/bottom1.png'));
      imageSet.push(p.loadImage('../../assets/bottom2.png'));
      p.panormaImageSets.push(imageSet);
      p.reserveSet = p.imageSets[p.imageSets.length - 1];
      p.i = [0];
      p.img = p.loadImage('../../assets/original.png');
      p.intervals = [];
    };

    p.setup = () => {
      this.canvas = p.canvas;
      p.pixelDensity(1);
      const cn = p.createCanvas(this.width, this.height); // , p.WEBGL);
      cn.parent('canvas-bed');
      p.frameRate(60);
      p.canvasWidth = this.width;
      p.canvasHeight = this.height;
      p.zbuf = [];
      // this.canvas.style.cssText = `width: ${this.width * 1.5}px; height: ${this.height * 1.5}px;`;
      this.canvas.style.cssText = `width: ${1000}px; height: ${800}px;`;
      for (let i = 0; i < this.height; i++) {
        const t = [];
        for (let j = 0; j < this.width; j++) {
          t.push(Infinity);
        }
        p.zbuf.push(t);
      }
      p.prevWH = 0;
      p.mouseIsPressedC = false;

      this.canvas.onclick = (ev) => {
        this.p5.mouseIsPressedC = !this.p5.mouseIsPressedC;
        this.canvas.requestPointerLock();
        window.onkeydown = (e) => {
          const code = e.code;
          if (!this.pressedKeys.includes(code)) { this.pressedKeys.push(code); }
          const pos = this.scene.camera.position;
          const dir = this.scene.camera.transform.multiplyVector([0, 0, 1, 1]);
          const dl = Math.sqrt(dir[0] ** 2 + dir[1] ** 2 + dir[2] ** 2);
          dir[0] /= dl; dir[1] /= dl; dir[2] /= dl;
          if (this.pressedKeys.includes('KeyW')) {
            pos.y = pos.y + 5 * dir[1];
            pos.x = pos.x + 5 * dir[0];
          }
          if (this.pressedKeys.includes('KeyS')) {
            pos.y = pos.y - 5 * dir[1];
            pos.x = pos.x - 5 * dir[0];
          }
          if (this.pressedKeys.includes('KeyD')) {
            pos.x = pos.x + 5 * dir[1];
            pos.y = pos.y - 5 * dir[0];
          }
          if (this.pressedKeys.includes('KeyA')) {
            pos.x = pos.x - 5 * dir[1];
            pos.y = pos.y + 5 * dir[0];
          }
          if (this.pressedKeys.includes('KeyF')) {
            pos.x = 0;
            pos.y = 0;
            pos.z = 0;
          }
          if (this.pressedKeys.includes('KeyE')) {
            this.pauseTimers();
          }
          if (this.pressedKeys.includes('ShiftLeft')) {
            pos.z = pos.z - 5;
          }
          if (this.pressedKeys.includes('Space')) {
            pos.z = pos.z + 5;
          }
          this.scene.camera.positionX = pos.x;
          this.scene.camera.positionY = pos.y;
          this.scene.camera.positionZ = pos.z;
          if (this.pressedKeys.includes('Escape')) {
            window.onkeydown = undefined;
          }
          // console.log(this.pressedKeys);
          return false;
        };
        window.onkeyup = (e) => {
          this.pressedKeys = this.pressedKeys.filter(el => el !== e.code);
          // console.log(this.pressedKeys);
        };
      };
      this.canvas.onclick = this.canvas.onclick.bind(this);

      // const o = this.scene.sceneObjects[1].object as CubeModel;
      // o.triangles[0].color = new TexMap(p.img, [0, 1, 0, 1], [0.5, 1, 0, 1], [0.5, 0, 0, 1]);
      // o.triangles[1].color = new TexMap(p.img, [0, 1, 0, 1], [0, 0, 0, 1], [0.5, 0, 0, 1]);
      // o.triangles[8].color = new TexMap(p.img, [0.5, 1, 0, 1], [1, 1, 0, 1], [1, 0, 0, 1]);
      // o.triangles[9].color = new TexMap(p.img, [0.5, 1, 0, 1], [0.5, 0, 0, 1], [1, 0, 0, 1]);
      // const sp = this.scene.sceneObjects[0].object as ProjectionSphereModel;
      // sp.projectors[0].image = p.img;
      // sp.reproject();
      p.fill([255, 100, 100]);
    };

    p.draw = () => {
      p.background(255);

      for (let i = 0; i < this.height; i++) {
        for (let j = 0; j < this.width; j++) {
          p.zbuf[i][j] = 0;
        }
      }

      p.loadPixels();
      this.renderer.render(this.scene, p);
      p.updatePixels();

      p.stroke('#000000');
      p.line(0, 0, this.width, 0);
      p.line(0, 0, 0, this.height);
      p.line(0, this.height, this.width, this.height);
      p.line(this.width, 0, this.width, this.height);
      p.text(p.frameRate().toFixed(1) + ' fps', 20, 30);
    };
  }
}
