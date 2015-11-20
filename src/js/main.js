var CreatePanelModal = require('./CreatePanelModal');
var PanelWrapper = require('./core/panel');
var plugins = require('./plugins');
var load = require('./load');

window.addEventListener('load', function(e) {
	load(function(err, milkcocoa, pathlist) {
		if(err) {
			throw err;
		}
		init(milkcocoa, pathlist);
	});
});

function init(milkcocoa, pathlist) {
	var panelWrapper = new PanelWrapper('panel-wrapper');
	var btn = document.getElementById('show-create-panel-modal-btn');
	btn.addEventListener('click', function(e) {
		showCreatePanelModal(pathlist, function(values) {
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

function showCreatePanelModal(pathlist, cb) {
	var widgetNames = plugins.widgets.map(function(w) {return w.name;});
	var modal = new CreatePanelModal({widgetNames : widgetNames, pathlist : pathlist});
	modal.ok(cb);
	modal.open();
}