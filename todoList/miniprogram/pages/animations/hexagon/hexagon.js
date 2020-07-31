import util from './hexagonUtils'
Page({
  data: {
    hexagonItem: {
      topLeft: '/assets/icons/cancel.png',
      centerLeft: '/assets/icons/cancel.png'
    },
    hexagonItemSize: {
      sideSize: 64,
      imgSize: 32
    },
    hexagonStyle: {
      wrap: '',
      item: '',
      side: '',
      center: ''
    },
    hexagonSize: {
      sideSize: 160,
      imgSize: 64
    },
    hexagonPosition: {
      topLeft: '',
      topRight: '',
      centerLeft: '',
      centerRight: '',
      bottomLeft: '',
      bottomRight: ''
    }
  },
  onLoad() {
    this.calculateStyle()
  },
  calculateStyle() {
    const hexagonSize = this.data.hexagonSize
    const { sideSize, imgSize } = this.data.hexagonItemSize
    const itemWidth = sideSize * 2 + imgSize
    const itemHeight = Math.ceil(sideSize / 2 * Math.sqrt(3)) * 2 + imgSize
    const left = hexagonSize.sideSize - itemWidth
    const halfHeight = itemHeight / 2
    const halfWidth = itemWidth / 2
    this.setData({
      hexagonPosition: {
        topLeft: `top: -${halfHeight}rpx; left: ${left}rpx`,
        topRight: `top: -${halfHeight}rpx; right: ${left}rpx`,
        centerLeft: `left: -${halfWidth}rpx;`,
        center: `transform: translate(-50%, -50%);`,
        centerRight: `right: -${halfWidth}rpx;`,
        bottomLeft: `bottom: -${halfHeight}rpx; left: ${left}rpx`,
        bottomRight: `bottom: -${halfHeight}rpx; right: ${left}rpx`
      }
    })
    console.log(itemWidth, left)
  }

  
})