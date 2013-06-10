
device =
  type: window.navigator.userAgent.match /(iPhone|iPod|iPad|Android|BlackBerry)/
  size: null
  clickEvent: null

device.clickEvent = if device.type? then 'touchend' else 'click'

onResize = -> device.size = width: $(window).innerWidth(), height: $(window).innerHeight()

$(window).on 'resize', onResize

onResize()

module.exports =

  getType: -> device.type

  getSize: -> device.size

  getCenter: -> x: device.size.width / 2, y: device.size.height / 2
