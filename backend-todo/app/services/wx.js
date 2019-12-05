const util = require('util') // nodejs中自带的帮助工具
const axios = require('axios')

class WXManager {
    static async getAccessToken() {
        const url = util.format(
            global.config.wx.tokenUrl,
            global.config.wx.appId,
            global.config.wx.appSecret
        )
        const result = await axios.get(url)

        if (result.status !== 200) {
            throw new global.errs.AuthFailed('accessToken获取失败')
        }
        if (!result.data.access_token) {
            throw new global.errs.AuthFailed(result.data.errmsg)
        }
        global.config.wx.accessToken = result.data.access_token
        return result.data.access_token
    }
}

module.exports = {
    WXManager
}
