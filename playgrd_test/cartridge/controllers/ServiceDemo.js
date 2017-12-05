'use strict';

var LocalServiceRegistry = require( "dw/svc/LocalServiceRegistry" );
var guard = require('playgrd_controllers/cartridge/scripts/guard');



function makePostWithJsonPayload(){
	var myHttpService:HTTPService = LocalServiceRegistry.createService("playgrd_test.http.test", {
		mockCall: function(svc:HTTPService, params) {
			return {"message":"hello this is a mock result"};
		},
		createRequest: function(svc:HTTPService, params) {
			var serviceConfig:ServiceConfig = svc.getConfiguration();
			var serviceCredential:ServiceCredential = serviceConfig.getCredential();
			var url = svc.getURL() + "/api/v2/user_token/"; // append path to the domain that is specified in the credential
			svc.setAuthentication("NONE"); // disable basic authentication
			svc.setRequestMethod("POST"); // set the request method because the default is POST
			svc.addHeader( "Authorization", "Bearer " + serviceCredential.custom.customAuthToken ); // set the auth token			
			svc.setURL( url ); // set the url of the request
			var jsonObject = {
				"auth": {
					"email": "test",
					"password": "password"
				}
			}			
			return JSON.stringify(jsonObject);
		},
		parseResponse: function(svc:HTTPService, output) {
			var result = JSON.parse( output.text );
			return result;
		}
	});
	var result:Result = myHttpService.call(); // you can give it some parameters if needed
	var print = ( result.ok ) ? JSON.stringify(result.object) : result.errorMessage;
	response.setContentType( "application/json" );
	response.getWriter().println( print );
}


function makeTokenizedCall(){
	var myHttpService:HTTPService = LocalServiceRegistry.createService("playgrd_test.http.test", {
		mockFull: function(svc:HTTPService, params) {
			return {"message":"hello this is a mock result"};
		},
		createRequest: function(svc:HTTPService, params) {
			var serviceConfig:ServiceConfig = svc.getConfiguration();
			var serviceCredential:ServiceCredential = serviceConfig.getCredential();
			var url = svc.getURL() + "/api/v2/archive/download/10/1"; // append path to the domain that is specified in the credential
			svc.setAuthentication("NONE"); // disable basic authentication
			svc.setRequestMethod("GET"); // set the request method because the default is POST
			svc.addHeader( "Authorization", "Bearer " + serviceCredential.custom.customAuthToken ); // set the auth token			
			svc.setURL( url ); // set the url of the request
		},
		parseResponse: function(svc:HTTPService, output) {
			var result = JSON.parse( output.text );
			return result;
		}
	});
	var result:Result = myHttpService.call(); // you can give it some parameters if needed
	var print = ( result.ok ) ? JSON.stringify(result.object) : result.errorMessage;
	response.setContentType( "application/json" );
	response.getWriter().println( print );
}

function makeBasicAuthCall(){
	var myHttpService:HTTPService = LocalServiceRegistry.createService("playgrd_test.http.test", {
		mockFull: function(svc:HTTPService, params) {
			return {"message":"hello this is a mock result"};
		},
		createRequest: function(svc:HTTPService, params) {
			var url = svc.getURL() + "/api/v2/archive/download/10/1"; // append path to the domain that is specified in the credential			
			svc.setAuthentication("BASIC"); // ENABLE basic authentication
			svc.setRequestMethod("GET"); // set the request method because the default is POST			
			svc.setURL( url ); // set the url of the request
		},
		parseResponse: function(svc:HTTPService, output) {
			var result = JSON.parse( output.text );
			return result;
		}
	});
	var result:Result = myHttpService.call(); // you can give it some parameters if needed
	var print = ( result.ok ) ? JSON.stringify(result.object) : result.errorMessage;
	response.setContentType( "application/json" );
	response.getWriter().println( print );
}

exports.MakeTokenizedCall        = guard.ensure(['https'], makeTokenizedCall);       // demonstrates how to make a real callout using token-based authentication
exports.MakeBasicAuthCall        = guard.ensure(['https'], makeBasicAuthCall);       // demonstrates how to make a real callout using basic authentication
exports.MakePostWithJsonPayload  = guard.ensure(['https'], makePostWithJsonPayload); // demonstrates how to make a real callout with JSON value in the payload