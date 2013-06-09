
BaseView = require '../core/BaseView'
getByRole = require('../helpers/dom').getByRole
device = require '../core/device'
renderer = require '../core/renderer'
views = require '../core/views'
db = require '../core/db'
generateDigitCtx = require('../helpers/system').generateDigitCtx
DigitsList = require '../ui/DigitsList'

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

		@loadData()

	loadData: =>
		self = @

		db.select 'digits', {}, order: [ 'id', -1 ], (digits) ->
			ctx = entries: []

			for entry in digits
				ctx.entries.push $.extend true, id: entry.id, generateDigitCtx entry.value

			savedList = $ renderer.render 'saved-list', ctx
			self.elements.savedWrap.append savedList

			new DigitsList savedList, '[data-role="saved-digits"]'

	submit: =>
		digits = @elements.input.val()
		views.open 'output', 'slide-right', null, false, digits
		db.insert 'digits', value: digits

module.exports = HomeView
