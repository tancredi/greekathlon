
BaseView = require '../core/BaseView'
getByRole = require('../helpers/dom').getByRole
generateDigitCtx = require('../helpers/system').generateDigitCtx
device = require '../core/device'
views = require '../core/views'

class OutputView extends BaseView
  templateName: 'result'
  fixHeight: true
  classNames: 'view-results'

  constructor: (digits) ->
    pairContexts = generateDigitCtx digits
    @context = $.extend @context, pairContexts

  getElements: =>
    super()

    @elements.back = getByRole 'back', @elements.main

  bind: =>
    super()

    @elements.back.on 'click touchend', -> views.open 'home', 'slide-left'

module.exports = OutputView