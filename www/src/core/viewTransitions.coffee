
device = require './device'
debug = require './debug'

defaultDuration = if debug.skipAnimations then 0 else 400

wrap = $ '#view-wrap'

placeAbsolutely = (view) ->
  deviceSize = device.getSize()
  view.elements.main.css
    position: 'absolute'
    top: 0
    left: 0
    width: deviceSize.width
    height: deviceSize.height

popView = (scaleFrom, newView, oldView, callback, duration = defaultDuration) ->
  placeAbsolutely newView

  newView.elements.main.css scale: scaleFrom, opacity: 0
  newView.elements.main.transition scale: 1, opacity: 1

  setTimeout ->
    callback newView
  , defaultDuration

horizontalSlide = (dir, newView, oldView, callback, duration = defaultDuration) ->
  deviceSize = device.getSize()

  wrap.css
    width: deviceSize.width
    'overflow-x': 'hidden'
    position: 'relative'

  placeAbsolutely newView
  newView.elements.main.css x: ( 100 * dir) + '%'

  newView.elements.main.transition x: '0', duration

  if oldView?
    oldView.elements.main.css
      width: deviceSize.width
      height: deviceSize.height
    oldView.elements.main.transition x: ( 100 * -dir) + '%', duration, -> callback newView

module.exports =

  'slide-right': (newView, oldView, callback) -> horizontalSlide 1, newView, oldView, callback

  'slide-left': (newView, oldView, callback) -> horizontalSlide -1, newView, oldView, callback

  'flip': (newView, oldView, callback) ->
    duration = defaultDuration

    placeAbsolutely newView

    oldView.elements.main.css position: 'relative', 'z-index': 1
    newView.elements.main.css 'z-index': -1, rotateY: '-90deg', z: -500

    oldView.elements.main.transition rotateY: '90deg', duration / 2

    setTimeout ->
      newView.elements.main.transition rotateY: '0deg', duration / 2
    , duration / 2, -> callback newView

  'pop-out': (newView, oldView, callback) -> popView 2.2, newView, oldView, callback

  'pop-in': (newView, oldView, callback) -> popView .7, newView, oldView, callback
    

    
