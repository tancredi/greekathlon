
getByRole = require('../helpers/dom').getByRole
BaseView = require('../core/View').BaseView
device = require '../core/device'
renderer = require '../core/renderer'
views = require '../core/views'
map = require '../fixtures/map'
db = require '../controllers/db'

vowels = [ 'a', 'e', 'i', 'o', 'u' ]

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

		@elements.button.on device.get('clickEvent'), ->
			self.submit()
			return false

		db.getAll (data) ->
			ctx = []

			for entry in data
				ctx.push generateDigitCtx entry.value

			savedList = $ renderer.render 'partials/saved-list', entries: ctx
			self.elements.savedWrap.append savedList

		scrolling = null

		@elements.main.on 'touchmove', '[data-role="saved-digits"]', (e) -> scrolling = true

		@elements.main.on 'touchstart', '[data-role="saved-digits"]', (e) ->
			scrolling = false
			return null

		@elements.main.on 'touchend', '[data-role="saved-digits"]', (e) ->
			if not scrolling
				digits = $(@).attr 'data-digits'
				views.open 'main.result', 'slide-right', null, false, digits
			scrolling = false
			return true

	submit: =>
		digits = @elements.input.val()
		views.open 'main.result', 'slide-right', null, false, digits
		db.save digits

class ResultView extends BaseView
	templateName: 'result'
	fixHeight: true
	classNames: 'view-results'

	getElements: =>
		super()

		@elements.back = getByRole 'back', @elements.main

	constructor: (digits) ->
		pairContexts = generateDigitCtx digits
		$.extend this.context, pairContexts

	bind: =>
		super()
		
		@elements.back.on device.get('clickEvent'), -> app.views.open 'main.index', 'slide-left'

generateDigitCtx = (digits) ->
	pairContexts = []
	pairs = []

	for i in [ 0 .. ( digits.length - 1 ) / 2 ]
		first = digits[ i * 2 ]
		second = digits[ i * 2 + 1 ] or ''
		pairs.push "#{first}#{second}"

	for pair in pairs
		index = parseInt pair, 10
		str = map[index]

		pairContexts.push generateValCtx pair, str

	return pairs: pairContexts, digits: digits

generateValCtx = (pair, str) ->
	parts = []
	consParts = []

	temp = vow: false, val: ''

	for char in str
		if vowels.indexOf(char) isnt -1
			if temp.val.length > 0
				parts.push temp
				consParts.push temp
			temp = vow: false, val: ''
			parts.push vow: true, val: char
		else temp.val += char

	if temp.val.length > 0
		parts.push temp
		consParts.push temp

	if consParts.length > 0 then consParts[0].num = pair[0]
	if consParts.length > 1 then consParts[1].num = pair[1]

	digits = []
	for digit in pair
		digits.push num: digit

	return parts: parts, digits: digits

module.exports = index: HomeView, result: ResultView
