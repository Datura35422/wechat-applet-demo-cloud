import Fun from '../../models/fun.js'
import common from '../../utils/common.js'

const funModel = new Fun()

Page({
  data: {
    fun: {},
    menus: [
      {
        iconUrl: '/assets/icons/piece.png',
        title: '我的计划'
      },
      {
        iconUrl: '/assets/icons/checklist.png',
        title: '已完成TODO'
      }
    ]
  },
  customDate: {
    touch: {
      pageX: null,
      pageY: null,
      click: 0
    }
  },
  onLoad() {
    this.getFun()
  },
  onReady() {
    const _this = this;
    wx.onAccelerometerChange(res => {
      let angle = -(res.x * 30).toFixed(1);
      if (angle > 14) { angle = 14; }
      else if (angle < -14) { angle = -14; }
      if (_this.data.angle !== angle) {
        _this.setData({
          angle: angle
        });
      }
    });
  },

  getFun() {
    funModel.getRandomOne().then(res => {
      if (res.list) {
        const data = res.list[0]
        this.setData({
          fun: data
        })
      } 
    })
  },
  hit() {
    funModel.hitOne(this.data.fun._id).then(res => {
      common.showToast({title: '点赞成功'})
    })
  },
  touchStartPage(e) {
    const { pageX, pageY } = e.changedTouches[0]
    Object.assign(this.customDate.touch, {
      pageX,
      pageY
    })
  },
  touchEndPage(e) {
    const { pageX, pageY } = e.changedTouches[0]
    const touchStart = this.customDate.touch
    if (touchStart.pageX !== null && touchStart.pageY !== null) {
      if (pageX - touchStart.pageX > 0) {
        this.getFun()
      } else if (pageX === touchStart.pageX) {
        touchStart.click++
        touchStart.click === 2 && this.hit()
      }
    }
  },
});