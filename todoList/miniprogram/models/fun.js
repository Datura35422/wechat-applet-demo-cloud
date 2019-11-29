import Model from './model'

/**
 * Fun 模型类
 */
class Fun extends Model {
  constructor() {
    super()
  }

  getRandomOne() {
    return this.callFunction({
      name: 'funOpt',
      data: {
        opt: 'randomOne'
      }
    })
  }

  hitOne(id) {
    return this.callFunction({
      name: 'funOpt',
      data: {
        opt: 'hitOne',
        id
      }
    })
  }

}

export default Fun
