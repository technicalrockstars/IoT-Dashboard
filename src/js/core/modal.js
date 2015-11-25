
function Modal(options) {
	var that = this;
	this.options = options || {};
	var elem = document.createElement('div');
	var overlap = window.document.createElement("div");
	overlap.classList.add('jsmodal__screen');
	this.overlap = overlap;
	this.elem = elem;
	this.elem.classList.add('jsmodal');

	var header = document.createElement('div');
	var body = document.createElement('div');
	var footer = document.createElement('div');
	var buttons = document.createElement('div');
	var okButton = document.createElement('button');
	var cancelButton = document.createElement('button');

	header.classList.add('jsmodal__header');
	body.classList.add('jsmodal__body');
	footer.classList.add('jsmodal__footer');
	header.textContent = this.options.title || 'Untitled Modal';
	cancelButton.textContent = 'Cancel';
	okButton.textContent = 'OK';
	cancelButton.classList.add('jsmodal__btn');
	okButton.classList.add('jsmodal__btn');
	okButton.classList.add('jsmodal__btn--positive');
	buttons.classList.add('jsmodal__btnList');

	this.body = body;
	buttons.appendChild(cancelButton);
	buttons.appendChild(okButton);
	footer.appendChild(buttons);
	this.elem.appendChild(header);
	this.elem.appendChild(this.body);
	this.elem.appendChild(footer);

	window.document.body.appendChild(this.elem);

	cancelButton.addEventListener('click', function() {
		that.close();
	});
	okButton.addEventListener('click', function() {
		that.okClicked();
		that.close();
	});
}

Modal.prototype.setBody = function(body) {
	this.body.appendChild(body);
}

Modal.prototype.createBody = function() {
	var that = this;
	this.inputs = {};
	var form = document.createElement('div');

	var setting = document.createElement('textarea');
	setting.cols = 50;
	setting.rows = 5;
	setting.setAttribute('placeholder', 'Input your schema(JSON)');
	setting.classList.add('jsmodal__formTextarea')

	var nameInput = document.createElement('input');
	nameInput.value = 'Untitled Graph';

	var typeInput = document.createElement('select');
	var option1 = document.createElement('option');
	var option2 = document.createElement('option');
	var option3 = document.createElement('option');
	var option4 = document.createElement('option');
	var option5 = document.createElement('option');
	option1.textContent = 'leadsource';
	option2.textContent = 'piechart';
	option3.textContent = 'text';
	option4.textContent = 'barchart';
	option5.textContent = 'heatmap';
	typeInput.appendChild(option1);
	typeInput.appendChild(option2);
	typeInput.appendChild(option3);
	typeInput.appendChild(option4);
	typeInput.appendChild(option5);

	form.appendChild(aForm('name', nameInput));
	form.appendChild(aForm('type', typeInput));
	form.appendChild(setting);
	that.inputs['setting'] = setting;

	that.inputs['type'].addEventListener('change', function(e) {
		refreshSettings();
	});
	refreshSettings();

	return form;

	function refreshSettings() {
		var defaultSettings = GraphManager.defaultSetting(that.inputs['type'].value);
		setting.value = JSON.stringify(defaultSettings);
	}
	function aForm(name, input) {
		var form = document.createElement('div');
		form.classList.add('jsmodal__formRow')

		var label = document.createElement('label');
		label.setAttribute('for', 'createGraph-'+name);
		label.textContent = name.toUpperCase();
		label.classList.add('jsmodal__formLabel')

		var content = document.createElement('div');
		content.classList.add('jsmodal__formContent');
		input.id = 'createGraph-'+name;
		input.classList.add('jsmodal__formInput');
		content.appendChild(input);

		form.appendChild(label);
		form.appendChild(content);
		that.inputs[name] = input;
		return form;
	}
}

Modal.prototype.getValues = function() {
	return {
		name : this.inputs.name.value,
		type : this.inputs.type.value,
		settings : JSON.parse(this.inputs.setting.value)
	}
}

Modal.prototype.ok = function(cb) {
	this.okClicked = cb;
}

Modal.prototype.open = function(_option) {
	var option = _option || {};
	var self = this;
	this.elem.style.display = 'block';
	window.document.body.appendChild(this.overlap);

	for(var i=0;i < this.elem.childNodes.length;i++) {
		if(this.elem.childNodes[i].className == "close") {
			this.elem.childNodes[i].onclick = function() {
				self.close();
				return false;
			}
		}
	}
	this.overlap.onmousedown = function(e) {
		if(!check(e.target)) {
			self.close();
			return false;
		}
		function check(t, index) {
			if(!t) return false;
			if(index > 5) return false;
			if(t.className == "jsmodal") {
				return true;
			}else{
				return check(t.parentNode, index++);
			}
		}
		return true;
	}

}

Modal.prototype.close = function() {
	this.elem.style.display = 'none';
	if(this.overlap.remove) this.overlap.remove();
	else window.document.body.removeChild(this.overlap);
}

module.exports = Modal;