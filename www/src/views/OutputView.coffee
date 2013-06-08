
BaseView = require('../core/View').BaseView
getByRole = require('../helpers/dom').getByRole
generateDigitCtx = require('../helpers/system').generateDigitCtx
device = require '../core/device'
views = require '../core/views'

class OutputView extends BaseView
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
		
		@elements.back.on device.get('clickEvent'), -> views.open 'home', 'slide-left'

module.exports = OutputView: OutputView