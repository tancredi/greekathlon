
debug = require '../core/debug'
popText = require('./popText').popText

module.exports =

	popOut: (classNames = '', callback = null) ->
		popText
			classNames: classNames
			center: true
			scaleStart: .5
			scale: .8
			scaleEnd: .8
			wait: if debug.get('fast') then 1 else 1200
			move: [ 0, 0 ]
			easeIn: 'easeOutQuart'
			easeOut: 'easeInQuart'
			duration: 500
			callback: callback
