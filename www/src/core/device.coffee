
device =
	type: window.navigator.userAgent.match /(iPhone|iPod|iPad|Android|BlackBerry)/
	size: null
	clickEvent: null

device.clickEvent = if device.type? then 'touchend' else 'click'

onResize = -> device.size = width: $(window).innerWidth(), height: $(window).innerHeight()

$(window).on 'resize', onResize

onResize()

module.exports =

	get: (prop) ->
		switch prop
			when 'type' then return device.type
			when 'size' then return device.size
			when 'clickEvent' then return device.clickEvent
			when 'center' then x: device.size.width / 2, y: device.size.height / 2