'use strict';

var guard = require('playgrd_controllers/cartridge/scripts/guard');
var app = require('playgrd_controllers/cartridge/scripts/app');



function getPrice(){
    app.getView().render('demo/demo');
}


exports.GetPrice = guard.ensure(['get'], getPrice);