import common from '../../utils/common.js'

const app = getApp()

Page({
  data: {
    delay: true,
    menus: [
      {
        className: 'menu-one',
        animation: 'fadeInDown',
        content: 'TODO',
        url: '/pages/todoType/todoType',
        openType: 'switchTab' // 'navigate'
      },
      {
        className: 'menu-two',
        animation: 'fadeInRight',
        content: 'NOTE',
        url: '/pages/noteList/noteList',
        openType: 'switchTab'
      },
      {
        className: 'menu-three',
        animation: 'fadeInUp',
        content: 'ANIMATION',
        url: '/pages/animations/animationTypes/animationTypes',
        openType: 'navigateTo'
      },
      {
        className: 'menu-four',
        animation: 'fadeInRight',
        content: '4'
      }
    ]
  }
})
