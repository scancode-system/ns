"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var product_view_model_1 = require("./product-view-model");
function navigatingTo(args) {
    var page = args.object;
    page.bindingContext = new product_view_model_1.ProductModel(page.navigationContext);
}
exports.navigatingTo = navigatingTo;
