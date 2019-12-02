const showToast = ({ title, icon = 'none', image = '', duration = 2000, success, fail }) => {
  wx.showToast({
    title: title,
    icon: icon,
    image: image,
    duration: duration,
    success() {
      success && success()
    },
    fail() {
      fail && fail()
    }
  })
}

const showModal = ({ title, content, confirmText = '确定', success, fail }) => {
  wx.showModal({
    title: title,
    content: content,
    confirmText: confirmText,
    confirmColor: '#E46C78',
    success(res) {
      if (res.confirm) {
        success && success.confirm && success.confirm()
      } else if (res.cancel) {
        success && success.cancel && success.cancel()
      }
    },
    fail() {
      fail && fail()
      success && success.cancel && success.cancel()
    }
  })
}

const setStore = (key, data) => {
  wx.setStorage({
    key: key,
    data: data,
    success(res) { },
    fail(res) { },
    complete(res) { },
  })
}

const getStoreSync = (key) => {
  return wx.getStorageSync(key)
}


export default {
  showToast,
  showModal,
  setStore,
  getStoreSync
}