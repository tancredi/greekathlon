
BaseModel = require('../core/Model').BaseModel

class Digits extends BaseModel
	tableName: 'digits'
	schema:
		value: 'TEXT'

module.exports = Digits: Digits