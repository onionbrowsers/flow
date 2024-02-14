import G6 from '@antv/g6'
import { getOverflowText, isDef } from '@/utils/utils'
import insertCss from 'insert-css'

insertCss(`
  .g6-component-tooltip {
    background-color: rgba(0,0,0, 0.65);
    padding: 10px;
    box-shadow: rgb(174, 174, 174) 0px 0px 10px;
    width: fit-content;
    color: #fff;
    border-radius = 4px;
  }
`)
export const getDefaultConfig = ({ width, height }) => {
  return {
    width,
    height,
    modes: {
      default: ['zoom-canvas', 'drag-canvas']
    },
    fitView: false,
    animate: true,
    defaultNode: {
      type: 'flow-rect',
    },
    defaultEdge: {
      type: 'polyline',
      style: {
        lineWidth: 2,
        stroke: '#5B8FF9',
        endArrow: 'vee',
      },
    },
    layout: {
      type: 'compactBox',
      direction: 'TB',
      getId: function getId (d) {
        return d.id + ''
      },
      getHeight: function getHeight () {
        return 20
      },
      getWidth: function getWidth () {
        return 16
      },
      getVGap: function getVGap () {
        return 60
      },
      getHGap: function getHGap () {
        return 110
      },
    },
  }
}

export const graphConfg = {
  padding: [20, 50],
  defaultLevel: 3,
  defaultZoom: 0.8,
  renderer: 'svg',
  modes: { default: ['zoom-canvas', 'drag-canvas'] },
}

export const tooltip = new G6.Tooltip({
  offsetX: 20,
  offsetY: 30,
  itemTypes: ['node'],
  // 自定义 tooltip 内容
  getContent: (e) => {
    const outDiv = document.createElement('div')
    // outDiv.style.padding = '0px 0px 20px 0px';
    const { name, number } = e.item.getModel()
    let formatedNodeName = ''
    for (let i = 0; i < name.length; i++) {
      formatedNodeName = `${formatedNodeName}${name[i]}`
      if (i !== 0 && i % 20 === 0) formatedNodeName = `${formatedNodeName}<br/>`
    }
    const str = !isDef(number) ? '' : `人数：${number || 0}<br/>`
    outDiv.innerHTML = `组织名称：${name}<br/>` + str // `${formatedNodeName}`;
    return outDiv
  },
  shouldBegin: (e) => {
    if (e.target.get('name') === 'name-shape' || e.target.get('name') === 'number-shape') return true
    return false
  },
})

// 自定义节点、边
export const registerFn = (virtualEl) => {
  /**
   * 自定义节点
   */
  G6.registerNode(
    'flow-rect',
    {
      shapeType: 'flow-rect',
      draw (cfg, group) {
        const {
          name = '',
          number,
          collapsed
        } = cfg

        const rectConfig = {
          width: 210,
          height: 60,
          lineWidth: 1,
          fontSize: 12,
          fill: '#5B8FF9',
          radius: 4,
          stroke: '#CED4D9',
          opacity: 1,
        }

        const nodeOrigin = {
          x: -rectConfig.width / 2,
          y: -rectConfig.height / 2,
        }

        const textConfig = {
          textAlign: 'center',
          textBaseline: 'bottom',
        }

        const rect = group.addShape('rect', {
          attrs: {
            x: nodeOrigin.x,
            y: nodeOrigin.y,
            ...rectConfig,
          },
        })

        const rectBBox = rect.getBBox()
        // label title
        group.addShape('text', {
          attrs: {
            ...textConfig,
            x: 0,
            y: 26 + nodeOrigin.y,
            text: getOverflowText(virtualEl, name),
            fontSize: 18,
            fontWeight: 700,
            fill: '#fff',
          },
          // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
          name: 'name-shape',
        })
        const fnStr = `;location.href='/company/org/staff-manage?select_org_id=${cfg.id}&flag=1'`
        group.addShape('dom', {
          attrs: {
            // ...textConfig,
            x: -30,
            width: 200,
            height: 70,
            y: 0, // rectBBox.maxY - 14,
            // text: !isDef(number) ? '' : '人数：' + (number || 0),
            // fontWeight: 700,
            // fontSize: 14,
            // fill: '#fff',
            // cursor: 'pointer',
            html: `
              <div style="font-weight: 700; font-size: 14px; cursor: pointer;">
                <span style="color:#fff; text-decoration:underline" onclick="${isDef(number) ? fnStr : ''}">${!isDef(number) ? '' : '人数：' + (number || 0)}</span>
              </div>
          `,
          },
          name: 'number-shape',
        })

        // collapse rect
        if (cfg.children && cfg.children.length) {
          group.addShape('rect', {
            attrs: {
              x: -8,
              y: rectConfig.height / 2 - 10,
              width: 16,
              height: 16,
              stroke: 'rgba(0, 0, 0, 0.25)',
              cursor: 'pointer',
              fill: '#fff',
            },
            name: 'collapse-back',
            modelId: cfg.id,
          })

          // collpase text
          group.addShape('text', {
            attrs: {
              x: 0.5,
              y: rectConfig.height / 2 - 4,
              textAlign: 'center',
              textBaseline: 'middle',
              text: collapsed ? '+' : '-',
              fontSize: 16,
              cursor: 'pointer',
              fill: 'rgba(0, 0, 0, 0.25)',
            },
            // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
            name: 'collapse-text',
            modelId: cfg.id,
          })
        }

        this.drawLinkPoints(cfg, group)
        return rect
      },
      setState (name, value, item) {
        if (name === 'collapse') {
          const group = item.getContainer()
          const collapseText = group.find((e) => e.get('name') === 'collapse-text')
          if (collapseText) {
            if (!value) {
              collapseText.attr({
                text: '-',
              })
            } else {
              collapseText.attr({
                text: '+',
              })
            }
          }
        }
      },
      getAnchorPoints () {
        return [
          [0.5, 0],
          [0.5, 1],
        ]
      },
    },
    'rect',
  )
}
