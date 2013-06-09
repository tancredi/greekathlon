
BaseModel = require '../core/BaseModel'

class Digits extends BaseModel
	tableName: 'digits'
	schema:
		value: 'TEXT'

module.exports = Digits