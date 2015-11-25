function TextWidget(datastore) {
	var that = this;
	this.elem = document.createElement('div');
	this.datastore = datastore;
	this.datastore.on('send', function(e) {
		that.elem.textContent = JSON.stringify(e);
	});
}

TextWidget.prototype.settings = function() {
	return {
	};
}

TextWidget.prototype.onSettingsUpdated = function(result) {
}

TextWidget.prototype.getEl = function() {
	return this.elem;
}

module.exports = TextWidget;