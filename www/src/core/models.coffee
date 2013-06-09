
db = require './db'
debugDb = require('./debug').get 'db'

if _.has localStorage, 'installedModels'
  installedModels = JSON.parse localStorage.installedModels or {}
else
  installedModels = {}

modelsReadyCallbacks = []

module.exports =

  models: {}
  loaded: 0
  ready: false

  load: (ns, model) ->
    if typeof ns is 'object'
      routes = ns
      @load ns, model for ns, model of routes
    else @models[ns] = model

  initialise: ->
    if @getModelsCount() is 0 then @onModelsReady()
    else @initModel model for id, model of @models

  initModel: (model) ->
    @log "Init '#{model.prototype.tableName}' schema..."
    tableName = model.prototype.tableName
    isInstalled = _.has installedModels, tableName

    if isInstalled
      serialisedSchema = JSON.stringify model.prototype.schema
      isUpdated = serialisedSchema is installedModels[tableName]

      if not isUpdated
        @migrateModel model, => @onModelReady model
      else
        @onModelReady model
    else
      @installModel model, => @onModelReady model

  installModel: (model, callback) ->
    @log "Install '#{model.prototype.tableName}' schema..."
    db.createTable model.prototype.tableName, model.prototype.schema, =>
      installedModels[model.prototype.tableName] = JSON.stringify model.prototype.schema
      @onModelReady model

  migrateModel: (model, callback) -> db.dropTable model.prototype.tableName, => @installModel model, callback

  onModelReady: (model) ->
    @log "'#{model.prototype.tableName}' ready!"
    @ready++
    if @ready is @getModelsCount()
      @ready = true
      @onModelsReady()

  onModelsReady: ->
    @log 'All models loaded!'
    localStorage.installedModels = JSON.stringify installedModels
    callback() for callback in modelsReadyCallbacks

  onReady: (callback) ->
    if @ready then callback()
    modelsReadyCallbacks.push callback

  getModelsCount: ->
    count = 0
    count++ for model of @models
    return count

  log: (m) -> if debugDb then console.log "DB: #{m}"
