const Router = require('koa-router')
const { TokenValidator } = require('@validators')
const { User } = require('@models/user')
const { generateToken } = require('@core/util')
const { Auth } = require('@middlewares/auth')
const { WXManager } = require('@services/wx')
const WXCloudApi = require('@services/wx-cloud')
const router = new Router({
    prefix: '/v1/token' // url路由前缀
})

// router.get('/', async ctx => {
//     try {
//         const accessToken = await WXManager.getAccessToken()
//         const data = await WXCloudApi.findByQuery({
//             collection: 'fun',
//             where: {
//                 hits: 1
//             }
//         })
//         ctx.body = data.data
//     } catch (e) {}
// })

router.post('/', async ctx => {
    const v = await new TokenValidator().validate(ctx)
    const accessToken = await WXManager.getAccessToken()
    const user = await User.verifyEmailPassword(
        v.get('body.account'),
        v.get('body.secret')
    )
    const token = generateToken(user.id, Auth.USER)
    ctx.body = {
        token
    }
})

router.post('/verify', async ctx => {
    // token
    const v = await new NotEmptyValidator().validate(ctx)
    const result = Auth.verifyToken(v.get('body.token'))
    ctx.body = {
        is_valide: result
    }
})

module.exports = router
