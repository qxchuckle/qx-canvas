import { matrixMultiply } from "../utils";
import { Matrix } from "./matrix";
import { ObservablePoint } from "./point";

// 变换矩阵的封装类
export class Transform {
  private localMatrix = new Matrix(); // 相对于父节点的变换矩阵，但注意坐标系仍然是画布
  public worldMatrix = new Matrix(); // 累加了父变换矩阵后，实际相对于世界坐标系的变换矩阵
  public position: ObservablePoint; // 位置，影响平移，即 tx, ty
  public pivot: ObservablePoint; // 旋转锚点，影响旋转，即 a, b, c, d
  public scale: ObservablePoint; // 缩放
  public skew: ObservablePoint; // 斜切
  private _rotate = 0; // 旋转角度，弧度制
  private rotateMatrix = new Matrix(); // 旋转矩阵
  private skewMatrix = new Matrix(); // 斜切矩阵
  private scaleMatrix = new Matrix(); // 缩放矩阵

  private shouldUpdateLocalMatrix = false; // 是否需要更新 localMatrix
  private parentID = ""; // 父节点的 ID

  constructor() {
    this.position = new ObservablePoint(this.onChange);
    this.pivot = new ObservablePoint(this.onChange);
    this.scale = new ObservablePoint(this.onScaleChange, 1, 1);
    this.skew = new ObservablePoint(this.onSkewChange);
  }

  get wordID() {
    return this.worldMatrix.getID();
  }

  get rotate() {
    return this._rotate;
  }

  // 设置旋转角度时，更新旋转矩阵
  set rotate(r: number) {
    this._rotate = r;
    this.rotateMatrix.set(
      Math.cos(this.rotate),
      Math.sin(this.rotate),
      -Math.sin(this.rotate),
      Math.cos(this.rotate),
      0,
      0
    );
    this.shouldUpdateLocalMatrix = true;
  }

  private onChange = () => {
    this.shouldUpdateLocalMatrix = true;
  };

  private onScaleChange = (scaleX: number, scaleY: number) => {
    this.scaleMatrix.set(scaleX, 0, 0, scaleY, 0, 0);
    this.shouldUpdateLocalMatrix = true;
  };

  private onSkewChange = (skewX: number, skewY: number) => {
    this.skewMatrix.set(
      Math.cos(skewY),
      Math.sin(skewY),
      Math.sin(skewX),
      Math.cos(skewX),
      0,
      0
    );
    this.shouldUpdateLocalMatrix = true;
  };

  // 更新 localMatrix 相对于父节点的变换矩阵
  private updateLocalMatrix() {
    if (!this.shouldUpdateLocalMatrix) {
      return;
    }

    // 新建一个单位变换矩阵，应用旋转，斜切，缩放，并获得前四个参数
    const { a, b, c, d } = new Matrix()
      .append(this.rotateMatrix)
      .append(this.skewMatrix)
      .append(this.scaleMatrix);

    // 因为要实现锚点，先计算出锚点经过上面变换后的坐标
    const newPivotX = a * this.pivot.x + c * this.pivot.y;
    const newPivotY = b * this.pivot.x + d * this.pivot.y;

    // 使用平移，将锚点作为坐标原点
    // 因为涉及平移，这里要考虑 position
    const tx = this.position.x - newPivotX;
    const ty = this.position.y - newPivotY;
    this.localMatrix
      .set(a, b, c, d, tx, ty)
      // 最后再将坐标原点平移回去
      .prepend(new Matrix(1, 0, 0, 1, this.pivot.x, this.pivot.y));

    // 更新完毕
    this.shouldUpdateLocalMatrix = false;
    // 因为 localMatrix 变化了，所以 worldMatrix 也需要更新
    this.parentID = "";
  }

  // 更新 worldMatrix
  private updateWorldMatrix(parentTransform: Transform) {
    // 如果父节点的变换没有变化，直接返回
    if (this.parentID === parentTransform.wordID) {
      return;
    }
    // localMatrix 左乘父元素的 worldMatrix，得到当前节点的 worldMatrix
    const { a, b, c, d, tx, ty } = matrixMultiply(
      parentTransform.worldMatrix,
      this.localMatrix
    );
    this.worldMatrix.set(a, b, c, d, tx, ty);
    // 更新完毕，记录最新父节点的 ID
    this.parentID = parentTransform.wordID;
  }

  // 更新变换
  updateTransform(parentTransform: Transform) {
    this.updateLocalMatrix();
    this.updateWorldMatrix(parentTransform);
  }
}
