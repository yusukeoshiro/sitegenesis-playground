'use strict';

/* API Includes */
var Cart = require('~/cartridge/scripts/models/CartModel');
var PaymentMgr = require('dw/order/PaymentMgr');
var Transaction = require('dw/system/Transaction');

/* Script Modules */
var app = require('~/cartridge/scripts/app');





/**
 * Handle gets executed after the user has selected the payment method and clicked next.
 * Run preliminary validation and add the appropriate payment instrument to the cart
 * validation should be something like... checking the length of the string or checking against regex
 * It should not be something that makes authorization request to the external system.
 */
function Handle(args) {
    dw.system.Logger.info( 'handle is run' );

    var cart = Cart.get(args.Basket);    
    Transaction.wrap(function () {
        cart.removeExistingPaymentInstruments('MY_PAYMENT');
        cart.createPaymentInstrument('MY_PAYMENT', cart.getNonGiftCertificateAmount());        
    });

    return {success: true};
}

/**
 * Authorize gets executed just before placing the order.
 * When necessary, make external web request to external system and return whether success or failure
 */
function Authorize() {
    dw.system.Logger.info( 'Authorize is run' );    
    return {authorized: true};
}

exports.Handle = Handle;
exports.Authorize = Authorize;
