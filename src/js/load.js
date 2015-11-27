/*
 * Authantication
 * @param mode: private || public
 */
var jQuery = require('jquery');
var DashboardModel = require('./dashboardModel');

module.exports = function(cb) {
	var hash = window.location.hash.substr(1);
	if(hash) {
		//private
		var params = parsequery(hash);
    var dashboardModel = new DashboardModel(params.app_id, params.mode, params.db);
		init(dashboardModel, cb);
	}else{
		cb(new Error("app_id not found"));
	}
}

function getItem(key) {
    var str = localStorage.getItem(key);
    try{
      return JSON.parse(str);
    }catch(e){
      return [];
    }
}

function init(dashboardModel, cb) {
    var milkcocoa = new MilkCocoa(dashboardModel.app_id + ".mlkcca.com");
    if(dashboardModel.mode == 'private') {
        var pathlist = getItem('mlkcca.'+dashboardModel.app_id+'.pathlist');
        milkcocoa.user(function(err, user) {
            if(!user) {
                get_admin_token(function(err, data) {
                    if(err) {
                        cb(null, milkcocoa, pathlist, dashboardModel);
                        return;
                    }
                    milkcocoa.authAsAdmin(data.token, function(err, user) {
                      cb(null, milkcocoa, pathlist, dashboardModel);
                    });
                })
            }else{
              cb(null, milkcocoa, pathlist, dashboardModel);
            }
        });
    }else if(dashboardModel.mode == 'public'){
    	cb(null, milkcocoa, undefined, dashboardModel);
    }
}

function get_admin_token(cb) {
	var top_url = "https://v2-stage-top.mlkcca.com/api/getusertoken"
	if(location.host == 'mlkcca.com') {
		top_url = "https://v2-production-top.mlkcca.com/api/getusertoken";
	}
    jQuery.ajax({
          type: 'GET',
          url: top_url,
          dataType: "json",
          data: {},
          contentType : "application/x-www-form-urlencoded",
          xhrFields: {
               withCredentials: true
          },
          crossDomain: true,
          beforeSend: function(xhr) {

          },
          success: function(response){
                cb(null, response);
          },
          error: function (xhr) {
                cb(xhr.statusText, xhr.responseJSON);
          }
    });        
}

function get_pathlist(url, app_id, cb) {
    jQuery.ajax({
          type: 'GET',
          url: "https://"+url+"/dev",
          dataType: "json",
          data: {
          	cmd : 'pathlist2',
          	appid : app_id
          },
          xhrFields: {
               withCredentials: true
          },
          crossDomain: true,
          beforeSend: function(xhr) {

          },
          success: function(response){
                cb(response);
          },
          error: function (xhr) {
                cb(xhr.responseJSON);
          }
    });        
}

function parsequery(str) {
	var params = {};
	str.split('&').forEach(function(s) {
		var ss = s.split('=');
		params[ss[0]] = window.decodeURIComponent(ss[1]);
	});
	return params;
}







