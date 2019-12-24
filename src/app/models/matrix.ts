export class Matrix {
  matrix = [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1]
  ];

  constructor(matrix?: number[][]) {
    if (matrix) {
      this.matrix = matrix;
    }
  }

  static matrInit(n) {
    const mt = [];
    for (let i = 0; i < n; i++) {
      const row = [];
      for (let j = 0; j < n; j++) { row.push(0); }
      mt.push(row);
    }
    return mt;
  }

  get getMatrix() {
    const res = Matrix.matrInit(this.matrix.length);
    for (let i = 0; i < this.matrix.length; i++) {
      for (let j = 0; j < this.matrix.length; j++) {
        res[i][j] = this.matrix[i][j];
      }
    }
    return res;
  }

  multiplyByMatrix(matr: Matrix) {
    const N = this.matrix.length;
    const res = Matrix.matrInit(N);
    const mulu = [];
    const mulv = [];
    for (let i = 0; i < N; i++) { mulu.push(0); mulv.push(0); }

    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N - 1; j += 2) {
        mulu[i] -= this.matrix[i][j] * this.matrix[i][j + 1];
      }
    }

    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N - 1; j += 2) {
        mulv[i] -= matr.matrix[j][i] * matr.matrix[j + 1][i];
      }
    }

    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        res[i][j] = mulu[i] + mulv[j];
        if (N % 2 === 1) {
          res[i][j] += this.matrix[i][N - 1] * matr.matrix[N - 1][j];
        }
        for (let k = 0; k < N - 1; k += 2) {
          res[i][j] += (this.matrix[i][k] + matr.matrix[k + 1][j]) * (this.matrix[i][k + 1] + matr.matrix[k][j]);
        }
      }
    }

    this.matrix = res;
  }

  multiplyVector(vec: number[]): number[] {
    const res = [];

    for (let i = 0; i < this.matrix.length; i++) {
      res.push(0);
      for (let j = 0; j < this.matrix.length; j++) {
        res[i] += vec[j] * this.matrix[j][i];
      }
    }

    return res;
  }

  reverse() {
    const matr = this.matrix;
    const add = [];
    const M = matr.length;
    const tr = [];
    const res = [];

    for (let i = 0; i < M; i++) {
      tr.push(matr.map(e => e[i]));
    }

    for (let i = 0; i < M; i++) {
      const tmp = [];
      for (let j = 0; j < M; j++) {
        tmp.push((-1) ** (i + j) * this._determinant(
          tr
            .map(e => e.filter((el, ind) => ind !== j))
            .filter((e, ind) => ind !== i)
        ));
      }
      add.push(tmp);
    }

    const detM = this.determinant();

    for (let i = 0; i < matr.length; i++) {
      const tmp = [];
      for (let j = 0; j < matr.length; j++) {
        tmp.push(add[i][j] / detM);
      }
      res.push(tmp);
    }

    this.matrix = res;
  }

  determinant(): number {
    return this._determinant(this.matrix);
  }

  private _determinant(A: number[][]): number {
    const n = A.length;
    const subA = [];
    let detA = 0;

    if (n === 1) {
      return A[0][0];
    }
    if (n === 2) {
      return (A[0][0] * A[1][1] - A[0][1] * A[1][0]);
    }
    if (n === 3) {
      return ((A[0][0] * A[1][1] * A[2][2] + A[0][1] * A[1][2] * A[2][0] + A[0][2] * A[1][0] * A[2][1])
        - (A[0][0] * A[1][2] * A[2][1] + A[0][1] * A[1][0] * A[2][2] + A[0][2] * A[1][1] * A[2][0]));
    }

    for (let i = 0; i < n; i++) {
      for (let h = 0; h < n - 1; h++) {
        subA[h] = [];
      }
      for (let a = 1; a < n; a++) {
        for (let b = 0; b < n; b++) {
          if (b < i) {
            subA[a - 1][ b ] = A[a][b];
          } else if (b > i) {
            subA[a - 1][b - 1] = A[a][b];
          }
        }
      }
      const sign = (i % 2 === 0) ? 1 : -1;
      detA += sign * A[0][i] * this._determinant(subA);
    }

    return detA;
  }
}
