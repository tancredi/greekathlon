
device = require './core/device'
clickables = require './ui/clickables'
db = require './core/db'
renderer = require './core/renderer'
views = require './core/views'

# Init views
views.load
	home: require('./views/HomeView').HomeView
	output: require('./views/OutputView').OutputView

# Load templates
renderer.templates = window.templates

# Initialise app
init = -> if device.get('type')? then bind() else onDeviceReady()

# Bind deviceReady event
bind = -> document.addEventListener 'deviceready', onDeviceReady, false

onDeviceReady = ->
	clickables.initialise()
	db.initialise()
	view = views.open 'home'

init()