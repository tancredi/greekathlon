Hogan = require 'hogan.js'

defaults = prefix: ''

module.exports =

	initialise: (@conf = defaults) ->
		@templates = {}
		@load()
		return @

	load: -> @set id, new Hogan.Template template for id, template of window.templates

	compile: (tpl) -> if template instanceof Hogan.Template then template = tpl else Hogan.compile tpl

	set: (id, template) -> @templates[@conf.prefix + id] = if typeof template is 'string' then @compile template else template

	get: (nsString = null) -> if nsString? then @templates[@conf.prefix + nsString] else @templates

	render: (id, data) -> if @get(id)? then @get(id).render data, @templates else throw "Template '#{id}' not found"