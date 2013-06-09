
BaseView = require('../core/View').BaseView
getByRole = require('../helpers/dom').getByRole
device = require '../core/device'
renderer = require '../core/renderer'
views = require '../core/views'
db = require '../core/db'
generateDigitCtx = require('../helpers/system').generateDigitCtx

class HomeView extends BaseView
	templateName: 'home'

	constructor: ->

	getElements: =>
		super()

		@elements.form = @elements.main.find 'form'
		@elements.input = getByRole 'digit-input', @elements.form
		@elements.button = @elements.form.find 'button'
		@elements.savedWrap = getByRole 'saved-wrap', @elements.main

	bind: =>
		super()

		self = @

		@elements.input.on 'keydown', (e) ->
			charCode = if e.which then e.which else e.keyCode
			isNumber = ( charCode >= 48 and charCode <= 57 ) or charCode is 43
			isAllowed = charCode is 8 or charCode is 13
			if not isNumber and not isAllowed then return false

		@elements.input.on 'change', -> self.submit()

		@elements.form.on 'submit', -> return false

		@elements.button.on 'click touchend', ->
			self.submit()
			return false

		db.select 'digits', {}, order: [ 'id', -1 ], (digits) ->
			ctx = []

			for entry in digits
				ctx.push generateDigitCtx entry.value

			savedList = $ renderer.render 'saved-list', entries: ctx
			self.elements.savedWrap.append savedList

		scrolling = null

		@elements.main.on 'mousemove touchmove', '[data-role="saved-digits"]', (e) ->
			scrolling = true

		@elements.main.on 'mousedown touchstart', '[data-role="saved-digits"]', (e) ->
			scrolling = false
			return null

		@elements.main.on 'mouseup touchend', '[data-role="saved-digits"]', (e) ->
			if not scrolling
				digits = $(@).attr 'data-digits'
				views.open 'output', 'slide-right', null, false, digits
			scrolling = false
			return true

	submit: =>
		digits = @elements.input.val()
		views.open 'output', 'slide-right', null, false, digits
		db.insert 'digits', value: digits

module.exports = HomeView: HomeView
