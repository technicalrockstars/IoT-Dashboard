var Modal = require('./core/modal');

function CreatePanelModal(options) {
	this.inputs = {};
	this.options = options;
	this.modal = new Modal({title: 'Create Panel'});
	this.modal.setBody( this.createBody() );
}

CreatePanelModal.prototype.createBody = function() {
	var that = this;
	var body = document.createElement('div');
	body.appendChild(this.createTextBox('Name', {defaultValue : 'Untitled Panel'}));
	if(this.options.pathlist) {
		var options = this.options.pathlist.map(function(path) {
			return {
				displayText : path,
				value : path
			}
		});
		body.appendChild(this.createSelectBox('DataStore', {options : options, defaultValue : 'datastore'}));
	}else{
		body.appendChild(this.createTextBox('DataStore', {defaultValue : 'datastore'}));
	}
	var widgetNames = this.options.widgetNames.map(function(name) {
			return {
				displayText : name,
				value : name
			}
		});
	body.appendChild(this.createSelectBox('Type', {options : widgetNames, defaultValue : 'text'}));


	return body;
}

CreatePanelModal.prototype.createTextBox = function(name, options) {
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

CreatePanelModal.prototype.createSelectBox = function(name, options) {
	var that = this;
	var form = document.createElement('div');
	form.classList.add('jsmodal__formRow');
	var label = document.createElement('span');
	label.classList.add('jsmodal__formLabel');

	var selectElem = document.createElement('select');
	selectElem.classList.add('jsmodal__formInput');
	label.textContent = name;

	var content = document.createElement('div');
	content.classList.add('jsmodal__formContent');
	content.appendChild(selectElem);

	options.options.forEach(function(o) {
		var optionElem = document.createElement('option');
		optionElem.textContent = o.displayText;
		optionElem.value = o.value;
		selectElem.appendChild(optionElem);
	});
	selectElem.value = options.defaultValue;
	form.appendChild(label);
	form.appendChild(content);
	that.inputs[name] = selectElem;
	return form;
}


CreatePanelModal.prototype.open = function() {
	this.modal.open();
}

CreatePanelModal.prototype.ok = function(cb) {
	var that = this;
	this.modal.ok(function() {
		cb({
			name : that.inputs['Name'].value,
			type : that.inputs['Type'].value,
			datastore : that.inputs['DataStore'].value
		});
	});
}

module.exports = CreatePanelModal;