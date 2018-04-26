'use strict';
var guard = require('playgrd_controllers/cartridge/scripts/guard');




function show(){
	var app      = require('playgrd_controllers/cartridge/scripts/app');
	var ISML     = require('dw/template/ISML');
	var URLUtils = require('dw/web/URLUtils');

	app.getForm('sampleform').clear();
	app.getView({
		ContinueURL: dw.web.URLUtils.https('Form-Submit')
	}).render('form/formShow');
}

function submit(){
	var app   = require('playgrd_controllers/cartridge/scripts/app');
	var URLUtils = require('dw/web/URLUtils');
	var trx = require("dw/system/Transaction");
	app.getForm('sample').handleAction({
		cancel: function () {
			app.getForm('sampleform').clear();
			response.redirect(URLUtils.https('Form-Show'));
		}, 		    
		subscribe: function () {
			var myform = session.forms.sample;
			dw.system.Logger.error( "myform.fname.value" );
			trx.wrap(function(){
				dw.object.CustomObjectMgr.createCustomObject( "testCustom", myform.fname.value );
			});
			
			app.getView().render('sample/sample');
		}
	});
}

exports.Show   = guard.ensure(["https", "get"], show);
exports.Submit = guard.ensure(["https","post"], submit);
