"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var observable_1 = require("tns-core-modules/data/observable");
var frame_1 = require("tns-core-modules/ui/frame");
var axios_1 = require("axios");
var settings = require("tns-core-modules/application-settings");
var LoginModel = /** @class */ (function (_super) {
    __extends(LoginModel, _super);
    function LoginModel() {
        var _this = _super.call(this) || this;
        _this.email = settings.getString('username');
        _this.password = settings.getString('password');
        return _this;
    }
    LoginModel.prototype.loaded = function () {
        var _this = this;
        this.set('visibility_processing', 'visible');
        this.set('visibility_page', 'collapsed');
        this.set('processing_message', 'Checando conexão');
        axios_1.default.get(settings.getString("api") + '/dashboard/check').then(function (result) {
            if (result.status == 200) {
                _this.set('visibility_processing', 'collapsed');
                _this.set('visibility_page', 'visible');
            }
            else {
                frame_1.Frame.getFrameById("root-frame").navigate({ moduleName: "views/url/url-page", clearHistory: true });
            }
        }, function (error) {
            frame_1.Frame.getFrameById("root-frame").navigate({ moduleName: "views/url/url-page", clearHistory: true });
        });
    };
    LoginModel.prototype.login = function () {
        var _this = this;
        this.set('visibility_processing', 'visible');
        this.set('visibility_page', 'collapsed');
        this.set('processing_message', 'Autenticando');
        axios_1.default.get(settings.getString("api") + '/sallers/auth', { auth: { username: this.email, password: this.password } }).then(function (result) {
            settings.setString('username', _this.email);
            settings.setString('password', _this.password);
            settings.setString('saller', JSON.stringify(result.data));
            _this.updateProducts();
        }, function (error) {
            if (error.response.status == 401) {
                alert('Login inválido');
                _this.set('visibility_processing', 'collapsed');
                _this.set('visibility_page', 'visible');
            }
            else {
                alert('Chame o administrador do sistema');
            }
        });
    };
    LoginModel.prototype.updateProducts = function () {
        var _this = this;
        this.set('processing_message', 'Sincronizando Produtos');
        axios_1.default.get(settings.getString("api") + '/products', { auth: { username: settings.getString("username"), password: settings.getString("password") } }).then(function (result) {
            settings.setString('products', JSON.stringify(result.data));
            _this.updateShippingCompanies();
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
    LoginModel.prototype.updateShippingCompanies = function () {
        var _this = this;
        this.set('processing_message', 'Sincronizando Transportadoras');
        axios_1.default.get(settings.getString("api") + '/shipping_companies/load', { auth: { username: settings.getString("username"), password: settings.getString("password") } }).then(function (result) {
            settings.setString('shipping_companies', JSON.stringify(result.data));
            _this.updateClients();
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
    LoginModel.prototype.updateClients = function () {
        this.set('processing_message', 'Sincronizando Clientes');
        axios_1.default.get(settings.getString("api") + '/clients/load', { auth: { username: settings.getString("username"), password: settings.getString("password") } }).then(function (result) {
            settings.setString('clients', JSON.stringify(result.data));
            frame_1.Frame.getFrameById("root-frame").navigate({ moduleName: "views/tab/tab-page", clearHistory: true });
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
    return LoginModel;
}(observable_1.Observable));
exports.LoginModel = LoginModel;
