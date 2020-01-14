"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var observable_1 = require("tns-core-modules/data/observable");
var frame_1 = require("tns-core-modules/ui/frame");
var settings = require("tns-core-modules/application-settings");
var axios_1 = require("axios");
var ShippingCompanyModel = /** @class */ (function (_super) {
    __extends(ShippingCompanyModel, _super);
    function ShippingCompanyModel() {
        var _this = _super.call(this) || this;
        _this.visibility_processing = 'collapsed';
        _this.visibility_page = 'visible';
        _this.on(observable_1.Observable.propertyChangeEvent, function (propertyChangeData) {
            if (propertyChangeData.propertyName === "search") {
                _this.updateShippingCompany();
            }
        }, _this);
        return _this;
    }
    ShippingCompanyModel.prototype.updateShippingCompany = function () {
        var _this = this;
        var shipping_companies_all = JSON.parse(settings.getString('shipping_companies', '[]'));
        var shipping_companies = shipping_companies_all.filter(function (shipping_company, index) {
            if (_this.search != "") {
                if (shipping_company.id.toString().indexOf(_this.search) != -1) {
                    return true;
                }
                if (shipping_company.name.toLowerCase().indexOf(_this.search.toLowerCase()) != -1) {
                    return true;
                }
            }
            return false;
        });
        shipping_companies = shipping_companies.slice(-5);
        this.set('shipping_companies', shipping_companies);
    };
    ShippingCompanyModel.prototype.itemTapUpdate = function (args) {
        this.update(args.view.bindingContext.id);
    };
    ShippingCompanyModel.prototype.update = function (id) {
        var _this = this;
        this.set('visibility_processing', 'visible');
        this.set('visibility_page', 'collapsed');
        this.set('processing_message', 'Atualizando Transportadora');
        axios_1.default.put(settings.getString("api") + '/orders/' + JSON.parse(settings.getString('order')).id, { shipping_company_id: id }, { auth: { username: settings.getString("username"), password: settings.getString("password") } }).then(function (result) {
            settings.setString('order', JSON.stringify(result.data));
            frame_1.Frame.getFrameById('orders-frame').goBack();
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
                alert('Chame o administrador do sistema');
            }
            _this.set('visibility_processing', 'collapsed');
            _this.set('visibility_page', 'visible');
        });
    };
    ShippingCompanyModel.prototype.store = function (args) {
        var _this = this;
        this.set('visibility_processing', 'visible');
        this.set('visibility_page', 'collapsed');
        this.set('processing_message', 'Cadastrando nova Transportadora');
        axios_1.default.post(settings.getString("api") + '/shipping_companies', { name: this.name }, { auth: { username: settings.getString("username"), password: settings.getString("password") } }).then(function (result) {
            _this.update(result.data.id);
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
    return ShippingCompanyModel;
}(observable_1.Observable));
exports.ShippingCompanyModel = ShippingCompanyModel;
