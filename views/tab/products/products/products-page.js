"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var products_view_model_1 = require("./products-view-model");
function navigatingTo(args) {
    var page = args.object;
    page.bindingContext = new products_view_model_1.ProductsModel(page.navigationContext);
}
exports.navigatingTo = navigatingTo;
