'use strict';

var guard = require('playgrd_controllers/cartridge/scripts/guard');

function dumpRequest(){
    var app = require('playgrd_controllers/cartridge/scripts/app');
    app.getView({
        request: request
    }).render('dump/request');
}

exports.DumpRequest = guard.ensure([], dumpRequest);