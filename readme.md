# Indexed Search on Product

Usecase: 
Search against commerce cloud search engine using built on custom field.
For this demo case, a custom field called "myCustomField" (string type) was created on Product object.

Demo.js demonstrates how to take advantage of the built-in search engine. 

## Prerequisite:
* Create a new custom field on product called "myCustomField"
* Make this field "searchable". 
    * Go to Merchant Tools > Search > Searchable Attributes
    * Click on "New" on "Product Index Attributes" and add the field you want to index.
* Add this field in "Search Refinement Definition" on any of the categories in the product.
    * Go to Merchant Tools > Product and Catalogs > Catalogs
    * Select any category and click on "Edit"
    * Go to tab called "Search Refinement Definitions"
    * Click on "New" to add the new field.
* Rebuild the index
    * You should already be familiar with this! 

Done! 