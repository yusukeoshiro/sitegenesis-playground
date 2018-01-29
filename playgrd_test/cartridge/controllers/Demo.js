'use strict';

var guard = require('playgrd_controllers/cartridge/scripts/guard');
var app = require('playgrd_controllers/cartridge/scripts/app');



function indexedSearch(){
    var SearchModel        = require("dw/catalog/SearchModel");
    var ProductSearchModel = require("dw/catalog/ProductSearchModel");
    var productSearchModel = new ProductSearchModel();
    
    productSearchModel.addRefinementValues("myCustomField", "indexed_value");
    productSearchModel.search();
    var result : Iterator = productSearchModel.getProducts();
    var products = [];
    while( result.hasNext() ){
        products.push( result.next() );
    }



    
    app.getView({
        products: products
    }).render('demo/demo');
}


exports.IndexedSearch = guard.ensure(['get'], indexedSearch);