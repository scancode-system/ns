"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var observable_1 = require("tns-core-modules/data/observable");
var frame_1 = require("tns-core-modules/ui/frame");
var settings = require("tns-core-modules/application-settings");
var ProductCategoriesModel = /** @class */ (function (_super) {
    __extends(ProductCategoriesModel, _super);
    function ProductCategoriesModel() {
        return _super.call(this) || this;
    }
    ProductCategoriesModel.prototype.loaded = function (args) {
        var products = JSON.parse(settings.getString('products', '[]'));
        var categories = [];
        products.forEach(function (product) {
            var less = true;
            categories.forEach(function (category) {
                if (product.product_category.description == category.description) {
                    less = false;
                }
            });
            if (less) {
                categories.push(product.product_category);
            }
        });
        this.set('categories', categories);
    };
    ProductCategoriesModel.prototype.gotoProducts = function (args) {
        frame_1.Frame.getFrameById('products-frame').navigate({ moduleName: "views/tab/products/products/products-page", context: args.view.bindingContext.id, backstackVisible: false });
    };
    return ProductCategoriesModel;
}(observable_1.Observable));
exports.ProductCategoriesModel = ProductCategoriesModel;
