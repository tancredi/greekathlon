
debug =
  fast: false
  db: false

module.exports =

  get: (prop) ->
    switch prop
      when 'fast' then return debug.fast
      when 'db' then return debug.db