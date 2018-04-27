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
	let form = app.getForm('sampleform');

	form.handleAction({
		cancel: function () {
			app.getForm('sampleform').clear();
			response.redirect(URLUtils.https('Form-Show'));
		}, 		    
		subscribe: function () {
			var myform = session.forms.sampleform;
			dw.system.Logger.error( "myform.fname.value" );
			trx.wrap(function(){
				dw.object.CustomObjectMgr.createCustomObject( "testCustom", myform.fname.value );
			});
			response.redirect(URLUtils.https('Form-Show'));			
			// app.getView().render('form/formShow');
		},
		error: function(a,b) {
			dw.system.Logger.error('oh shit!!');
			// response.redirect(URLUtils.https('Form-Show'));
			app.getView().render('form/formShow');
		}
	});
}

function test() {
	dw.system.Logger.error('test');
}

exports.Show   = guard.ensure(["https", "get"], show);
exports.Submit = guard.ensure(["https","post"], submit);
exports.Test = guard.ensure(["get"], test);