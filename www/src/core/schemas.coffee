
db = require './db'
debugDb = require('./debug').debugDB

if _.has localStorage, 'installedSchemas'
  installedSchemas = JSON.parse localStorage.installedSchemas or {}
else
  installedSchemas = {}

schemasReadyCallbacks = []

module.exports =

  schemas: {}
  loaded: 0
  ready: false

  load: (ns, schema) ->
    if typeof ns is 'object'
      routes = ns
      @load ns, schema for ns, schema of routes
    else @schemas[ns] = schema

  initialise: ->
    if @getSchemasCount() is 0 then @onSchemasReady()
    else @initSchema schema for id, schema of @schemas

  initSchema: (schema) ->
    @log "Init '#{schema.tableName}' schema..."
    tableName = schema.tableName
    isInstalled = _.has installedSchemas, tableName

    if isInstalled
      serialisedSchema = JSON.stringify schema.fields
      isUpdated = serialisedSchema is installedSchemas[tableName]

      if not isUpdated
        @migrateSchema schema, => @onSchemaReady schema
      else
        @onSchemaReady schema
    else
      @installSchema schema, => @onSchemaReady schema

  installSchema: (schema, callback) ->
    @log "Install '#{schema.tableName}' schema..."
    db.createTable schema.tableName, schema.fields, =>
      installedSchemas[schema.tableName] = JSON.stringify schema.fields
      @onSchemaReady schema

  migrateSchema: (schema, callback) -> db.dropTable schema.tableName, => @installSchema schema, callback

  onSchemaReady: (schema) ->
    @log "'#{schema.tableName}' ready!"
    @ready++
    if @ready is @getSchemasCount()
      @ready = true
      @onSchemasReady()

  onSchemasReady: ->
    @log 'All schemas loaded!'
    localStorage.installedSchemas = JSON.stringify installedSchemas
    callback() for callback in schemasReadyCallbacks

  onReady: (callback) ->
    if @ready then callback()
    schemasReadyCallbacks.push callback

  getSchemasCount: ->
    count = 0
    count++ for schema of @schemas
    return count

  log: (m) -> if debugDb then console.log "DB: #{m}"
