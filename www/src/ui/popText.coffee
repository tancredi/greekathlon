
renderer = require '../core/renderer'
device = require '../core/device'

defaults =
	classNames: ''
	duration: 1500
	move: [ 0, 80 ]
	scaleStart: 1
	scale: 1.7
	endScale: 1
	text: false
	target: null
	wait: 1
	easeIn: 'easeInQuart'
	easeOut: 'easeOutQuart'
	callback: null
	offset: [ 0, 0 ]
	z: null

module.exports =

	popText: (options) ->
		options = $.extend true, {}, defaults, options
		context =
			'class-names': options.classNames
			'text': options.text

		target = options.target

		element = $ renderer.render 'partials/ui/pop-text', context
		element.css opacity: 0
		element.appendTo $ 'body'

		if options.center
			deviceSize = device.get 'size'
			position =
				x: deviceSize.width / 2 - element.width() / 2
				y: deviceSize.height / 2 - element.height() / 2
		else
			targetPos = target.offset()
			position =
				x: targetPos.left + target.width() / 2 - element.width() / 2
				y: targetPos.top + target.height() / 2 - element.height() / 2

		position.x += options.offset[0]
		position.y += options.offset[1]

		element.css x: position.x, y: position.y, scale: options.scaleStart
		if options.z? then element.css 'z-index': options.z

		element.transition
			opacity: 1
			x: position.x - options.move[0] / 2
			y: position.y - options.move[1] / 2
			scale: options.scale
			, options.duration / 2, options.easeIn, ->
				setTimeout ->
					element.transition
						opacity: 0
						scale: options.scaleEnd
						x: position.x - options.move[0]
						y: position.y - options.move[1]
						, options.duration / 2, options.easeOut, ->
							element.remove()
							if typeof options.callback is 'function' then options.callback()
				, options.wait
