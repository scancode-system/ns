"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var observable_1 = require("tns-core-modules/data/observable");
var axios_1 = require("axios");
var settings = require("tns-core-modules/application-settings");
var frame_1 = require("tns-core-modules/ui/frame");
var dialogs = require("tns-core-modules/ui/dialogs");
var utils = require("tns-core-modules/utils/utils");
var platform_1 = require("tns-core-modules/platform");
var ProductModel = /** @class */ (function (_super) {
    __extends(ProductModel, _super);
    function ProductModel(id) {
        var _this = _super.call(this) || this;
        _this.id = id;
        _this.url = settings.getString('url') + '/';
        return _this;
    }
    ProductModel.prototype.loaded = function (args) {
        var _this = this;
        //this.loadItem();
        this.set('visibility_processing', 'visible');
        this.set('visibility_page', 'collapsed');
        this.set('visibility_edit_item', 'collapsed');
        this.set('processing_message', 'Carregando Produto');
        axios_1.default.get(settings.getString("api") + '/products/' + this.id, { auth: { username: settings.getString("username"), password: settings.getString("password") } }).then(function (result) {
            _this.set('product', result.data);
            _this.loadItem(result.data.id);
            _this.set('visibility_processing', 'collapsed');
            _this.set('visibility_page', 'visible');
            if (_this.item.order_id) {
                _this.set('visibility_edit_item', 'visible');
            }
        }, function (error) {
            if (error.response.status == 401) {
                settings.remove('saller');
                settings.remove('products');
                settings.remove('clients');
                settings.remove('shipping_companies');
                frame_1.Frame.getFrameById("root-frame").navigate({ moduleName: "views/login/login-page", clearHistory: true });
            }
            else if (error.response.status == 404) {
                alert('Produto não encontrado');
            }
            else {
                alert('Chame o administrador do sistema');
            }
        });
    };
    ProductModel.prototype.loadItem = function (id) {
        var order = JSON.parse(settings.getString('order', null));
        if (order) {
            var item = order.items.find(function (item) {
                return item.product_id == id;
            });
            if (item) {
                this.set('item', { id: item.id, order_id: item.order_id, product_id: item.product_id, qty: item.qty, discount: Math.round(item.discount), price: item.price });
            }
            else {
                this.set('item', { id: null, order_id: order.id, product_id: this.id, qty: 1, discount: 0, price: this.product.price });
            }
        }
        else {
            this.set('item', { order_id: null });
        }
    };
    ProductModel.prototype.add = function (args) {
        this.updateQty(1);
    };
    ProductModel.prototype.remove = function (args) {
        if (this.item.qty > 1) {
            this.updateQty(-1);
        }
    };
    ProductModel.prototype.updateQty = function (qty) {
        this.set('item', { id: this.item.id, order_id: this.item.order_id, product_id: this.item.product_id, qty: (this.item.qty + qty), discount: this.item.discount, price: this.item.price });
    };
    ProductModel.prototype.updateDiscount = function (discount) {
        this.set('item', { id: this.item.id, order_id: this.item.order_id, product_id: this.item.product_id, qty: this.item.qty, discount: discount, price: this.item.price });
    };
    ProductModel.prototype.discountPrompt = function () {
        var _this = this;
        dialogs.prompt({
            message: "Inserir desconto no item",
            okButtonText: "Confirmar",
            cancelButtonText: "Cancelar",
            defaultText: "",
            inputType: dialogs.inputType.number
        }).then(function (result) {
            /* ATENÇÃO O TECLADO FICA LEVANTADO POR CAUSA DO TEXTVIWE PARA LEITURA DA BARRA DE CODIGO QUE VOLTA A FOCAR NELE */
            setTimeout(function () {
                if (platform_1.isIOS) {
                    frame_1.Frame.topmost().nativeView.endEditing(true);
                }
                if (platform_1.isAndroid) {
                    utils.ad.dismissSoftInput();
                }
            }, 50);
            _this.updateDiscount(result.text);
        });
    };
    ProductModel.prototype.confirm = function (args) {
        this.set('visibility_processing', 'visible');
        this.set('visibility_page', 'collapsed');
        this.set('visibility_edit_item', 'collapsed');
        this.set('processing_message', 'Atualizando a Sacola');
        if (this.item.id) {
            this.put();
        }
        else {
            this.post();
        }
    };
    ProductModel.prototype.post = function () {
        var _this = this;
        console.log(settings.getString("api") + '/items/' + this.item.order_id);
        axios_1.default.post(settings.getString("api") + '/items/' + this.item.order_id, this.item, { auth: { username: settings.getString("username"), password: settings.getString("password") } }).then(function (result) {
            settings.setString('order', JSON.stringify(result.data));
            frame_1.Frame.getFrameById('products-frame').goBack();
            var tab_view = frame_1.Frame.getFrameById('root-frame').getViewById('tab-view');
            tab_view.selectedIndex = 1;
        }, function (error) {
            console.log(error);
            console.log(error.response);
            _this.set('visibility_processing', 'collapsed');
            _this.set('visibility_page', 'visible');
            _this.set('visibility_edit_item', 'visible');
            if (error.response.status == 401 || error.response.status == 404) {
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
        });
    };
    ProductModel.prototype.put = function () {
        var _this = this;
        axios_1.default.put(settings.getString("api") + '/items/' + this.item.id, this.item, { auth: { username: settings.getString("username"), password: settings.getString("password") } }).then(function (result) {
            settings.setString('order', JSON.stringify(result.data));
            frame_1.Frame.getFrameById('products-frame').goBack();
            var tab_view = frame_1.Frame.getFrameById('root-frame').getViewById('tab-view');
            tab_view.selectedIndex = 1;
        }, function (error) {
            _this.set('visibility_processing', 'collapsed');
            _this.set('visibility_page', 'visible');
            _this.set('visibility_edit_item', 'visible');
            if (error.response.status == 401 || error.response.status == 404) {
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
        });
    };
    return ProductModel;
}(observable_1.Observable));
exports.ProductModel = ProductModel;
