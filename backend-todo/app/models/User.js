const bcrypt = require('bcryptjs')
const { WXCloudApi } = require('@services/wx-cloud')
class User {
    static async verifyEmailPassword(email, plainPassword) {
        const user = await WXCloudApi.findByQuery({
            where: {
                email
            }
        })
        if (!user) {
            throw new global.errs.NotFound('用户不存在')
        }
        const correct = bcrypt.compareSync(plainPassword, user.password)
        if (!correct) {
            throw new global.errs.AuthFailed('密码不正确')
        }
        return user
    }
}

module.exports = {
    User
}
