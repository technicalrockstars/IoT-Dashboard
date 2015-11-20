function PanelWrapper(id) {
	this.elem = document.getElementById(id);
	this.panels = [];
	this.sections = [];
}

PanelWrapper.prototype.append = function(panel) {
	if((this.panels.length % 3) == 0) {
		var section = document.createElement('div');
		section.classList.add('ss-panel-section');
		section.classList.add('ss-panel-group');
		this.sections.push(section);
		this.elem.appendChild(section);
	}
		console.log(this.panels.length);
	this.panels.push(panel);
		console.log(this.panels.length);
	this.elem.lastChild.appendChild(panel.getEl());
};

function Panel() {
	this.elem = document.createElement('div');
	this.elem.classList.add('ss-panel-col');
	this.elem.classList.add('ss-panel-span_1_of_3');
	this.header = document.createElement('div');
	this.header.classList.add('ss-panel-header');
	this.body = document.createElement('div');
	this.body.classList.add('ss-panel-body');
	this.elem.appendChild(this.header);
	this.elem.appendChild(this.body);
}

Panel.prototype.setTitle = function(title) {
	this.header.textContent = title;
}

Panel.prototype.setBody = function(body) {
	this.body.appendChild(body);
}

Panel.prototype.getEl = function() {
	return this.elem;
}

PanelWrapper.Panel = Panel;

module.exports = PanelWrapper;