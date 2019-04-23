'use strict';
var app = require('playgrd_controllers/cartridge/scripts/app');
var guard = require('playgrd_controllers/cartridge/scripts/guard');


function productList(){
    var txn = require("dw/system/Transaction");
    var wishList = getWishList( customer );
    var product = dw.catalog.ProductMgr.getProduct( "008884304047" );
    

    txn.wrap(function (){
        for(var i = 0; i < 1000; i++){
            //item = wishList.createProductItem(product);
            //item.setQuantityValue(1);    
        }
    });

    app.getView({
        date: new Date(),
        wishList: wishList
    }).render('quota/productlist');

}


function getWishList( customer ){
    var txn = require("dw/system/Transaction");
	var productListMgr = require("dw/customer/ProductListMgr");
	var productList = productListMgr.getProductLists( customer, dw.customer.ProductList.TYPE_CUSTOM_1 );	
	if( productList.length == 0){
		// create new
		var newProductList;
		txn.wrap(function(){
			newProdurequirectList = productListMgr.createProductList( customer, dw.customer.ProductList.TYPE_CUSTOM_1 );
		});
		return newProductList;
	}
	else{
		// return the first list
		return productList[0];
	}
}

function showProductList(){
    var customer = customer;
    var productListId = request.httpParameterMap.plid.stringValue;
	var productListMgr = require("dw/customer/ProductListMgr");
    var productList = productListMgr.getProductList(productListId);

    app.getView({
        customer: customer,
        productList: productList
    }).render('quota/showproductlist');
    
    
}


function showCustomer(){
    var customerId = request.httpParameterMap.cid.stringValue;
    var customer = dw.customer.CustomerMgr.getCustomer( customerId );
    
    response.getWriter().println( customer );

}


exports.ProductList = guard.ensure(['get'], productList);
exports.ShowProductList = guard.ensure(['get'], showProductList);
exports.ShowCustomer = guard.ensure(['get'], showCustomer);
