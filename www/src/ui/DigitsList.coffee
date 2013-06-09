
db = require '../core/db'
InteractiveList = require './InteractiveList'
views = require '../core/views'

class DigitsList

    constructor: (@element, @entries) ->
        @eventsHandler = _ new InteractiveList element: element, entries: entries
        @bind()

    onSwipeMove: (target, data) =>
        swipeObj = target.data 'swipeObj'

        if not swipeObj
            swipeObj =
                swiping: true
                direction: null
                wrapper: target.parent()
            target.data 'swipeObj', swipeObj

        target.css x: data.moved.x

        if data.moved.x > 0 and swipeObj.direction isnt 'right'
            swipeObj.wrapper.removeClass 'swiping-right'
            swipeObj.wrapper.addClass 'swiping-left'
            target.data 'swipeObj', swipeObj
        else if data.moved.x < 0 and swipeObj.direction isnt 'left'
            swipeObj.wrapper.removeClass 'swiping-left'
            swipeObj.wrapper.addClass 'swiping-right'
            target.data 'swipeObj', swipeObj

    onSwipeEnd: (target, data) =>
        swipeObj = target.data 'swipeObj'
        swipeObj.swiping = false

        if data.percent < 90
            target.transition x: 0, 200, ->
                swipeObj.wrapper.removeClass 'swiping-left swiping-right'
        else
            targetId = target.attr 'data-id'
            db.delete 'digits', id: targetId
            target.transition x: '100%', 200, ->
                swipeObj.wrapper.animate height: 0, 200, ->
                    $(@).remove()

        target.data 'swipeObj', swipeObj

    onTap: (target, data) =>
        digits = target.attr 'data-digits'
        views.open 'output', 'slide-right', null, false, digits

    bind: =>
        @eventsHandler.on 'swipemove', (target, data) => @onSwipeMove target, data
        @eventsHandler.on 'swipeend', (target, data) => @onSwipeEnd target, data
        @eventsHandler.on 'tap', (target, data) => @onTap target, data

module.exports = DigitsList
