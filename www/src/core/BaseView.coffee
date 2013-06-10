renderer = require './renderer'
device = require './device'

# Base class for all views - takes care of basic rendering and defines mein methods
# called by views module when initialising new views or changing state
class BaseView
  templateName: ''  # Relative to www/templates/views
  fixHeight: false  # Set view height to device screen height after rendering
  classNames: ''    # Will be applied along with '.view'

  constructor: ->
    # This context property will passed when rendering view template
    @context = {}

  # Render template, append element to given wrapper and perform additional operations
  render: (wrapper) =>
    rendered = renderer.render "views/#{@templateName}", @context

    @elements = main: $ "<div data-role='view' class='view #{@classNames}'>#{rendered}</div>"

    if @fixHeight then @elements.main.css height: device.getSize().height

    @getElements()

    if wrapper? then @elements.main.appendTo wrapper
    @resize()
    @bind()

    $(window).on 'resize', => @resize()
    
    return @

  # Method called after rendering
  getElements: =>

  # Method called after elements parsed
  bind: =>

  # Method called on window resize (and after rendering)
  resize: =>

  # Method called when view is closed
  close: => @elements.main.remove()

  # Method called when view is hidden
  hide: =>  @elements.main.hide()

  # Method called when view is shown
  show: =>
    @elements.main.removeAttr 'style'
    @resize()
    @elements.main.show()

module.exports = BaseView