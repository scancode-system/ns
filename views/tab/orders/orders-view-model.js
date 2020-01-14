"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var observable_1 = require("tns-core-modules/data/observable");
var frame_1 = require("tns-core-modules/ui/frame");
var settings = require("tns-core-modules/application-settings");
var axios_1 = require("axios");
var OrdersModel = /** @class */ (function (_super) {
    __extends(OrdersModel, _super);
    function OrdersModel() {
        var _this = _super.call(this) || this;
        _this.loading = 'collapsed';
        _this.content = 'visible';
        settings.remove('order');
        return _this;
    }
    OrdersModel.prototype.loaded = function (args) {
    };
    OrdersModel.prototype.gotoHistoric = function () {
        frame_1.Frame.getFrameById('orders-frame').navigate({ moduleName: "views/tab/orders/historic/historic-page", backstackVisible: false });
    };
    OrdersModel.prototype.gotoOrder = function () {
        this.set('loading', 'visible');
        this.set('content', 'collapsed');
        axios_1.default.post(settings.getString("api") + '/orders', { saller_id: JSON.parse(settings.getString('saller')).id }, { auth: { username: settings.getString("username"), password: settings.getString("password") } }).then(function (result) {
            settings.setString('order', JSON.stringify(result.data));
            frame_1.Frame.getFrameById('orders-frame').navigate({ moduleName: "views/tab/orders/order/order-page", context: result.data.id });
        }, function (error) {
            alert(error.response.data.message);
        });
    };
    OrdersModel.prototype.logout = function () {
        settings.remove('saller');
        settings.remove('products');
        settings.remove('clients');
        settings.remove('shipping_companies');
        settings.remove('password');
        frame_1.Frame.getFrameById('root-frame').navigate({ moduleName: "views/login/login-page", clearHistory: true });
    };
    return OrdersModel;
}(observable_1.Observable));
exports.OrdersModel = OrdersModel;
