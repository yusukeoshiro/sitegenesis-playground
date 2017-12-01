'use strict';

var LocalServiceRegistry = require( "dw/svc/LocalServiceRegistry" );
var guard = require('playgrd_controllers/cartridge/scripts/guard');


function makeMockCall(){

	var myHttpService = LocalServiceRegistry.createService("playgrd_test.http.test", {
		mockCall : function(svc:HTTPService, params) {
			dw.system.Logger.error( "EXECUTING MOCK CALL" );
			return {"message":"hello world"};
		},
		mockExec : function(svc:HTTPService, params) {
			dw.system.Logger.error( "EXECUTING MOCK EXEC" );
			return {"message":"hello world"};
		},
		createRequest: function(svc:HTTPService, params) {
			dw.system.Logger.error( "EXECUTING CREATE REQUEST" );
			svc.setRequestMethod("GET"); // set the request method because the default is POST
			var url = svc.getURL() + "/api/v2/archive/download/10/1"; // append path to the domain that is specified in the credential
			svc.setURL( url ); // set the url of the request
		},
		parseResponse : function(svc:HTTPService, output) {
			dw.system.Logger.error( "EXECUTING PARSE RESPONSE" );
			var result = JSON.parse( output.text );
			return result;
		}
	});
	
	var result = myHttpService.call();
	//var result = myHttpService.setMock().call();
	response.getWriter().println( JSON.stringify( result.object ) );

}

exports.MakeMockCall = guard.ensure(['https'], makeMockCall);
