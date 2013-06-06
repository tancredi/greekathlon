module.exports =
	 
	initialise: ->
		@db = window.openDatabase "diary", 1, "diary", 1000000

		@db.transaction (t) =>
			t.executeSql 'create table if not exists digits(' +
				'id INTEGER PRIMARY KEY AUTOINCREMENT, value TEXT' +
				')'
		, @onError

	onError: (e) -> console.log 'DB ERROR:', e

	query: (queryStr, options = [], callback) ->
		@db.transaction (t) =>
			t.executeSql queryStr, options, (t, results) =>
				results = if results then @fixResults results else null
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
