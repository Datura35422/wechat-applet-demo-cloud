import common from '../utils/common.js'
const tips = {
  1: '网络错误'
}

class Cloud {
  callFunction(data = {} ) {
    return new Promise((resolve, reject) => {
      this._callFunction(data, resolve, reject)
    })
  }

  _callFunction(data, resolve, reject) {
    wx.cloud.callFunction({
      ...data,
      success: res => {
        if (res) {
          resolve(res.result)
        } else {
          reject()
        }
      },
      fail: err => {
        reject(err)
        // this._showError(1)
      }
    })
  }

  _showError(error_code) {
    if (!error_code) {
      error_code = 1;
    }
    const tip = tips[error_code]
    common.showToast({ title: tip ? tip : tips[1] })
  }
}

export default Cloud