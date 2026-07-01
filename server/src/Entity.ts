import { Vector } from "../../shares/sharesApp";
import { Bubble } from "./Bubble";
export class Entity {
  /**
   * 实体所属泡泡的id
   */
  bubbleId: number
  /**
   * 实体的唯一id
   */
  id: number;
  /**
   * 实体标签
   */
  tags: string[];
  /**
   * 实体位置
   */
  position: Vector;
  /**
   * 实体的缩放
   */
  size: Vector;
  /**
   * 实体的朝向
   */
  face: Vector;
  /**
   * 实体的不透明度
   */
  opacity: number;
  /**
   * 实体的图标
   */
  image: GamePictureAssets | '';
  /**
   * 实体是否启用互动
   */
  enableInteraction: boolean;
  /**
   * 实体互动提示词
   * @deprecated 弃用
   */
  interactivePromptWords: string;
  /**
   * 实体可互动距离
   */
  interactiveDistance: number;
  /**
   * 实体的名字
   */
  name: string;
  /**
   * 背景颜色
   */
  backgroundcolor: {
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
  /**
   * 删除该实体
   * @param bubble 实体所处的泡泡
   */
  destory(bubble: Bubble) {
    if (bubble.id == this.bubbleId) {
      bubble.entitys.splice(bubble.entitys.indexOf(bubble.find('id', this.id) as Entity), 1)
    }
  }
  constructor(data: {
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
    name?: string;
    /**
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
    this.face = new Vector(-1, 0);
    this.image = '';
    this.opacity = 0;
    this.position = new Vector(0, 0);
    this.size = new Vector(0, 0);
    this.tags = [];
    this.enableInteraction = false;
    this.interactiveDistance = 0;
    this.interactivePromptWords = ''
    this.id = Math.random()
    this.bubbleId = -1;
    this.name = ''
    this.backgroundcolor = { r: 0, g: 0, b: 0, a: 0 }
    if (data.tags != undefined) {
      this.tags = [...data.tags]
    }
    if (data.position != undefined) {
      this.position = data.position
    }
    if (data.size != undefined) {
      this.size = data.size
    }
    if (data.face != undefined) {
      this.face = data.face
    }
    if (data.opacity != undefined) {
      this.opacity = data.opacity
    }
    if (data.image != undefined) {
      this.image = data.image
    }
    if (data.enableInteraction != undefined) {
      this.enableInteraction = data.enableInteraction
    }
    if (data.interactiveDistance != undefined) {
      this.interactiveDistance = data.interactiveDistance
    }
    if (data.interactivePromptWords != undefined) {
      this.interactivePromptWords = data.interactivePromptWords
    }
    if (data.name != undefined) {
      this.name = data.name
    }
    if (data.backgroundcolor != undefined) {
      this.backgroundcolor = data.backgroundcolor
    }
    return this
  }
}