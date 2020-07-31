Page({
  data: {
    show: {
      modal: false,
      star: false,
      spin: false
    },
    delay: true,
    typeItem: [
      {
        class: "year",
        type: 'star',
        name: '半圆路径'
      },
      {
        class: "month",
        type: 'spin',
        name: '旋转'
      },
      {
        class: "day",
        type: 'canvas',
        name: 'canvas'
      },
      {
        class: "year",
        type: 'hexagon',
        name: '六边形'
      }
    ],
    ani: {
      spin: null
    },
    spinAnimation: null,
    interval: null
  },

  onLoad() {
    this.data.spinAnimation = wx.createAnimation({
      duration: 1400,
      timingFunction: 'linear', // "linear","ease","ease-in","ease-in-out","ease-out","step-start","step-end"
      delay: 0,
      transformOrigin: '50% 50% 0',
      success: function(res) {
        console.log(res)
      }
    })
  },

  handleShow(e) {
    const type = e.currentTarget.dataset.type
    switch (type) {
      case 'canvas': 
        wx.navigateTo({
          url: '/pages/animations/canvas/canvas'
        })
        break
      case 'hexagon': 
        wx.navigateTo({
          url: '/pages/animations/hexagon/hexagon'
        })
        break
      case 'spin': 
        this.handleSpinAni()
      default:
        this.setData({
          [`show.modal`]: true,
          [`show.${type}`]: true
        })
        break
    }
  },

  handleModal() {
    this.setData({
      [`show.modal`]: false
    })
  },
  handleSpinAni() {
    const ani = this.data.spinAnimation
    let n = 1
    this.interval = setInterval(() => {
      ani.rotate(180*(n)).step()
      console.log("rotate=="+n)
      this.setData({
        ['ani.spin']: ani.export()
      })
      n += 1
      if (n === 5) {
        clearInterval(this.interval)
      }
    }, 1400)
  },
})