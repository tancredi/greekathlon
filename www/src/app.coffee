
Game = require('./controllers/Game').Game
device = require './core/device'
clickables = require './ui/clickables'

viewRoutes =
	main: require './views/main'

module.exports = app = window.app =
	renderer: require('./core/renderer').initialise()
	views: require './core/views'

init = ->
	loadViews()
	if device.get('type')? then bind() else onDeviceReady()

loadViews = ->
	for ns, views of viewRoutes
		for id, view of views
			app.views.load "#{ns}.#{id}", view

bind = -> document.addEventListener 'deviceready', onDeviceReady, false

onDeviceReady = ->
	clickables.initialise()
	view = app.views.open 'main.index'

init()