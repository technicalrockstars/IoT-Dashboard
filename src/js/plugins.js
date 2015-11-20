var TextWidget = require('./widgets/TextWidget');
var ChartWidget = require('./widgets/ChartWidget');

module.exports = {
	widgets : [{
		name : 'text',
		widget : TextWidget
	},{
		name : 'chart',
		widget : ChartWidget
	}]
}