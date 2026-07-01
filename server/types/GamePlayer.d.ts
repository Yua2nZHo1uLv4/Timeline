
/**
 * 扩展[游戏玩家]的接口
 * 该接口继承自GamePlayer，可以为[游戏玩家]添加额外的属性或方法。
 */
declare interface GamePlayer extends GamePlayer {
  /**
   * 玩家浏览器语言
   */
  language: 'en' | 'zh-CN',
  /**
   * 玩家所在泡泡的ID
   */
  bubbleId: number,
  /**
   * 玩家在泡泡中的实体
   */
  bubbleEntity: Entity,
  /**
   * 用于优化，反触发
   */
  lastDate: number,
  /**
   * 上次击打鼠标
   */
  lastClick: {
    l: number,
    r: number
  }
};
