import util from '../../utils/util.js'

let customData = {}

Component({
  properties: {

  },

  data: {
    currentDate: '2019-09',
    weeksTitle: ['日', '一', '二', '三', '四', '五', '六'],
    months: [],
    currentItem: 1
  },

  lifetimes: {
    attached() {
      this.init()
      this.getBeforeMonth()
      this.getCurrentMonth()
      this.getNextMonth()
    }
  },

  methods: {
    init() {
      Object.assign(customData, {
        monthArr: [],
        beforeMonth: new Date(),
        nextMonth: new Date(),
        current: {
          year: new Date().getFullYear(),
          month: new Date().getMonth(),
          day: new Date().getDate()
        }
      })
    },
    getCurrentMonth() {
      const date = new Date()
      this.setData({
        currentDate: `${date.getFullYear()}-${util.formatNumber(date.getMonth() + 1)}`
      })
      this.getMonthsData('current', date)
    },
    getBeforeMonth() {
      const beforeDate = new Date(customData.beforeMonth)
      const date = new Date(beforeDate.setMonth(beforeDate.getMonth() - 1))
      customData.beforeMonth = date
      this.getMonthsData('before', date)
    },
    getNextMonth() {
      const nextDate = new Date(customData.nextMonth)
      const date = new Date(nextDate.setMonth(nextDate.getMonth() + 1))
      customData.nextMonth = date
      this.getMonthsData('next', date)
    },
    getMonthsData(opt, date) {
      const year = date.getFullYear()
      const month = date.getMonth()
      const key = `${year}-${util.formatNumber(month + 1)}`
      const monthBegin = util.formatDateTime(new Date(year, month, 1)) // 当前月长度第一天
      const monthEnd = util.formatDateTime(new Date(year, month + 1, 0)) // 当前月长度最后一天
      this.getTodoList(monthBegin, monthEnd, key)
      this.getMonths(opt, year, month, key)
    },
    getMonths(opt, year, month, key) {
      const daysLen = new Date(year, month + 1, 0).getDate() // 当前月长度， 当前月最后一天
      const firstWeek = new Date(year, month, 1).getDay()
      let months = firstWeek > 0 ? this.getLastMonthDays(year, month, firstWeek) : []
      months = months.concat(this.getCurrentMonthDays(year, month, firstWeek))
      months = months.concat(this.getNextMonthDays(year, month, daysLen + firstWeek))
      opt === 'before' ? this.data.months.unshift(months) : this.data.months.push(months)
      opt === 'before' ? customData.monthArr.unshift(key) : customData.monthArr.push(key)
      this.setData({
        months: this.data.months,
        currentItem: opt === 'before' ? 1 : this.data.currentItem
      })
    },
    getLastMonthDays(year, month, week) {
      let months = []
      const lastMonthDate = new Date(year, month, 0).getDate() // 上一个月长度， 上一个月最后一天
      for (let i = week; i > 0; i--) {
        const day = lastMonthDate - i + 1
        months.push({
          index: week - i,
          year,
          month,
          day,
          date: `${year}-${util.formatNumber(month)}-${util.formatNumber(day)}`,
          className: 'disabled',
          hasTodo: false
        })
      }
      return months
    },
    getCurrentMonthDays(year, month, week) {
      const daysLen = new Date(year, month + 1, 0).getDate() // 当前月长度， 当前月最后一天
      let months = []
      const currentMonth = month + 1
      for (let i = 0; i < daysLen; i++) {
        const selected = year === customData.current.year && month === customData.current.month && i + 1 === customData.current.day
        const day = i + 1
        months.push({
          index: i + week,
          year,
          month: currentMonth,
          day,
          date: `${year}-${util.formatNumber(currentMonth)}-${util.formatNumber(day)}`,
          className: selected ? 'selected' : '',
          hasTodo: false
        })
      }
      return months
    },
    getNextMonthDays(year, month, len) {
      const lastDay = new Date(year, month + 1, 0).getDay() + 1 // 当前月长度， 当前月最后一天
      const lastMonth = month + 2
      let months = []
      for (let i = lastDay; i < 7; i++) {
        const day = i - lastDay + 1
        months.push({
          index: len + i - 2,
          year,
          month: lastMonth,
          day,
          date: `${year}-${util.formatNumber(lastMonth)}-${util.formatNumber(day)}`,
          className: 'disabled',
          hasTodo: false
        })
      }
      return months
    },
    getTodoList(begin, end, key) {
      wx.cloud.callFunction({
        name: 'todoOpt',
        data: {
          opt: 'getMonthTodo',
          dateRange: {
            begin,
            end
          }
        },
        success: res => {
          const data = res.result.list
          if (data.length > 0) {
            const index = customData.monthArr.indexOf(key)
            const month = this.data.months[index]
            let dateSet = new Set()
            data.map(item => {
              dateSet.add(item._id)
            })
            month.map(item => item.hasTodo = dateSet.has(item.date))
            this.setData({
              [`months[${index}]`]: month
            })
          }
        },
        fail: err => {
          common.showToast({ title: '获取数据失败' })
          console.error('[云函数] [todoOpt] 调用失败：', err)
        }
      })
    },
    onChange(e) {
      const index = e.detail.current
      this.data.currentItem = index
      this.onUpdate(customData.monthArr[index])
      this.setData({
        currentDate: customData.monthArr[index]
      })
      if (index === this.data.months.length - 1) { // 最后一个
        this.getNextMonth()
      } else if (index === 0) { // 第一个
        this.getBeforeMonth()
      }
    },
    onUpdate(date) {
      this.triggerEvent('update', {
        date,
        opt: 'switch'
      })
    }
  }
})
