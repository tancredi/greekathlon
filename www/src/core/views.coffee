renderer = require './renderer'
getByRole = require('../helpers/dom').getByRole
transitions = require './viewTransitions'

module.exports =

	wrap: $ '#view-wrap'
	current: null
	shown: []
	views: {}

	closeAll: -> getByRole('view', @wrap).remove()

	load: (ns, view) ->
		if typeof ns is 'object'
			routes = ns
			@load ns, view for ns, view of routes
		else @views[ns] = view

	open: (ns, transition = null, callback = null, openOnTop = false, options = {}) ->
		if not openOnTop then @shown = []
		if transition? and @animating then return false

		if typeof ns is 'object'
			view = ns
		else
			view = new @views[ns] options

		if not view.elements? then view.render @wrap
		else view.show()

		if transition? and _.has @transitions, transition
			@applyTransition view, transition, callback, openOnTop
		else
			@onShown view, callback, openOnTop

		return view

	applyTransition: (view, transition, callback = null, openOnTop = false) ->
		@animating = true
		oldViewStyle = @current.elements.main.attr 'style'
		newViewStyle = view.elements.main.attr 'style'

		@transitions[transition] view, @current, =>
			@animating = false
			@onShown view, callback, openOnTop

			@current.elements.main.stop()
			view.elements.main.stop()

			if oldViewStyle then @current.elements.main.attr 'style', oldViewStyle
			else @current.elements.main.removeAttr 'style'

			if newViewStyle then view.elements.main.attr 'style', newViewStyle
			else view.elements.main.removeAttr 'style'

			@wrap.removeAttr 'style'


	onShown: (view, callback = null, openOnTop = false) ->
		if not openOnTop
			if @current? then @current.close()
		else
			@current.hide()
		@shown.push view
		@current = view

		if callback? then callback view

	transitions: transitions
