fs = require 'fs'
path = require 'path'
Hogan = require 'hogan.js'
colors = require 'cli-color'

templatesDir = path.resolve __dirname, '../templates'
templates = []
ext = 'html'
clientWrap = Hogan.compile fs.readFileSync path.resolve(__dirname, "templates.js.mustache"), "utf8"
out = path.resolve __dirname, '../js/templates.js'

init = ->
    fetchTemplates templatesDir
    fs.writeFileSync out, map()
    console.log colors.green "Hogan.js templates compiled into #{out}"

map = ->
    if templates.length isnt 0 then templates[templates.length - 1].last = true
    clientWrap.render templates: templates

fetchTemplates = (dir) -> fetchTemplate file, dir for file in getDirFiles dir

fetchTemplate = (file, dir) ->
    if matchesExtension file
        path = dir + '/' + file
        id = path
            .replace(templatesDir, '')
            .substr(1)
            .replace ".#{ext}", ''
        template = fs.readFileSync path, "utf8"
        template = Hogan.compile template, { asString: true } 
        templates.push file: path, id: id, template: template
    else if not isHidden file then fetchTemplates "#{dir}/#{file}"

isHidden = (file) -> file.substr(0, 1) is '.'

matchesExtension = (file) ->
    file.substr(file.length - 5) is ".#{ext}"

getDirFiles = (dir) -> fs.readdirSync dir

init()