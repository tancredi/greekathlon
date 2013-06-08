
device = require './core/device'
clickables = require './ui/clickables'
db = require './core/db'
renderer = require './core/renderer'
views = require './core/views'
models = require './core/models'

# Load views
views.load
	home: require('./views/HomeView').HomeView
	output: require('./views/OutputView').OutputView

# Load models
models.load
	digits: require('./models/Digits').Digits

# Load templates
renderer.templates = window.templates

# Initialise app
init = -> if device.get('type')? then bind() else onDeviceReady()

# Bind deviceReady event
bind = -> document.addEventListener 'deviceready', onDeviceReady, false

onDeviceReady = ->
	# Initialise clickables
	clickables.initialise()

	# Initialise DB
	db.initialise()
	models.initialise()

	models.onReady =>
		# Open First view
		view = views.open 'home'

init()