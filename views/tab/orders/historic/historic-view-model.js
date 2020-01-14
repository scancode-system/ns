"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var observable_1 = require("tns-core-modules/data/observable");
var frame_1 = require("tns-core-modules/ui/frame");
var settings = require("tns-core-modules/application-settings");
var axios_1 = require("axios");
var HistoricModel = /** @class */ (function (_super) {
    __extends(HistoricModel, _super);
    function HistoricModel() {
        var _this = _super.call(this) || this;
        _this.visibility_processing = 'visible';
        _this.visibility_page = 'collapsed';
        _this.processing_message = 'Carregando pedidos';
        _this.saller = JSON.parse(settings.getString('saller'));
        axios_1.default.get(settings.getString("api") + '/orders/loadBySaller/' + _this.saller.id, { auth: { username: settings.getString("username"), password: settings.getString("password") } }).then(function (result) {
            var orders = result.data;
            orders.reverse();
            _this.set('orders', orders);
            var total = 0;
            var orders_count = 0;
            for (var _i = 0, orders_1 = orders; _i < orders_1.length; _i++) {
                var order = orders_1[_i];
                if (order.status_id == 2) {
                    orders_count++;
                    total += order.total;
                }
            }
            console.log(orders_count);
            _this.set('total', total);
            _this.set('orders_count', orders_count);
            _this.set('visibility_processing', 'collapsed');
            _this.set('visibility_page', 'visible');
        }, function (error) {
            if (error.response.status == 401) {
                settings.remove('saller');
                settings.remove('products');
                settings.remove('clients');
                settings.remove('shipping_companies');
                frame_1.Frame.getFrameById("root-frame").navigate({ moduleName: "views/login/login-page", clearHistory: true });
            }
            else {
                alert('Chame o administrador do sistema');
                _this.set('visibility_processing', 'collapsed');
                _this.set('visibility_page', 'visible');
            }
        });
        return _this;
    }
    HistoricModel.prototype.selectOrder = function (args) {
        var _this = this;
        this.set('visibility_processing', 'visible');
        this.set('visibility_page', 'collapsed');
        this.set('processing_message', 'Carregando pedido');
        axios_1.default.get(settings.getString("api") + '/orders/' + args.view.bindingContext.id, { auth: { username: settings.getString("username"), password: settings.getString("password") } }).then(function (result) {
            settings.setString('order', JSON.stringify(result.data));
            frame_1.Frame.getFrameById('orders-frame').navigate({ moduleName: "views/tab/orders/order/order-page", context: result.data.id });
        }, function (error) {
            if (error.response.status == 401) {
                settings.remove('saller');
                settings.remove('products');
                settings.remove('clients');
                settings.remove('shipping_companies');
                frame_1.Frame.getFrameById("root-frame").navigate({ moduleName: "views/login/login-page", clearHistory: true });
            }
            else {
                alert('Chame o administrador do sistema');
                _this.set('visibility_processing', 'collapsed');
                _this.set('visibility_page', 'visible');
            }
        });
    };
    return HistoricModel;
}(observable_1.Observable));
exports.HistoricModel = HistoricModel;
