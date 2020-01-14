"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var observable_1 = require("tns-core-modules/data/observable");
var frame_1 = require("tns-core-modules/ui/frame");
var settings = require("tns-core-modules/application-settings");
var axios_1 = require("axios");
var ClientShowModel = /** @class */ (function (_super) {
    __extends(ClientShowModel, _super);
    function ClientShowModel(id, buyer, phone, email) {
        if (buyer === void 0) { buyer = null; }
        if (phone === void 0) { phone = null; }
        if (email === void 0) { email = null; }
        var _this = _super.call(this) || this;
        _this.id = id;
        _this.order = JSON.parse(settings.getString('order'));
        _this.visibility_processing = 'visible';
        _this.visibility_page = 'collapsed';
        _this.processing_message = 'Carregando Cliente';
        _this.buyer = buyer;
        _this.email = email;
        _this.phone = phone;
        return _this;
    }
    ClientShowModel.prototype.loaded = function (args) {
        var _this = this;
        axios_1.default.get(settings.getString("api") + '/clients/load/' + this.id, { auth: { username: settings.getString("username"), password: settings.getString("password") } }).then(function (result) {
            _this.set('client', result.data);
            _this.setBuyer();
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
            }
        });
    };
    ClientShowModel.prototype.setBuyer = function () {
        var buyer = (this.order.order_client.buyer) ? this.order.order_client.buyer : this.client.buyer;
        var phone = (this.order.order_client.phone) ? this.order.order_client.phone : this.client.phone;
        var email = (this.order.order_client.email) ? this.order.order_client.email : this.client.email;
        if (!this.buyer) {
            this.set('buyer', buyer);
        }
        if (!this.email) {
            this.set('email', email);
        }
        if (!this.phone) {
            this.set('phone', phone);
        }
    };
    ClientShowModel.prototype.update = function (args) {
        var _this = this;
        this.set('visibility_processing', 'visible');
        this.set('visibility_page', 'collapsed');
        this.set('processing_message', 'Atualizando Cliente');
        axios_1.default.put(settings.getString("api") + '/orders/' + JSON.parse(settings.getString('order')).id, { client_id: this.id }, { auth: { username: settings.getString("username"), password: settings.getString("password") } }).then(function (result) {
            _this.updateBuyer();
        }, function (error) {
            if (error.response.status == 401) {
                settings.remove('saller');
                settings.remove('products');
                settings.remove('clients');
                settings.remove('shipping_companies');
                frame_1.Frame.getFrameById("root-frame").navigate({ moduleName: "views/login/login-page", clearHistory: true });
            }
            else if (error.response.status == 403) {
                alert(error.response.data);
            }
            else {
                console.log(error);
                console.log(error.response);
                alert('Chame o administrador do sistema');
            }
            _this.set('visibility_processing', 'collapsed');
            _this.set('visibility_page', 'visible');
        });
    };
    ClientShowModel.prototype.updateBuyer = function () {
        this.set('processing_message', 'Atualizando Comprador');
        axios_1.default.put(settings.getString("api") + '/orders/' + JSON.parse(settings.getString('order')).id + '/updateBuyer', { buyer: this.buyer, email: this.email, phone: this.phone }, { auth: { username: settings.getString("username"), password: settings.getString("password") } }).then(function (result) {
            settings.setString('order', JSON.stringify(result.data));
            frame_1.Frame.getFrameById('orders-frame').goBack();
        }, function (error) {
            console.log(error);
            if (error.response.status == 401) {
                settings.remove('saller');
                settings.remove('products');
                settings.remove('clients');
                settings.remove('shipping_companies');
                frame_1.Frame.getFrameById("root-frame").navigate({ moduleName: "views/login/login-page", clearHistory: true });
            }
            else {
                alert('Chame o administrador do sistema');
            }
        });
    };
    ClientShowModel.prototype.gotoList = function (args) {
        frame_1.Frame.getFrameById('orders-frame').navigate({ moduleName: "views/tab/orders/order/client/client-list/client-list-page", backstackVisible: false });
    };
    return ClientShowModel;
}(observable_1.Observable));
exports.ClientShowModel = ClientShowModel;
