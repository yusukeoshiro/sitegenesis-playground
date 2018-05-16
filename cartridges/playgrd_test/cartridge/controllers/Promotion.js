'use strict'

const app = require('playgrd_controllers/cartridge/scripts/app');
const guard = require('playgrd_controllers/cartridge/scripts/guard');
const BasketMgr = require('dw/order/BasketMgr');
const Transaction = require('dw/system/Transaction');


const apply = function () {



    var cart = BasketMgr.getCurrentBasket();

    var items = cart.getProductLineItems().toArray();
    var item = items[0];

    Transaction.wrap(function () {

        // remove all other price adjustments
        currentPriceAdjustments = item.priceAdjustments.toArray();
        for ( var i = 0; i < currentPriceAdjustments.length; i++ ) {
            item.removePriceAdjustment( currentPriceAdjustments[i] );
        }

        // add a new one
        let discount = new dw.campaign.AmountDiscount( 500 );
        let priceAdjustment = item.createPriceAdjustment('CUSTOM_ADJUSTMENT', discount);
        priceAdjustment.lineItemText = 'ディスカウントが適応されました';

        const calculate = require('playgrd_core/cartridge/scripts/cart/calculate');
        calculate.calculate( cart );
    });

}


exports.Apply = guard.ensure([], apply);
