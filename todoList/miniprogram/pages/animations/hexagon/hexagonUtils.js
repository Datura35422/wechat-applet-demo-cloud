const calculateStyle = (sideSize, imgSize) => {
  // 以每个圆心为六边形顶端
  const wrapWidth = sideSize * 2 + imgSize
  const wrapHeight = Math.ceil(sideSize / 2 * Math.sqrt(3)) * 2 + imgSize
  const wrapStyle = `width: ${wrapWidth}rpx; height: ${wrapHeight}rpx; background-size: ${wrapWidth - imgSize}rpx ${wrapHeight - imgSize}rpx`
  const sideStyle = `padding: 0 ${sideSize / 2}rpx; height: ${imgSize}rpx;`
  const centerStyle = `height: ${wrapHeight - imgSize * 2}rpx`
  return {
    wrapStyle,
    sideStyle,
    centerStyle
  }
}

module.exports = {
  calculateStyle
}