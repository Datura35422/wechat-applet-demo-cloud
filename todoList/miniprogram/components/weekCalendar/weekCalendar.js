import util from '../../utils/util.js'

let customData = {
  current: {
    week: new Date().getDay(),
    day: new Date().getDate(),
    date: util.formatDateTime(new Date())
  }
}

Component({
  properties: {
    type: {
      type: String,
      value: 'week'
    }
  },

  data: {
    weeksTitle: ['日', '一', '二', '三', '四', '五', '六'],
    weeks:[],
    currentItem: 1
  },

  lifetimes: {
    attached() {
      this.init()
      this.getBeforeWeek()
      this.getCurrentWeek()
      this.getNextWeek()
    }
  },

  methods: {
    init() {
      Object.assign(customData, {
        beforeDate: new Date(new Date().setDate(customData.current.day + (0 - customData.current.week))),
        nextDate: new Date(new Date().setDate(customData.current.day + (0 - customData.current.week)))
      })
    },
    getCurrentWeek() {
      const sunday = new Date().setDate(customData.current.day + (0 - customData.current.week ) )
      this.getWeeks('current', new Date(sunday))
    },
    getBeforeWeek() {
      const beforeDate = customData.beforeDate
      this.getWeeks('before', beforeDate.setDate(beforeDate.getDate() - 7))
    },
    getNextWeek() {
      const nextDate = customData.nextDate
      this.getWeeks('next', nextDate.setDate(nextDate.getDate() + 7))
    },
    getWeeks(opt, date) {
      let weeks = []
      for (let i = 0; i < 7; i++) {
        weeks.push({
          index: i,
          year: this.getPartDate('year', date, i),
          month: this.getPartDate('month', date, i),
          day: this.getPartDate('day', date, i),
          date: this.getPartDate('date', date, i),
          selected: opt === 'current' ? i === customData.current.week : i === 0
        })
      }
      opt === 'before' ? this.data.weeks.unshift(weeks) : this.data.weeks.push(weeks)
      this.setData({
        weeks: this.data.weeks,
        currentItem: opt === 'before' ? 1 : this.data.currentItem
      })
    },
    getPartDate(part, date, dayCount) { // 获取dayCount天后的日期
      const newDate = new Date(date)
      newDate.setDate(newDate.getDate() + dayCount)
      let partDate = newDate.getDate()
      switch (part) {
        case 'year':
          partDate = newDate.getFullYear()
          break
        case 'month':
          partDate = newDate.getMonth() + 1
          break
        case 'day':
          partDate = newDate.getDate()
          break
        case 'date':
          partDate = util.formatDateTime(newDate)
          break
        default:
          break
      }
      return partDate
    },
    selectDay(e) {
      const index = e.currentTarget.dataset.index
      const currentItem = this.data.currentItem
      let selectedDate = ''
      const week = this.data.weeks[currentItem].map(item => {
        item.selected = item.index === index
        if (item.index === index) {
          selectedDate = `${item.year}-${util.formatNumber(item.month)}-${util.formatNumber(item.day)}`
        }
        return item
      })
      this.setData({
        [`weeks[${currentItem}]`]: week
      })
      this.onUpdate(selectedDate, this.data.weeks[currentItem][0].date)
    },
    onChange(e) {
      const current = e.detail.current
      this.data.currentItem = current
      const selected = this.data.weeks[current].filter(item => item.selected)[0]
      if (selected) {
        const selectedDate = `${selected.year}-${util.formatNumber(selected.month)}-${util.formatNumber(selected.day)}`
        this.onUpdate(selectedDate, this.data.weeks[current][0].date)
      }
      if (current === this.data.weeks.length - 1) {
        this.getNextWeek()
      } else if (current === 0) {
        this.getBeforeWeek()
      }
    },
    onUpdate(date, begin, opt) {
      this.triggerEvent('update', {
        date,
        begin, // 当前周的第一天（周日）
        opt: 'switch'
      })
    }
  }
})
