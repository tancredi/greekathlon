
debugDb = require('./debug').debugDB
schemas = require './schemas'

config =
  ns: 'greekathlon'
  version: ''
  name: 'Greekathlon'
  estimatedSize: 1024 * 1024

module.exports =
   
  initialise: ->
    if not window.openDatabase
      @db = transaction: (callback) -> callback executeSql: (query, options, callback) -> callback null, null
      @supported = false
    else
      @db = window.openDatabase config.ns, config.version, config.name, config.estimatedSize
      @supported = true

  onError: (q, m) -> console.log 'DB ERROR:', m

  query: (queryStr, options = [], callback) ->
    if debugDb then console.log "DB QUERY: #{queryStr}"
    @db.transaction (t) =>
      t.executeSql queryStr, options, (t, results) =>
        results = if results then @fixResults results else []
        if typeof callback is 'function' then callback results
      , @onError
    , @onError

  fixResults: (res) ->
    result = []

    for item, i in res.rows
      row = res.rows.item i
      result.push row

    return result

  select: (table, conditions = {}, options = {}, callback) ->
    queryStr = "SELECT * FROM #{table}"

    conditionStr = ( "#{key} = '#{value}'" for key, value of conditions ).join ', '
    if conditionStr.length then queryStr += " WHERE #{conditionStr}"

    if options.order?
      dir = if options.order[1] > 0 then 'ASC' else 'DESC'
      queryStr += " ORDER BY #{options.order[0]} #{dir}"
    if options.limit? then queryStr += " LIMIT #{options.limit}"

    @query queryStr, [], callback

  insert: (table, values = {}, callback) ->
    keys = ( key for key, val of values ).join ', '
    values = ( "'#{val}'" for key, val of values ).join ', '
    @query "INSERT INTO #{table}(#{keys}) values(#{values})", [], callback

  delete: (table, conditions = {}, callback) ->
    queryStr = "DELETE FROM #{table}"

    conditionStr = ( "#{key} = '#{value}'" for key, value of conditions ).join ', '
    if conditionStr.length then queryStr += " WHERE #{conditionStr}"

    @query queryStr, [], callback

  createTable: (tableName, schema = {}, callback) ->
    fieldsStr = "id INTEGER PRIMARY KEY AUTOINCREMENT"
    fieldsStrAdd = ( "#{key} #{type}" for key, type of schema ).join ', '

    if fieldsStrAdd.length then fieldsStr = "#{fieldsStr}, #{fieldsStrAdd}"

    @query "CREATE TABLE IF NOT EXISTS #{tableName}(#{fieldsStr})", [], callback

  dropTable: (tableName, callback) -> @query "DROP TABLE #{tableName}", [], callback

  onReady: schemas.onReady
