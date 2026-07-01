import i18n from "@root/i18n";
import { Vector } from '@shares/sharesApp'
import find from "../UiIndex";
let lastRefresh = Date.now()
remoteChannel.sendServerEvent({
  type: '高管理员',
  data: ['13048840']
})
remoteChannel.sendServerEvent({
  type: '管理员',
  data: ['13048840']
})
remoteChannel.sendServerEvent({
  type: '语言',
  data: navigator.language == 'zh-CN' ? 'zh-CN' : 'en'
})
/**
 * 当前地图需要渲染的所有图片元素
 */
let maps: {
  position: Vector,
  scale: Vector,
  direction: Vector,
  image: GamePictureAssets | '',
  name: string,
  inter: boolean,
  opacity: number,
  id: number,
  backgroundcolor: {
    a: number,
    r: number,
    g: number,
    b: number
  }
}[] = [{
  position: new Vector(0, 0),
  scale: new Vector(400, 100),
  direction: new Vector(100, 0),
  image: 'picture/air.png',
  name: '正在加入服务器',
  inter: false,
  opacity: 1,
  id: 0,
  backgroundcolor: {
    a: 0,
    r: 0,
    b: 0,
    g: 0
  }
}]
let mapR: number = 300
/**
 * 相机的数据
 */
let camera: {
  /**
   * 摄像机的位置
   */
  position: Vector,
  /**
   * 摄像机的缩放
   */
  size: number,
  /**
   * 摄像机的目标位置
   */
  targetPosition: Vector,
  /**
   * 摄像机的目标缩放
   */
  targerSize: number,
  /**
   * 摄像机的模式
   * watch:旁观者模式
   * use:锁定模式
   */
  mode: 'watch' | 'use',
  /**
   * 摄像机的朝向(仅在watch模式下)
   */
  direction: Vector
} = {
  position: new Vector(0, 0),
  size: 1,
  targetPosition: new Vector(0, 0),
  targerSize: 1,
  mode: 'use',
  direction: new Vector(0, 0)
};
/**
 * 玩家所有的线
 */
let lines: UiBox[] = []
const uiBox_line = find('screen')?.uiBox_line as UiBox;
for (let i = 0; i < 60; i++) {
  lines.push(uiBox_line.clone())
}
lines.forEach(d => {
  d.visible = true
})
/**
 * 玩家所有的图像和其附属文字
 */
let pictures: UiImage[] = []
remoteChannel.onClientEvent(async (args2) => {
  const args = args2 as {
    type: string,
    data: any,
    size: number
  }
  if (args.type == '方向') {
    camera.direction = new Vector(args.data.x, args.data.y)
    camera.targerSize = args.size > 0.05 ? 0.5 : args.size < -0.05 ? 2 : 1
  }
  if (args.type == '加载量') {
    const uiImage_image = find('screen')?.uiImage_image as UiImage;
    for (let i = 0; i < args.data; i++) {
      const u = uiImage_image.clone()
      pictures.push(u);
      (u.findChildByName('inter') as UiImage).events.add('pointerdown', () => {
        if (i < maps.length) {
          remoteChannel.sendServerEvent({
            type: '互动',
            data: maps[i].id
          })
        }
      })
      remoteChannel.sendServerEvent({
        type: '提示',
        data: `加载UI中${i}/${args.data}`
      })
      await sleep(1)
    }
  }
  if (args.type == '摄像机锁定') {
    camera.mode = 'watch'
  }
  if (args.type == '摄像机开放') {
    camera.mode = 'use'
  }
  if (args.type == '摄像机位置') {
    camera.targetPosition = new Vector(args.data.x, args.data.y)
  }
  if (args.type == '地图') {
    const argdata = args.data as {
      scale: number;
      background: GamePictureAssets | '';
      entitys: {
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
         * 实体的名字
         */
        name: string;
        /**
         * 实体可互动距离
         */
        interactiveDistance: number;
        /**
         * 实体唯一id
         */
        id: number;
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
      }[]
    }
    mapR = argdata.scale
    let newMap: {
      position: Vector,
      scale: Vector,
      direction: Vector,
      image: GamePictureAssets | '',
      name: string,
      inter: boolean,
      opacity: number,
      id: number,
      backgroundcolor: {
        a: number,
        r: number,
        g: number,
        b: number
      }
    }[] = []
    argdata.entitys.forEach((e) => {
      newMap.push({
        position: e.position,
        scale: e.size,
        direction: e.face,
        image: e.image,
        name: e.name,
        inter: camera.position.distance(e.position, 'O') < e.interactiveDistance && e.enableInteraction,
        opacity: e.opacity,
        id: e.id,
        backgroundcolor: {
          a: e.backgroundcolor.a, r: e.backgroundcolor.r, g: e.backgroundcolor.g, b: e.backgroundcolor.b
        }
      })
    })
    maps = [...newMap]
  }
})
let fps = 0, lastFpsFresh = 0
setInterval(() => {
  if (Date.now() - lastFpsFresh < 200) {
    return
  } else {
    lastFpsFresh = Date.now()
  }
  let nowTime = Date.now()
  while (true) {
    if (Date.now() - nowTime > 0) {
      break
    }
  }
  let count = 0
  while (true) {
    count++
    if (Date.now() - nowTime > 1) {
      break
    }
  }
  fps = count - 0
}, 1200)
setInterval(() => {
  if (Date.now() - lastRefresh < 12) {
    return
  } else {
    lastRefresh = Date.now()
  }
  (async () => {
    //专门负责摄像机的数据处理
    if (camera.mode == 'use') {
      camera.targetPosition = camera.targetPosition.sub(camera.direction.by(10))
    }
    camera.position = camera.position.add(camera.targetPosition.sub(camera.position).by(0.2))
    camera.size += (camera.targerSize - camera.size) / 5
    if (camera.position.distance(new Vector(0, 0), 'O') > mapR) {
      camera.targetPosition = camera.position.sub(camera.position.by(1 - mapR / camera.position.distance(new Vector(0, 0), 'O')))
    }
  })();
  (async () => {
    await sleep(4)
    //专门负责地图边界
    for (let i = 0; i < lines.length; i++) {
      lines[i].rotation = i * 6 - 60
      lines[i].size.offset.x = mapR * 0.10472 * camera.size
      let x = mapR * Math.cos(6 * i * Math.PI / 180 + Math.PI / 6)
      let y = mapR * Math.sin(6 * i * Math.PI / 180 + Math.PI / 6)
      lines[i].position.offset.x = (x + camera.position.x) * camera.size
      lines[i].position.offset.y = (y + camera.position.y) * camera.size
    }
  })();
  (async () => {
    await sleep(8)
    //专门负责地图元素的渲染
    for (let i = 0; i < pictures.length; i++) {
      if (maps.length > i) {
        const af = () => {
          let text = i18n.t(maps[i].name as any);
          (pictures[i].findChildByName('text') as UiText).textContent = text ? text : maps[i].name;
          (pictures[i].findChildByName('inter') as UiImage).visible = maps[i].inter;
          let x = maps[i].scale.x * camera.size
          let y = maps[i].scale.y * camera.size
          pictures[i].position.offset.x = -(maps[i].position.x - camera.position.x) * camera.size
          pictures[i].position.offset.y = -(maps[i].position.y - camera.position.y) * camera.size
          pictures[i].size.offset.x = x
          pictures[i].size.offset.y = y;
          pictures[i].imageOpacity = maps[i].opacity;
          (pictures[i].findChildByName('text') as UiText).textFontSize = (x + y) / 10;
          pictures[i].rotation = Math.atan2(-maps[i].direction.y, -maps[i].direction.x) * (180 / Math.PI);;
          (pictures[i].findChildByName('text') as UiText).rotation = -pictures[i].rotation;
          (pictures[i].findChildByName('inter') as UiImage).rotation = -pictures[i].rotation;
          pictures[i].image = maps[i].image
          pictures[i].visible = true
          pictures[i].backgroundOpacity = maps[i].backgroundcolor.a
          pictures[i].backgroundColor.copy(Vec3.create({ r: maps[i].backgroundcolor.r, g: maps[i].backgroundcolor.g, b: maps[i].backgroundcolor.b }))
        }
        const bf = () => {
          let text = i18n.t(maps[i].name as any);
          (pictures[i].findChildByName('text') as UiText).textContent = text ? text : maps[i].name;
          (pictures[i].findChildByName('inter') as UiImage).visible = maps[i].inter;
          let x = maps[i].scale.x * camera.size
          let y = maps[i].scale.y * camera.size
          pictures[i].position.offset.x += ((-(maps[i].position.x - camera.position.x) * camera.size) - pictures[i].position.offset.x) / 5
          pictures[i].position.offset.y += ((-(maps[i].position.y - camera.position.y) * camera.size) - pictures[i].position.offset.y) / 5
          pictures[i].size.offset.x += (x - pictures[i].size.offset.x) / 5
          pictures[i].size.offset.y += (y - pictures[i].size.offset.y) / 5
          pictures[i].imageOpacity += (maps[i].opacity - pictures[i].imageOpacity) / 5;
          (pictures[i].findChildByName('text') as UiText).textFontSize += ((x + y) / 10 - (pictures[i].findChildByName('text') as UiText).textFontSize) / 5;
          pictures[i].rotation += (Math.atan2(-maps[i].direction.y, -maps[i].direction.x) * (180 / Math.PI) - pictures[i].rotation) / 5;
          (pictures[i].findChildByName('text') as UiText).rotation += (-pictures[i].rotation - (pictures[i].findChildByName('text') as UiText).rotation) / 5;
          (pictures[i].findChildByName('inter') as UiImage).rotation += (-pictures[i].rotation - (pictures[i].findChildByName('inter') as UiImage).rotation) / 5;
          pictures[i].image = maps[i].image
          pictures[i].visible = true
          pictures[i].backgroundOpacity += (maps[i].backgroundcolor.a - pictures[i].backgroundOpacity) / 5
          pictures[i].backgroundColor.copy(Vec3.create({ r: maps[i].backgroundcolor.r, g: maps[i].backgroundcolor.g, b: maps[i].backgroundcolor.b }))
        }
        if (Vector.distance(new Vector(pictures[i].position.offset.x, pictures[i].position.offset.y), new Vector(-(maps[i].position.x - camera.position.x) * camera.size, -(maps[i].position.y - camera.position.y) * camera.size), 'O') < 100) {
          bf()
        } else {
          af()
        }
      } else {
        if (!pictures[i].visible) {
          break
        }
        pictures[i].visible = false
      }
    }
  })()
  //负责运行数据显示同步
  const uiText_dataShow = find('screen')?.uiText_dataShow as UiText;
  uiText_dataShow.textContent = `${maps.length}/${pictures.length}(${Math.round(maps.length / pictures.length * 1000) / 10}%)
${fps}f/ms
${(Math.round(100 * camera.position.x)) / 100},${(Math.round(100 * camera.position.y)) / 100}/${(Math.round(100 * camera.size)) / 100}`
}, 24)
setInterval(() => {
  //负责反触发
  remoteChannel.sendServerEvent({
    type: '触发'
  })
}, 1000)
let mouseLast = 0
const uiBox_background = find('screen')?.uiBox_background as UiBox;
uiBox_background.events.add('pointerdown', async () => {
  mouseLast = Date.now()
  await sleep(1000)
  if (Date.now() - mouseLast > 950) {
    input.lockPointer()
  }
})
uiBox_background.events.add('pointerup', () => {
  mouseLast = Date.now()
})