
# This module provides information about the device

# Gets device type from browser agend from supported ones
deviceType = window.navigator.userAgent.match /(iPhone|iPod|iPad|Android|BlackBerry)/

device =
  type: deviceType	# Returning null assumes device is not mobile
  size: null		# Device screen size

# Updates screen size when device resizes
onResize = -> device.size = width: $(window).innerWidth(), height: $(window).innerHeight()
$(window).on 'resize', onResize

# Executes once to populate device size
onResize()

module.exports =

  getType: -> device.type

  getSize: -> device.size

  getCenter: -> x: device.size.width / 2, y: device.size.height / 2
