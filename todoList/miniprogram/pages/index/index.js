import common from '../../utils/common.js'

const app = getApp()

Page({
  data: {
    delay: true,
    menus: [
      {
        className: 'menu-one',
        animation: 'fadeInDown',
        content: '1'
      },
      {
        className: 'menu-two',
        animation: 'fadeInRight',
        content: '2'
      },
      {
        className: 'menu-three',
        animation: 'fadeInUp',
        content: '3'
      },
      {
        className: 'menu-four',
        animation: 'fadeInRight',
        content: '4'
      }
    ]
  },

  

})
