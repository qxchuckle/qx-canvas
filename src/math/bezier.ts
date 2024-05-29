/**
 * 将贝塞尔曲线的控制点传入，返回一系列点模拟贝塞尔曲线
 * 数组中，每两个元素代表一个点的 x, y 坐标
 * @param controlPoints 控制点数组
 * @param t 时间点，取值范围 0-1
 * @param accuracy 精度
 * @returns
 */
export function bezier(
  controlPoints: number[],
  t: number,
  accuracy: number
): number[] {
  if (t <= 0) {
    return [];
  }
  t = Math.min(t, 1);
  accuracy = Math.floor(accuracy * t);
  // 限制精度范围
  accuracy = Math.max(accuracy, 20);
  accuracy = Math.min(accuracy, 2048);
  // 结果数组
  const result: number[] = [];
  const addNum = 1 / accuracy;
  let i = 0;
  while (i <= t) {
    calcBezierPoint(controlPoints, result, i);
    i += addNum;
  }
  // 补偿绘制最后一段
  calcBezierPoint(controlPoints, result, t);
  return result;
}

// 计算贝塞尔曲线上的点
function calcBezierPoint(points: number[], curvePoints: number[], t: number) {
  // 只有一个点，说明是运动点
  if (points.length <= 2) {
    curvePoints.push(...points);
    return;
  }
  // 下一阶新的控制点数组
  const newPoints: number[] = [];
  // 遍历所有控制点，算出下一阶的控制点
  for (let i = 0; i < points.length - 2; i += 2) {
    newPoints.push(
      ...calcMotionPoint(
        points[i],
        points[i + 1],
        points[i + 2],
        points[i + 3],
        t
      )
    );
  }
  // 递归调用，计算从n阶到1阶的所有控制点
  calcBezierPoint(newPoints, curvePoints, t);
}

// 计算两个点之间运动点位置
function calcMotionPoint(
  p0x: number,
  p0y: number,
  p1x: number,
  p1y: number,
  t: number
) {
  // 也就是一阶贝塞尔曲线公式
  return [(1 - t) * p0x + t * p1x, (1 - t) * p0y + t * p1y];
}
