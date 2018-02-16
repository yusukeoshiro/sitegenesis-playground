'use strict';

var guard = require('playgrd_controllers/cartridge/scripts/guard');

function webRequest(){
	response.setContentType( "application/json" );
	response.getWriter().println( print );


    //var app      = require('playgrd_controllers/cartridge/scripts/app');
    //var ISML     = require('dw/template/ISML');
    //var URLUtils = require('dw/web/URLUtils');
    //app.getView().render('dump/request');
}

exports.WebRequest        = guard.ensure(['https'], webRequest);       // demonstrates how to make a real callout using token-based authentication
