
device = require './core/device'
clickables = require './ui/clickables'
db = require './core/db'
renderer = require './core/renderer'
views = require './core/views'
schemas = require './core/schemas'

# Import Views
views.load
  home: require './views/HomeView'
  output: require './views/OutputView'

# Import Models
schemas.load
  digits: require './schemas/digits'

# Load templates
renderer.templates = window.templates

# Initialise app
init = -> if device.getType()? then bind() else onDeviceReady()

# Bind deviceReady event
bind = -> document.addEventListener 'deviceready', onDeviceReady, false

onDeviceReady = ->
  # Initialise clickables
  clickables.initialise()

  # Initialise DB
  db.initialise()
  schemas.initialise()

  schemas.onReady =>
    # Open First view
    view = views.open 'home'

init()