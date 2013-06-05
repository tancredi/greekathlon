
getByRole = require('../helpers/dom').getByRole
BaseView = require('../core/View').BaseView

class HomeView extends BaseView
	templateName: 'home'
	fixHeight: true

	constructor: ->

	getElements: =>
		super()

		@elements.display = getByRole 'game-display', @elements.main

	bind: =>
		super()

module.exports = index: HomeView