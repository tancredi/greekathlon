renderer = require './renderer'
device = require './device'

class BaseView
	templateName: ''
	fixHeight: false
	context: {}

	constructor: ->

	render: (wrapper) =>
		rendered = renderer.render "views/#{@templateName}", @context

		@elements = main: $ "<div data-role='view' class='view'>#{rendered}</div>"

		if @fixHeight then @elements.main.css height: device.get('size').height

		@getElements()

		if wrapper? then @elements.main.appendTo wrapper
		@resize()
		@bind()

		$(window).on 'resize', => @resize()
		
		return @

	getElements: =>

	resize: =>

	bind: =>

	close: => @elements.main.remove()

	hide: =>  @elements.main.hide()

	show: =>
		@elements.main.removeAttr 'style'
		@resize()
		@elements.main.show()

module.exports = BaseView: BaseView