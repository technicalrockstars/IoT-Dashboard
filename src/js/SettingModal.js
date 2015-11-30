var Modal = require('./core/modal');

function SettingModal(options) {
	this.inputs = {};
	this.options = options;
	this.modal = new Modal({title : 'Settings'});
	this.modal.setBody( this.createBody() );
}

SettingModal.prototype.createBody = function() {
	var that = this;
	var body = document.createElement('div');
	this.body = body;
	return body;
}

SettingModal.prototype.setSettingsSchema = function(schema) {
	for(var key in schema) {
		this.body.appendChild(this.createTextBox(key, {defaultValue : schema[key].value}));
	}
}

SettingModal.prototype.createTextBox = function(name, options) {
	var that = this;
	var form = document.createElement('div');
	form.classList.add('jsmodal__formRow');
	var label = document.createElement('span');
	label.classList.add('jsmodal__formLabel');

	var content = document.createElement('div');
	content.classList.add('jsmodal__formContent');
	var input = document.createElement('input');
	input.classList.add('jsmodal__formInput');
	content.appendChild(input);

	label.textContent = name;
	input.type = 'text';
	input.value = options.defaultValue || '';
	form.appendChild(label);
	form.appendChild(content);
	that.inputs[name] = input;
	return form;
}

SettingModal.prototype.createSelectBox = function(name, options) {
	var that = this;
	var form = document.createElement('div');
	var label = document.createElement('span');
	var selectElem = document.createElement('select');
	label.textContent = name;
	options.options.forEach(function(o) {
		var optionElem = document.createElement('option');
		optionElem.textContent = o.displayText;
		optionElem.value = o.value;
		selectElem.appendChild(optionElem);
	});
	selectElem.value = options.defaultValue;
	form.appendChild(label);
	form.appendChild(selectElem);
	that.inputs[name] = selectElem;
	return form;
}


SettingModal.prototype.open = function() {
	this.modal.open();
}

SettingModal.prototype.ok = function(cb) {
	var that = this;
	this.modal.ok(function() {
		var result = {};
		Object.keys(that.inputs).map(function(k) {
			result[k] = that.inputs[k].value;
		})
		cb(result);
	});
}

module.exports = SettingModal;