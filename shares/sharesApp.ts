
/**
* 二维向量
*/
export class Vector {
  /**
   * 二维向量的X坐标
   */
  x: number;
  /**
   * 二维向量的Y坐标
   */
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y
  };
  /**
   * 返回与该向量加法的结果
   * @param a 所加的向量
   * @returns 计算的结果
   */
  add(a: Vector, coverage: boolean = false) {
    const r = new Vector(this.x + a.x, this.y + a.y)
    if (coverage) {
      this.copy(this.add(a))
    }
    return (r)
  };
  /**
   * 返回与该向量减法的结果
   * @param a 所减的向量
   * @returns 计算的结果
   */
  sub(a: Vector, coverage: boolean = false) {
    const r = (new Vector(this.x - a.x, this.y - a.y))
    if (coverage) {
      this.copy(this.sub(a))
    }
    return r
  };
  /**
   * 返回与该向量数乘的结果
   * @param a 所乘的倍数
   * @returns 计算的结果
   */
  by(a: number, coverage: boolean = false) {
    const r = (new Vector(this.x * a, this.y * a))
    if (coverage) {
      this.copy(this.by(a))
    }
    return r
  };
  /**
   * 两个向量之间的距离
   * @param a 一个向量
   * @param b 另一个向量
   * @param mode 计算模式(O:欧几里得,M:曼哈顿,A:小绝对值,B:大绝对值)
   * @returns 计算的结果
   */
  static distance(a: Vector, b: Vector, mode: 'O' | 'M' | 'A' | 'B') {
    switch (mode) {
      case "O":
        return (Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2))
      case "M":
        return (Math.abs(a.x - b.x) + Math.abs(a.y - b.y))
      case "A":
        return (Math.min(Math.abs(a.x - b.x), Math.abs(a.y - b.y)))
      case "B":
        return (Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y)))
    }
  }
  /**
   * 与另一个向量之间的距离
   * @param a 另一个向量
   * @param mode 计算模式(O:欧几里得,M:曼哈顿,A:小绝对值,B:大绝对值)
   * @returns 计算的结果
   */
  distance(a: Vector, mode: 'O' | 'M' | 'A' | 'B' = 'O') {
    switch (mode) {
      case "O":
        return (Math.sqrt((a.x - this.x) ** 2 + (a.y - this.y) ** 2))
      case "M":
        return (Math.abs(a.x - this.x) + Math.abs(a.y - this.y))
      case "A":
        return (Math.min(Math.abs(a.x - this.x), Math.abs(a.y - this.y)))
      case "B":
        return (Math.max(Math.abs(a.x - this.x), Math.abs(a.y - this.y)))
    }
  }
  /**
   * 向量旋转乘
   */
  mul(a: Vector, coverage: boolean = false) {
    const r = new Vector(a.x * this.x - a.y * this.y, a.x * this.y + a.y * this.x)
    if (coverage) {
      this.copy(this.mul(a))
    }
    return r
  }
  /**
   * 复制向量到当前向量
   */
  copy(a: Vector) {
    this.x = a.x
    this.y = a.y
  }
  /**
   * 单位长化
   */
  units(coverage: boolean = false) {
    const r = this.by(1 / this.distance(new Vector(0, 0)))
    if (coverage) {
      this.copy(this.units())
    }
    return (r)
  }
};
/**
* 图片类
* @deprecated 弃用
*/
export class Image {
  /**
   * 图片的锚点
   */
  center: Vector;
  /**
   * 组成图片的各线条
   */
  lines: {
    /**
     * 线条起点
     */
    start: Vector,
    /**
     * 线条终点
     */
    end: Vector,
    /**
     * 线条颜色
     */
    color: [number, number, number],
    /**
     * 线条不透明度
     */
    visibility: number
  }[];
  constructor(lines: {
    start: Vector,
    end: Vector,
    color: [number, number, number],
    visibility: number
  }[], center: Vector = new Vector(0, 0)) {
    this.center = center;
    this.lines = JSON.parse(JSON.stringify(lines))
  }
}

export function noErrorAdd(a: number, b: number) {
  return (Math.round(a + b))
}
export function copyData<T>(data: T): T {
  return JSON.parse(JSON.stringify(data))
}
