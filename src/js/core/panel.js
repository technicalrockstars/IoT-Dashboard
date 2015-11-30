function PanelWrapper(id) {
	this.elem = document.getElementById(id);
	this.panels = [];
	this.sections = [];
}

PanelWrapper.prototype.append = function(panel) {
	if((this.panels.length % 2) == 0) {
		var section = document.createElement('div');
		section.classList.add('ss-panel__section');
		section.classList.add('ss-panel__group');
		section.classList.add('kite');
		section.classList.add('kite--grid');
		section.classList.add('has-gutter');
		this.sections.push(section);
		this.elem.appendChild(section);
	}
		console.log(this.panels.length);
	this.panels.push(panel);
		console.log(this.panels.length);
	this.elem.lastChild.appendChild(panel.getEl());
};

function Panel() {
	var that = this;

	this.elem = document.createElement('div');
	this.elem.classList.add('kite__item');
	this.elem.classList.add('is-12of12');

	var canvas = document.createElement('div');
	canvas.classList.add('ss-panel__col');

	var header = document.createElement('div');
	header.classList.add('ss-panel__header');
	this.body = document.createElement('div');
	this.body.classList.add('ss-panel__body');

	canvas.appendChild(header);
	canvas.appendChild(this.body);
	this.elem.appendChild(canvas);

	this.title = document.createElement('span');
	this.title.classList.add('ss-panel__title')

	var settingBtn = document.createElement('button');
	settingBtn.innerHTML = '<i class="fa fa-cog" aria-label="Settings" title="Settings"></i>';
	settingBtn.classList.add('ss-panel__settingBtn');
	settingBtn.addEventListener('click', function(e) {
		that.onSettingListener();
	});
	header.appendChild(this.title);
	header.appendChild(settingBtn);
}

Panel.prototype.setTitle = function(title) {
	this.title.textContent = title;
}

Panel.prototype.setBody = function(body) {
	this.body.appendChild(body);
}

Panel.prototype.onSetting = function(cb) {
	this.onSettingListener = cb;
}

Panel.prototype.getEl = function() {
	return this.elem;
}

PanelWrapper.Panel = Panel;

module.exports = PanelWrapper;