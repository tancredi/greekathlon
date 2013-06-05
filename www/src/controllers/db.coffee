module.exports =
	 
	initialise: ->
		@db = window.openDatabase "diary", 1, "diary", 1000000

		@db.transaction (t) =>
			t.executeSql 'create table if not exists digits(' +
				'id INTEGER PRIMARY KEY AUTOINCREMENT, value TEXT' +
				')'
		, @onError

	onError: (e) -> console.log 'DB ERROR:', e
	 
	getAll: (callback) ->
		@db.transaction (t) =>
			t.executeSql 'select * from digits order by id desc', [], (t, results) =>
				callback @fixResults results
			, @onError
		, @onError

	save: (digits, callback) ->
		@db.transaction (t) =>
			t.executeSql 'insert into digits(value) values(?)', [ digits ], ->
				if callback then callback()
			, @onError
		, @onError
	 
	fixResults: (res) ->
		result = []

		for item, i in res.rows
			row = res.rows.item i
			result.push row

		return result
	 
	# //I'm a lot like fixResults, but I'm only used in the context of expecting one row, so I return an ob, not an array
	# Diary.prototype.fixResult = function(res) {
	# 	if(res.rows.length) {
	# 		return res.rows.item(0);
	# 	} else return {};
	# }