
moveThreshold = 10
evtPrefix = 'touch-'

class InteractiveList

	constructor: (options) ->
		@element = options.element
		@entries = options.entries or 'li'
		@reset()
		@bind()

	onStart: (target, pos) =>
		@moving = false
		@target = target
		@isDown = true
		@startPos = pos

	onMove: (pos) =>
		@lastPos = pos

		if @isDown
			@moved =
				x: pos.x - @startPos.x
				y: pos.y - @startPos.y

			total = Math.abs(@moved.x) + Math.abs(@moved.y)

			if total > moveThreshold or @moving
				@moving = true

				wasScrollStarter = Math.abs(@moved.y) > moveThreshold
				wasSwipeStarter = Math.abs(@moved.x) > moveThreshold and not wasScrollStarter

				if ( wasSwipeStarter or @swiping ) and not @scrolling
					if not @swiping then @onSwipeStart pos
					else @onSwipe pos
					@swiping = true
				else
					if wasScrollStarter
						@onScoll()
						@scrolling = true

	onSwipeStart: (pos) => @emitEvent 'swipestart', @target, @getSwipeData pos

	onSwipe: (pos) => @emitEvent 'swipemove', @target, @getSwipeData pos

	getSwipeData: (pos) => return moved: @moved, percent: @getSwipePercent(pos), pos: pos

	getSwipePercent: (pos) =>
		elOffset = @element.offset()
		elWidth = @element.width()
		posX = pos.x - elOffset.left
		return posX * 100 / elWidth

	onScoll: => @emitEvent 'scrollmove', @target

	onEnd: =>
		if not @moving
			@tap()
		else if @swiping
			@emitEvent 'swipeend', @target, @getSwipeData @lastPos
		else
			@emitEvent 'scrollend', @target
		@reset()
 
	reset: =>
		@target = null
		@moving = false
		@isDown = false
		@startPos = x: 0, y: 0
		@moved = x: 0, y: 0
		@lastPos = x: 0, y: 0
		@swiping = false
		@scrolling = false

	tap: => @emitEvent 'tap', @target

	getTouchPos: (e) =>
		if e.originalEvent.touches and e.originalEvent.touches.length
			pos = e.originalEvent.touches[0]
		else if e.pageX
			pos = e
		if pos then return x: pos.pageX, y: pos.pageY
		return null

	emitEvent: (name, target, data) =>
		target.trigger "#{evtPrefix}#{name}", data or null
		_(@).emit name, [ target, data or null ]

	bind: =>
		self = @

		$('body').on 'mousemove touchmove', @entries, (e) -> self.onMove self.getTouchPos e

		@element.on 'mousedown touchstart', @entries, (e) -> self.onStart $(@), self.getTouchPos e

		@element.on 'mouseup touchend', @entries, (e) ->
			self.onEnd()
			return true

module.exports = InteractiveList
