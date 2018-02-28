'use strict';

/**
 * Controller handling search, category, and suggestion pages.
 *
 * @module controllers/Search
 */

/* API Includes */
var SearchJs = require("playgrd_controllers/cartridge/controllers/Search.js");
var PagingModel = require('dw/web/PagingModel');
var URLUtils = require('dw/web/URLUtils');
var ContentMgr = require('dw/content/ContentMgr');
var SearchModel = require('dw/catalog/SearchModel');

/* Script Modules */
var app = require('playgrd_controllers/cartridge/scripts/app');
var guard = require('playgrd_controllers/cartridge/scripts/guard');

function showContent() {

    var params = request.httpParameterMap;

    var Search = require("~/cartridge/scripts/models/SearchModel.js");
    var productSearchModel = Search.initializeProductSearchModel(params);
    var contentSearchModel = Search.initializeContentSearchModel(params);

    // Executes the product search.
    productSearchModel.search();
    contentSearchModel.search();

    if (productSearchModel.emptyQuery && contentSearchModel.emptyQuery) {
        response.redirect(URLUtils.abs('Home-Show'));
    } else if (contentSearchModel.count > 0) {

        var contentPagingModel = new PagingModel(contentSearchModel.content, contentSearchModel.count);
        contentPagingModel.setPageSize(16);
        if (params.start.submitted) {
            contentPagingModel.setStart(params.start.intValue);
        }

        if (contentSearchModel.folderSearch && !contentSearchModel.refinedFolderSearch && contentSearchModel.folder.template) {
            // Renders a dynamic template
            app.getView({
                ProductSearchResult: productSearchModel,
                ContentSearchResult: contentSearchModel,
                ContentPagingModel: contentPagingModel
            }).render(contentSearchModel.folder.template);
        } else {
            app.getView({
                ProductSearchResult: productSearchModel,
                ContentSearchResult: contentSearchModel,
                ContentPagingModel: contentPagingModel
            }).render('rendering/folder/foldercontenthits');
        }
    } else {
        app.getView({
            ProductSearchResult: productSearchModel,
            ContentSearchResult: contentSearchModel
        }).render('search/nohits');
    }

}

exports.Show           = SearchJs.Show;
exports.ShowContent    = guard.ensure(['get'], showContent); // OVERRIDE
exports.GetSuggestions = SearchJs.GetSuggestions;