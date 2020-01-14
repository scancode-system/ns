"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var observable_1 = require("tns-core-modules/data/observable");
var frame_1 = require("tns-core-modules/ui/frame");
var settings = require("tns-core-modules/application-settings");
var ProductsModel = /** @class */ (function (_super) {
    __extends(ProductsModel, _super);
    function ProductsModel(id) {
        var _this = _super.call(this) || this;
        _this.id = id;
        return _this;
    }
    ProductsModel.prototype.loaded = function (args) {
        var id = this.id;
        var products = JSON.parse(settings.getString('products', '[]'));
        products = products.filter(function (product) {
            return (product.product_category_id == id);
        });
        this.set('products', products);
    };
    ProductsModel.prototype.gotoProduct = function (args) {
        frame_1.Frame.getFrameById('products-frame').navigate({ moduleName: "views/tab/products/product/product-page", context: args.view.bindingContext.id, backstackVisible: false });
    };
    return ProductsModel;
}(observable_1.Observable));
exports.ProductsModel = ProductsModel;
