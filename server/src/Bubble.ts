import { Vector } from "../../shares/sharesApp";
import { Entity } from "./Entity";

/**
 * 服务器单独处理的泡泡
 */
export class Bubble {
  /**
   * 泡泡的半径
   */
  scale: number;
  /**
   * 泡泡的背景图片
   */
  background: GamePictureAssets | '';
  /**
   * 泡泡的唯一标识
   */
  id: number
  /**
   * 泡泡内的实体
   */
  entitys: Entity[];
  constructor(r: number, background: GamePictureAssets | '', entity?: Entity[]) {
    this.scale = r
    this.background = background
    this.entitys = []
    this.id = Math.random()
    if (entity) {
      this.entitys = JSON.parse(JSON.stringify(entity))
    }
    this.entitys.forEach(d => d.bubbleId = this.id)
    return this
  }
  /**
   * 找到一个符合条件的实体
   * @param way 检查方式,tag:标签寻找
   * @param key 寻找标识
   * @returns `undifined`或者符合条件的实体
   */
  find(way: 'tag' | 'id', key: string | number) {
    if (way == 'tag' && typeof key == 'string') {
      return this.entitys.find(d => d.tags.includes(key))
    } else if (way == 'id' && typeof key == 'number') {
      return this.entitys.find(d => d.id == key)
    }
    return undefined
  }
  /**
   * 找到所有拥有标签的实体列表
   * @param key 查找的标签
   * @returns 符合条件实体的数组
   */
  findAll(key: string) {
    return this.entitys.filter(d => d.tags.includes(key))
  }
  creatEntity(data: {
    /**
     * 实体标签
     */
    tags?: string[];
    /**
     * 实体位置
     */
    position?: Vector;
    /**
     * 实体的缩放
     */
    size?: Vector;
    /**
     * 实体的朝向
     */
    face?: Vector;
    /**
     * 实体的不透明度
     */
    opacity?: number;
    /**
     * 实体的图标
     */
    image?: GamePictureAssets | '';
    /**
     * 实体是否启用互动
     */
    enableInteraction?: boolean;
    /**
     * 实体互动提示词
     */
    interactivePromptWords?: string;
    /**
     * 实体可互动距离
     */
    interactiveDistance?: number;
    /**
     * 实体的名字
     */
    name?: string;/**
    * 背景颜色
    */
    backgroundcolor?: {
      /**
       * 可见度
       */
      a: number,
      /**
       * R分量
       */
      r: number,
      /**
       * G分量
       */
      g: number,
      /**
       * B分量
       */
      b: number
    }
  }) {
    let e = new Entity(data)
    e.bubbleId = this.id
    this.entitys.push(e)
    return e
  }
}
