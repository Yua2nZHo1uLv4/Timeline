import i18n from "@root/i18n";
import { Vector, noErrorAdd, copyData } from '@shares/sharesApp'
import { Bubble } from "./Bubble";
import { Entity } from "./Entity";
/**
 * 高管
 */
let highAdmins: string[] = []
/**
 * 普管
 */
let admins: string[] = []
type mapId = 0 | 1;
remoteChannel.onServerEvent(({ args }) => {
  if (args.type == '高管理员') {
    highAdmins = [...args.data]
  }
  if (args.type == '管理员') {
    admins = [...args.data]
  }
})
type game = {
  /**
   * 游戏占用的泡泡
   */
  gameBubble: Bubble,
  /**
   * 游戏占用的泡泡的ID
   */
  bubbleId: number,
  /**
   * 游戏章节
   */
  gameChapter: 0 | 1 | 2 | 3
};
/**
 * 正在进行的游戏的数据
 */
let gameData: game[] = []
/**
 * 储存所有泡泡的全局对象
 */
let map: Bubble[] = []
map.push(new Bubble(
  1000,
  ''
))
map[0].id = 0
//处理玩家的数据同步
setInterval(() => {
  world.querySelectorAll('player').forEach(e => {
    if (Date.now() - e.player.lastDate > 5000) { return }
    remoteChannel.sendClientEvent(e, {
      type: '方向',
      data: new Vector(e.velocity.x, e.velocity.z),
      size: e.velocity.y
    })
    remoteChannel.sendClientEvent(e, {
      type: '地图',
      data: map.find(d => d.id == e.player.bubbleId)
    })
    if (e.player.bubbleEntity != null) {
      remoteChannel.sendClientEvent(e, {
        type: '摄像机位置',
        data: e.player.bubbleEntity.position
      })
    }
  })
}, 32)

//处理玩家的移动
setInterval(() => {
  world.querySelectorAll('player').forEach(e => {
    if (e.player.bubbleEntity != null) {
      if (Date.now() - e.player.lastDate > 5000) { return }
      e.player.bubbleEntity.position = e.player.bubbleEntity.position.sub(new Vector(e.velocity.x, e.velocity.z).by(10))
      //if (e.velocity.x != 0 || 0 != e.velocity.z) {
      //e.player.bubbleEntity.face = new Vector(-e.velocity.x, -e.velocity.z)
      //}
      if (e.player.bubbleEntity.position.distance(new Vector(0, 0), 'O') > (map.find(d => e.player.bubbleId == d.id) as Bubble).scale) {
        e.player.bubbleEntity.position = e.player.bubbleEntity.position.sub(e.player.bubbleEntity.position.by(1 - (map.find(d => e.player.bubbleId == d.id) as Bubble).scale / e.player.bubbleEntity.position.distance(new Vector(0, 0), 'O')))
      }
      let a = e.hp / e.maxHp
      e.player.bubbleEntity.image = 'picture/player.png'
      e.player.bubbleEntity.opacity = Date.now() - e.player.lastDate > 3000 ? 0.5 : 1
    }
  })
}, 32)
remoteChannel.onServerEvent(async ({ entity, args }) => {
  if (args.type == '语言') {
    entity.player.language = args.data
  }
  if (args.type == '提示') {
    entity.player.directMessage(args.data)
  }
  if (args.type == '触发') {
    entity.player.lastDate = Date.now()
  }
  if (args.type == '互动') {
    /**
     * 目标泡泡
     */
    const targetBubble = map.find(d => d.id == entity.player.bubbleId) as Bubble
    /**
     * 目标实体
     */
    const targetEntity = targetBubble.find('id', args.data) as Entity
    /**
     * 互动玩家
     */
    const player = entity.player.bubbleEntity as Entity
    if (!targetEntity) { return }
    if (targetEntity.tags.includes('NPC')) {
    }
  }
})
world.onPlayerJoin(async ({ entity }) => {
  entity.enableDamage = true
  entity.player.bubbleId = 0
  entity.player.spectator = true
  entity.player.lastClick = {
    r: Date.now(),
    l: Date.now()
  }
  entity.player.bubbleEntity = map[0].creatEntity({
    position: new Vector((Math.random() * 200 - 10), (Math.random() * 200 - 10)),
    tags: ['player', entity.player.userId],
    size: new Vector(100, 100),
    name: entity.player.name,
    face: new Vector(-1, 0),
    image: 'picture/player.png',
    opacity: 1
  })
  remoteChannel.sendClientEvent(entity, {
    type: '摄像机锁定'
  })
  remoteChannel.sendClientEvent(entity, {
    type: '头像',
    data: entity.player.avatar
  })
  remoteChannel.sendClientEvent(entity, {
    type: '摄像机位置',
    data: entity.player.bubbleEntity.position
  })
  entity.player.cameraMode = GameCameraMode.FIXED
  await sleep(100)
  let linenumber = null
  while (linenumber == null) {
    linenumber = await entity.player.dialog({
      type: GameDialogType.SELECT,
      content: '请选择你需要多少实体占位(推荐值：128)',
      options: ['32', '64', '128', '192', '256', '384', '512']
    })
  }
  remoteChannel.sendClientEvent(entity, {
    type: '加载量',
    data: JSON.parse(linenumber.value)
  })
})
world.onPlayerLeave(({ entity }) => {
  if (entity.player.bubbleEntity) {
    const nowBubble = (map.find(d => d.entitys.includes(entity.player.bubbleEntity))) as Bubble
    nowBubble.entitys.forEach(e => {
      if (e.tags.includes('playerItem')) {
        if (e.tags[1] == entity.player.userId) {
          e.destory(nowBubble)
        }
      }
    })
    entity.player.bubbleEntity.destory((map.find(d => d.id == entity.player.bubbleId)) as Bubble)
  }
})
/**
 * 把玩家送到其他泡泡
 * @param entity 目标玩家
 * @param mode 识别模式,id:Bubble.id,index:map中的序号
 * @param id 识别码
 * @returns 如果失败则返回`true`
 */
function changeBubble(entity: GamePlayerEntity, mode: 'id' | 'index' = 'index', id: number, withItem: boolean = false, intoPosition: Vector = new Vector(0, 0)) {
  if (mode == 'index') {
    const nowBubble = (map.find(d => d.entitys.includes(entity.player.bubbleEntity))) as Bubble
    nowBubble.entitys.forEach(e => {
      if (e.tags.includes('playerItem')) {
        if (e.tags[1] == entity.player.userId) {
          e.destory(nowBubble)
        }
      }
    })
    if (entity.player.bubbleEntity) {
      entity.player.bubbleEntity.destory(nowBubble)
    }
    entity.player.bubbleId = map[id].id
    entity.player.bubbleEntity = map[id].creatEntity({
      position: intoPosition,
      tags: ['player', entity.player.userId],
      size: new Vector(100, 100),
      name: entity.player.name,
      face: new Vector(-1, 0),
      image: 'picture/player.png',
      opacity: 1
    })
  } else {
    const targerBubbleIndex = map.findIndex(d => d.id == id)
    if (targerBubbleIndex != -1) {
      const nowBubble = (map.find(d => d.entitys.includes(entity.player.bubbleEntity))) as Bubble
      nowBubble.entitys.forEach(e => {
        if (e.tags.includes('playerItem')) {
          if (e.tags[1] == entity.player.userId) {
            e.destory(nowBubble)
          }
        }
      })
      if (entity.player.bubbleEntity) {
        entity.player.bubbleEntity.destory((map.find(d => d.id == entity.player.bubbleId)) as Bubble)
      }
      entity.player.bubbleId = map[targerBubbleIndex].id
      entity.player.bubbleEntity = map[targerBubbleIndex].creatEntity({
        position: intoPosition,
        tags: ['player', entity.player.userId],
        size: new Vector(100, 100),
        name: entity.player.name,
        face: new Vector(-1, 0),
        image: 'picture/player.png'
      })
    } else {
      return (true)
    }
  }
}
/**
 * 覆盖规定泡泡到指定泡泡
 * @param bubble 指定泡泡
 * @param game 游戏数据
 */
function copyBubble(bubble: Bubble, game: game) {
  switch (game.gameChapter) {
    case 0:
      break
    case 1:
      break
    case 2:
      break
    case 3:
      break
  }
}
setInterval(() => {
  gameData.forEach((d, i) => {
    if (d.gameBubble.find('tag', 'player') == undefined) {
      map.splice(map.findIndex(b => d.bubbleId == b.id), 1)
      gameData.splice(i, 1)
    }
  })
}, 10000)

async function leftClick(entity: GamePlayerEntity) {
}
async function rightClick(entity: GamePlayerEntity) {

}
world.onPress(({ entity, button }) => {
  if (button == GameButtonType.ACTION0) {
    if (Date.now() - entity.player.lastClick.l < 300) {
      leftClick(entity)
    }
    entity.player.lastClick.l = Date.now()
  }
  if (button == GameButtonType.ACTION1) {
    if (Date.now() - entity.player.lastClick.r < 300) {
      rightClick(entity)
    }
    entity.player.lastClick.r = Date.now()
  }
})
