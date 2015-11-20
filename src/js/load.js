/*
 * Authantication
 * @param mode: private || public
 */
var jQuery = require('jquery');

module.exports = function(cb) {
	var hash = window.location.hash.substr(1);
	if(hash) {
		//private
		var params = parsequery(hash);
		init(params.app_id, params.mode, cb);
	}else{
		cb(new Error("app_id not found"));
	}
}

function init(app_id, mode, cb) {
    var milkcocoa = new MilkCocoa(app_id + ".mlkcca.com");
    if(mode == 'private') {
	    milkcocoa.user(function(err, user) {
	        if(!user) {
	            get_admin_token(function(data) {
	                milkcocoa.authAsAdmin(data.token, function() {
	                	cb(null, milkcocoa);
	                });
	            })
	        }else{
	        	cb(null, milkcocoa);
	        }
	    });
    }else{
    	cb(null, milkcocoa);
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
                cb(response);
          },
          error: function (xhr) {
                cb(xhr.responseJSON);
          }
    });        
}

function query2string(params) {
	return Object.keys(params).map(function(k) {
		return k + '=' + params[k]
	}).join('&');
}

function parsequery(str) {
	var params = {};
	str.split('&').forEach(function(s) {
		var ss = s.split('=');
		params[ss[0]] = ss[1];
	});
	return params;
}
