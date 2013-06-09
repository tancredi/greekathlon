
device = require '../core/device'

clickables = 'a, .button, button, input, .touchable, .clickable'
classNames = touchActive: 'touch-active'
activeStateDuration = 200

module.exports =
  
  initialise: -> @bind()

  bind: ->
    self = @
    $('body').on 'click touchend', clickables, -> self.onClick $ @

  onClick: (element) ->
    element.addClass classNames.touchActive

    element.data 'touchActiveTimer', setTimeout =>
      element.removeClass classNames.touchActive
      if element.data('touchActiveTimer')?
        clearTimeout element.data('touchActiveTimer')
    , activeStateDuration