
Page({
  data: {
    typeItem: [
      {
        index: 0,
        type: 'year',
        name: '年计划',
        path: ''
      },
      {
        index: 1,
        type: 'month',
        name: '月计划',
        path: '/pages/todoMonth/todoMonth'
      },
      {
        index: 2,
        type: 'week',
        name: '周计划',
        path: '/pages/todoWeek/todoWeek'
      },
      {
        index: 3,
        type: 'day',
        name: '日计划',
        path: '/pages/todoDay/todoDay'
      }
    ]
  },

  toPath(e) {
    const path = e.currentTarget.dataset.path
    path && wx.navigateTo({
      url: path,
    })
  }
})