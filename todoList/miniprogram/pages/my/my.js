import Fun from '../../models/fun.js'
import common from '../../utils/common.js'

const funModel = new Fun()

Page({
  data: {
    fun: {}
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

  next() {
    this.getFun()
  },

  hit() {
    funModel.hitOne(this.data.fun._id).then(res => {
      common.showToast({title: '点赞成功'})
    })
  }
});