module.exports = {
    environment: 'dev', // prod
    security: {
        secretKey: 'abcdefg',
        expiresIn: 60 * 60 * 24 * 30 // token过期时间
    },
    wx: {
        accessToken: '',
        env: 'test-l2otv',
        appId: 'wx80f38683fbccf188',
        appSecret: '399de50ef63b8b6e618cbba66cab98c3',
        // %s占位符
        tokenUrl:
            'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=%s&secret=%s',
        loginUrl:
            'https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code'
    },
    host: 'http://localhost:3000/'
}
