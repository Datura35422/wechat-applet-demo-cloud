import { CreateCanvas, SelectorCanvas, SelectorWebgl } from './wechat-demo'

Page({
  data: {},

  onReady() {
    new CreateCanvas('canvas').handleCreateCanvas()
    new SelectorCanvas('canvas2').handleSelectorCanvas()
    new SelectorWebgl('canvas3').handleSelectorWebgl()
  },
  
  handleTouchStart(e) {
    console.log('handleTouchStart', e)
  },

  handleError(res) {
    console.log('handleError', res)
  }
})