import util from '../../pages/animations/hexagon/hexagonUtils'
Component({
  properties: {
    items: {
      type: Object,
      value: {}
    },
    sidesize: {
      type: Number,
      value: 0
      // observer: function(newVal, oldVal) {
      //   console.log(newVal, oldVal, this.properties.items)
      //   const side = newVal || oldVal
      // }
    },
    imgsize: {
      type: Number,
      value: 0
    }
  },
  observers: {
    'sidesize, imgsize'(sidesize, imgsize) {
      console.log(sidesize, imgsize)
      const imgStyle = `width: ${imgsize}rpx; height: ${imgsize}rpx;`
      // 以每个圆心为六边形顶端
      // const wrapWidth = sidesize * 2 + imgsize
      // const wrapHeight = Math.ceil(sidesize / 2 * Math.sqrt(3)) * 2 + imgsize
      // const wrapStyle = `width: ${wrapWidth}rpx; height: ${wrapHeight}rpx; background-size: ${wrapWidth - imgsize}rpx ${wrapHeight - imgsize}rpx`
      // const sideStyle = `padding: 0 ${sidesize / 2}rpx; height: ${imgsize}rpx;`
      // const centerStyle = `height: ${wrapHeight - imgsize * 2}rpx`
      const { wrapStyle, sideStyle, centerStyle } = util.calculateStyle(sidesize, imgsize)
      this.setData({
        imgStyle,
        wrapStyle,
        sideStyle,
        centerStyle
      })
      console.log(imgStyle, wrapStyle, sideStyle, centerStyle)
    }
  },

  data: {
    wrapStyle: '',
    sideStyle: '',
    centerStyle: '',
    imgStyle: ''
  },

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached() { 
      console.log('attached', this.data.items)
      
    },
    moved() { 
      console.log('moved')
    },
    detached() { 
      console.log('detached')
    }
  },

  methods: {

  }
})
