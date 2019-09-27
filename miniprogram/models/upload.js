import common from '../utils/common'
/**
 * Upload
 * 文件上传类
 */
class Upload {

  uploadFile(data = {}) {
    return new Promise((resolve, reject) => {
      this._uploadFile(data, resolve, reject)
    })
  }

  _uploadFile(data, resolve, reject) {
    wx.cloud.uploadFile({
      ...data,
      success: res => {
        if (res && res.statusCode.toString().startsWith('2')) {
          resolve(res)
        } else {
          reject()
          common.showToast({ title: '上传失败' })
        }
      },
      fail: err => {
        reject(err)
        common.showToast({ title: '上传失败' })
      }
    })
  }
}

export default Upload
