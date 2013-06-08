
Game = require('./controllers/Game').Game
device = require './core/device'
clickables = require './ui/clickables'
db = require './core/db'
renderer = require './core/renderer'
views = require './core/views'

# Views
views.load
	home: require('./views/HomeView').HomeView
	output: require('./views/OutputView').OutputView

renderer.templates = window.templates

init = -> if device.get('type')? then bind() else onDeviceReady()

bind = -> document.addEventListener 'deviceready', onDeviceReady, false

onDeviceReady = ->
	clickables.initialise()
	db.initialise()
	view = views.open 'home'

init()