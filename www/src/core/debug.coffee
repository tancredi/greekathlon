
debug =
	fast: false

module.exports =

	get: (prop) ->
		switch prop
			when 'fast' then return debug.fast