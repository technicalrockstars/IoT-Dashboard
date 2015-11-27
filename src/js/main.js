var CreatePanelModal = require('./CreatePanelModal');
var PanelWrapper = require('./core/panel');
var plugins = require('./plugins');
var load = require('./load');
var SettingModal = require('./SettingModal');
var SpanEditor = require('./SpanEditor');

window.addEventListener('load', function(e) {
	load(function(err, milkcocoa, pathlist, dashboardModel) {
		if(err) {
			throw err;
		}
		init(milkcocoa, pathlist, dashboardModel);
	});
});

function init(milkcocoa, pathlist, dashboardModel) {
	var spanEditor = new SpanEditor();
	var panelWrapper = new PanelWrapper('panel-wrapper');
	var btn = document.getElementById('show-create-panel-modal-btn');
	var shareBtn = document.getElementById('share-modal-btn');

	if(dashboardModel.mode == 'public') {
		var admin_header = document.getElementById('admin-header');
		admin_header.style.display = 'none';
	}
	btn.addEventListener('click', function(e) {
		showCreatePanelModal(pathlist, function(values) {
			dashboardModel.addWidget(values.name, values.datastore, values.type);
			createWidget(values.name, values.datastore, values.type, values);
		});
	});
	shareBtn.addEventListener('click', function(e) {
		dashboardModel.share();
	});
	dashboardModel.dashboard.forEach(function(d) {
		createWidget(d.name, d.datastore, d.type, d);
	});

	function createWidget(name, datastoreName, type, params) {
		var panel = new PanelWrapper.Panel();
		panel.setTitle(name);
		var widgets = plugins.widgets.filter(function(w) {return w.name==type;});
		if(widgets[0]) {
			var datastore = milkcocoa.dataStore(datastoreName);
			var w = new widgets[0].widget(datastore);
			panel.setBody(w.getEl());
			panel.onSetting(function() {
				var modal = new SettingModal();
				modal.setSettingsSchema(w.settings());
				modal.ok(function(r) {
					console.log(r);
					w.onSettingsUpdated(r);
				})
				modal.open();
			});
			spanEditor.on('change', function(e) {
				w.onSpanUpdated(e.start, e.end);
			});
		}
		panelWrapper.append(panel);
	}

}


function showCreatePanelModal(pathlist, cb) {
	var widgetNames = plugins.widgets.map(function(w) {return w.name;});
	var modal = new CreatePanelModal({widgetNames : widgetNames, pathlist : pathlist});
	modal.ok(cb);
	modal.open();
}