
map = require '../fixtures/map'

vowels = [ 'a', 'e', 'i', 'o', 'u' ]

generateDigitCtx = (digits) ->
  pairContexts = []
  pairs = []

  for i in [ 0 .. ( digits.length - 1 ) / 2 ]
    first = digits[ i * 2 ]
    second = digits[ i * 2 + 1 ] or ''
    pairs.push "#{first}#{second}"

  for pair in pairs
    index = parseInt pair, 10
    str = map[index]

    pairContexts.push generateValCtx pair, str

  return pairs: pairContexts, digits: digits

generateValCtx = (pair, str) ->
  parts = []
  consParts = []

  temp = vow: false, val: ''

  for char in str
    if vowels.indexOf(char) isnt -1
      if temp.val.length > 0
        parts.push temp
        consParts.push temp
      temp = vow: false, val: ''
      parts.push vow: true, val: char
    else temp.val += char

  if temp.val.length > 0
    parts.push temp
    consParts.push temp

  if consParts.length > 0 then consParts[0].num = pair[0]
  if consParts.length > 1 then consParts[1].num = pair[1]

  digits = []
  digits.push num: digit for digit in pair

  return parts: parts, digits: digits, icon: str.toLowerCase()

module.exports =
  generateDigitCtx: generateDigitCtx
  generateValCtx: generateValCtx