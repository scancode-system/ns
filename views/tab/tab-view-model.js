"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var observable_1 = require("tns-core-modules/data/observable");
var axios_1 = require("axios");
var settings = require("tns-core-modules/application-settings");
var frame_1 = require("tns-core-modules/ui/frame");
var TabModel = /** @class */ (function (_super) {
    __extends(TabModel, _super);
    function TabModel() {
        var _this = _super.call(this) || this;
        _this.visibility_processing_tab = 'collapsed';
        _this.visibility_tab = 'visible';
        _this.visibility_products = 'collapsed';
        //let order = JSON.parse(settings.getString('order'));
        if (JSON.parse(settings.getString('order', null))) {
            _this.orders_frame = 'views/tab/orders/order/order-page';
        }
        else {
            _this.orders_frame = 'views/tab/orders/orders-page';
        }
        _this.on(observable_1.Observable.propertyChangeEvent, function (propertyChangeData) {
            if (propertyChangeData.propertyName === "search") {
                _this.filter();
            }
        }, _this);
        _this.on(observable_1.Observable.propertyChangeEvent, function (propertyChangeData) {
            if (propertyChangeData.propertyName === "scan") {
                _this.scannig();
            }
        }, _this);
        return _this;
    }
    TabModel.prototype.loaded = function (args) {
        var thisModel = this;
        setTimeout(function () {
            thisModel.scanFocus();
        }, 500);
    };
    TabModel.prototype.scanFocus = function () {
        var txt = frame_1.Frame.getFrameById('root-frame').getViewById('text-view-scan');
        if (txt) {
            txt.focus();
            txt.dismissSoftInput();
        }
    };
    TabModel.prototype.scannig = function () {
        var txt = frame_1.Frame.getFrameById('root-frame').getViewById('text-view-scan');
        if ((this.scan.match(/\n/g) || []).length == 1) {
            txt.dismissSoftInput();
            var search = txt.text;
            txt.text = '';
            search = search.replace(/(\r\n\t|\n|\r\t)/gm, "");
            console.log(search);
            this.searchProduct(search);
        }
    };
    TabModel.prototype.searchProduct = function (search) {
        var products = JSON.parse(settings.getString('products', '[]'));
        var product = products.find(function (product) {
            var located = false;
            if (product.barcode == search) {
                located = true;
            }
            if (product.sku == search) {
                located = true;
            }
            return located;
        });
        if (product) {
            frame_1.Frame.getFrameById('products-frame').navigate({ moduleName: "views/tab/products/product/product-page", context: product.id, backstackVisible: false });
            var tab_view = frame_1.Frame.getFrameById('root-frame').getViewById('tab-view');
            tab_view.selectedIndex = 2;
        }
        else {
            alert('Produto não encontrado, sincronize os dados clicando no botão superior direito, na barra de títulos.');
        }
    };
    TabModel.prototype.filter = function () {
        var _this = this;
        var products_all = JSON.parse(settings.getString('products', '[]'));
        var products = products_all.filter(function (product, index) {
            if (_this.search != "") {
                if (product.description.toLowerCase().indexOf(_this.search.toLowerCase()) != -1) {
                    return true;
                }
                if (product.sku.toLowerCase().indexOf(_this.search.toLowerCase()) != -1) {
                    return true;
                }
                if (product.barcode.toLowerCase().indexOf(_this.search.toLowerCase()) != -1) {
                    return true;
                }
            }
            return false;
        });
        products = products.slice(-10);
        this.set('products', products);
    };
    TabModel.prototype.gotoProduct = function (args) {
        this.action_back_tab();
        frame_1.Frame.getFrameById('products-frame').navigate({ moduleName: "views/tab/products/product/product-page", context: args.view.bindingContext.id, backstackVisible: false });
        var tab_view = frame_1.Frame.getFrameById('root-frame').getViewById('tab-view');
        tab_view.selectedIndex = 2;
        this.set('search', '');
    };
    TabModel.prototype.action_back_tab = function () {
        this.set('visibility_processing_tab', 'collapsed');
        this.set('visibility_tab', 'visible');
        this.set('visibility_products', 'collapsed');
    };
    TabModel.prototype.action_search = function () {
        this.set('visibility_processing_tab', 'collapsed');
        this.set('visibility_tab', 'collapsed');
        this.set('visibility_products', 'visible');
    };
    TabModel.prototype.action_refresh = function () {
        this.set('visibility_processing_tab', 'visible');
        this.set('visibility_tab', 'collapsed');
        this.set('visibility_products', 'collapsed');
        this.updateProducts();
    };
    TabModel.prototype.updateProducts = function () {
        var _this = this;
        this.set('visibility_processing_tab', 'visible');
        this.set('visibility_tab', 'collapsed');
        this.set('processing_message_tab', 'Sincronizando Produtos');
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
    TabModel.prototype.updateShippingCompanies = function () {
        var _this = this;
        this.set('processing_message_tab', 'Sincronizando Transportadoras');
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
    TabModel.prototype.updateClients = function () {
        var _this = this;
        this.set('processing_message_tab', 'Sincronizando Clientes');
        axios_1.default.get(settings.getString("api") + '/clients/load', { auth: { username: settings.getString("username"), password: settings.getString("password") } }).then(function (result) {
            settings.setString('clients', JSON.stringify(result.data));
            _this.set('visibility_processing_tab', 'collapsed');
            _this.set('visibility_tab', 'visible');
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
    return TabModel;
}(observable_1.Observable));
exports.TabModel = TabModel;
