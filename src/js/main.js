var CreatePanelModal = require('./CreatePanelModal');
var PanelWrapper = require('./core/panel');
var plugins = require('./plugins');
var load = require('./load');

window.addEventListener('load', function(e) {
	load(function(err, milkcocoa) {
		if(err) {
			throw err;
		}
		init(milkcocoa);
	});
});

function init(milkcocoa) {
	var panelWrapper = new PanelWrapper('panel-wrapper');
	var btn = document.getElementById('show-create-panel-modal-btn');
	btn.addEventListener('click', function(e) {
		showCreatePanelModal(function(values) {
			var panel = new PanelWrapper.Panel();
			panel.setTitle(values.name);
			var widgets = plugins.widgets.filter(function(w) {return w.name==values.type;});
			if(widgets[0]) {
				var datastore = milkcocoa.dataStore(values.datastore);
				var w = new widgets[0].widget(datastore);
				panel.setBody(w.getEl());
			}
			panelWrapper.append(panel);
		});
	});	
}

function showCreatePanelModal(cb) {
	var widgetNames = plugins.widgets.map(function(w) {return w.name;});
	//var modal = new CreatePanelModal({pathlist:['aaa', 'bbb']});
	var modal = new CreatePanelModal({widgetNames : widgetNames});
	modal.ok(cb);
	modal.open();
}