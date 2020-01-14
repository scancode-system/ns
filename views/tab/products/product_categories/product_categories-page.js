"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var product_categories_view_model_1 = require("./product_categories-view-model");
function navigatingTo(args) {
    var page = args.object;
    page.bindingContext = new product_categories_view_model_1.ProductCategoriesModel();
}
exports.navigatingTo = navigatingTo;
