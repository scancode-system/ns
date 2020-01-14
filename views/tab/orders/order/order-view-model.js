"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var observable_1 = require("tns-core-modules/data/observable");
var frame_1 = require("tns-core-modules/ui/frame");
var axios_1 = require("axios");
var settings = require("tns-core-modules/application-settings");
var dialogs = require("tns-core-modules/ui/dialogs");
var OrderModel = /** @class */ (function (_super) {
    __extends(OrderModel, _super);
    function OrderModel(id) {
        return _super.call(this) || this;
    }
    OrderModel.prototype.loaded = function (args) {
        if (args === void 0) { args = null; }
        this.set('visibility_processing', 'collapsed');
        this.set('visibility_page', 'visible');
        this.set('order', JSON.parse(settings.getString('order')));
    };
    OrderModel.prototype.gotoClient = function () {
        var order_client = this.order.order_client;
        if (order_client.client_id) {
            frame_1.Frame.getFrameById('orders-frame').navigate({ moduleName: "views/tab/orders/order/client/client-show/client-show-page", context: { id: order_client.client_id, buyer: order_client.buyer, phone: order_client.phone, email: order_client.email }, backstackVisible: false });
        }
        else {
            frame_1.Frame.getFrameById('orders-frame').navigate({ moduleName: "views/tab/orders/order/client/client-list/client-list-page", backstackVisible: false });
        }
    };
    OrderModel.prototype.gotoPayment = function () {
        frame_1.Frame.getFrameById('orders-frame').navigate("views/tab/orders/order/payment/payment-page");
    };
    OrderModel.prototype.gotoObservation = function () {
        frame_1.Frame.getFrameById('orders-frame').navigate("views/tab/orders/order/observation/observation-page");
    };
    OrderModel.prototype.gotoDelivery = function () {
        frame_1.Frame.getFrameById('orders-frame').navigate("views/tab/orders/order/delivery/delivery-page");
    };
    OrderModel.prototype.gotoShippingCompany = function () {
        frame_1.Frame.getFrameById('orders-frame').navigate("views/tab/orders/order/shipping-company/shipping-company-page");
    };
    OrderModel.prototype.discountPrompt = function () {
        var _this = this;
        dialogs.prompt({
            title: "Desconto",
            message: "O desconto será atribuído a cada item no pedido. Lembrando que alguns items pode ter limitação na porcentagem de desconto.",
            okButtonText: "Confirmar",
            cancelButtonText: "Cancelar",
            defaultText: "",
            inputType: dialogs.inputType.number
        }).then(function (result) {
            if (result.result && result.text != '') {
                _this.set('visibility_processing', 'visible');
                _this.set('visibility_page', 'collapsed');
                _this.set('processing_message', 'Aplicando desconto');
                axios_1.default.put(settings.getString("api") + '/orders/' + _this.order.id + '/updateDiscount', { discount: result.text }, { auth: { username: settings.getString("username"), password: settings.getString("password") } }).then(function (result) {
                    settings.setString('order', JSON.stringify(result.data));
                    _this.loaded();
                }, function (error) {
                    if (error.response.status == 401) {
                        settings.remove('saller');
                        settings.remove('products');
                        settings.remove('clients');
                        settings.remove('shipping_companies');
                        frame_1.Frame.getFrameById("root-frame").navigate({ moduleName: "views/login/login-page", clearHistory: true });
                    }
                    else if (error.response.status == 422) {
                        var errors = Object.keys(error.response.data.errors);
                        alert(error.response.data.errors[errors[0]][0]);
                    }
                    else if (error.response.status == 403) {
                        alert(error.response.data);
                    }
                    else {
                        alert('Chame o administrador do sistema');
                        alert(error.response.data.message);
                    }
                    _this.loaded();
                });
            }
        });
    };
    OrderModel.prototype.completedTap = function (args) {
        dialogs.confirm("Deseja concluir o pedido?").then(function (result) {
            if (result) {
                this.completed();
            }
        }.bind(this));
    };
    OrderModel.prototype.completed = function (args) {
        var _this = this;
        this.set('visibility_processing', 'visible');
        this.set('visibility_page', 'collapsed');
        this.set('processing_message', 'Concluindo Pedido');
        axios_1.default.put(settings.getString("api") + '/orders/' + this.order.id, { status_id: 2 }, { auth: { username: settings.getString("username"), password: settings.getString("password") } }).then(function (result) {
            alert('Pedido Concluído');
            frame_1.Frame.getFrameById("orders-frame").navigate({ moduleName: "views/tab/orders/orders-page", clearHistory: true });
        }, function (error) {
            if (error.response.status == 401) {
                settings.remove('saller');
                settings.remove('products');
                settings.remove('clients');
                settings.remove('shipping_companies');
                frame_1.Frame.getFrameById("root-frame").navigate({ moduleName: "views/login/login-page", clearHistory: true });
            }
            else {
                _this.set('visibility_processing', 'collapsed');
                _this.set('visibility_page', 'visible');
                alert(error.response.data.message);
            }
        });
    };
    OrderModel.prototype.reserveTap = function (args) {
        dialogs.confirm("Deseja resevar o pedido?").then(function (result) {
            if (result) {
                this.reserve();
            }
        }.bind(this));
    };
    OrderModel.prototype.reserve = function (args) {
        this.set('visibility_processing', 'visible');
        this.set('visibility_page', 'collapsed');
        this.set('processing_message', 'Reservando Pedido');
        axios_1.default.put(settings.getString("api") + '/orders/' + this.order.id, { status_id: 4 }, { auth: { username: settings.getString("username"), password: settings.getString("password") } }).then(function (result) {
            frame_1.Frame.getFrameById("orders-frame").navigate({ moduleName: "views/tab/orders/orders-page", clearHistory: true });
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
                alert(error.response.data.message);
            }
        });
    };
    OrderModel.prototype.cancelTap = function (args) {
        dialogs.confirm("Deseja cancelar o pedido?").then(function (result) {
            if (result) {
                this.cancel();
            }
        }.bind(this));
    };
    OrderModel.prototype.cancel = function () {
        this.set('visibility_processing', 'visible');
        this.set('visibility_page', 'collapsed');
        this.set('processing_message', 'Cancelando Pedido');
        axios_1.default.put(settings.getString("api") + '/orders/' + this.order.id, { status_id: 3 }, { auth: { username: settings.getString("username"), password: settings.getString("password") } }).then(function (result) {
            frame_1.Frame.getFrameById("orders-frame").navigate({ moduleName: "views/tab/orders/orders-page", clearHistory: true });
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
                alert(error.response.data.message);
            }
        });
    };
    OrderModel.prototype.printTap = function (args) {
        var _this = this;
        this.set('visibility_processing', 'visible');
        this.set('visibility_page', 'collapsed');
        this.set('processing_message', 'Solicitando impressão');
        axios_1.default.get(settings.getString("api") + '/print_auto/' + this.order.id, { auth: { username: settings.getString("username"), password: settings.getString("password") } }).then(function (result) {
            alert('Impressão Solicitada');
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
                alert(error.response.data.message);
            }
        });
    };
    OrderModel.prototype.homeTap = function (args) {
        frame_1.Frame.getFrameById("orders-frame").navigate({ moduleName: "views/tab/orders/orders-page", clearHistory: true });
    };
    return OrderModel;
}(observable_1.Observable));
exports.OrderModel = OrderModel;
