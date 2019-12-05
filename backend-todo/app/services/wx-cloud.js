const util = require('util')
const axios = require('axios')

const url = {
    databaseQuery: {
        methods: 'POST',
        url: 'https://api.weixin.qq.com/tcb/databasequery?access_token=%s'
    }
}

class WXCloudApi {
    static async findByQuery({ collection, where = {}, limit = 10, skip = 1 }) {
        const query = {
            env: global.config.wx.env,
            query: `db.collection('${collection}').where({${objToStr(
                where
            )}}).limit(${limit}).skip(${skip}).get()`
        }
        const url = `https://api.weixin.qq.com/tcb/databasequery?access_token=${global.config.wx.accessToken}`
        const result = await axios.post(url, query)
        if (result.status !== 200) {
            throw new global.errs.ParameterException('云开发请求失败')
        } else if (result.data.errcode !== 0) {
            throw new global.errs.ParameterException(
                `${result.data.errcode}: ${result.data.errmsg}`
            )
        }
        return result.data
    }
}

const objToStr = obj => {
    let str = ''
    if (Object.keys(obj).length === 0) {
        return ''
    }
    for (let key in obj) {
        str += `${str !== '' ? ',' : ''}${key}:${obj[key]}`
    }
    return str
}

module.exports = WXCloudApi
