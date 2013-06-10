
# Templates manager and renderer using Handlebars
module.exports =

  templates: {}

  compile: (tpl) -> if typeof template is 'function' then template = tpl else Handlebars.compile tpl

  set: (id, template) -> @templates[id] = if typeof template is 'string' then @compile template else template

  get: (nsString = null) -> if nsString? then @templates[nsString] else @templates

  render: (id, data) -> if @get(id)? then @get(id) data else throw "Template '#{id}' not found"