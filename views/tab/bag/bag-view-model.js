"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var observable_1 = require("tns-core-modules/data/observable");
var settings = require("tns-core-modules/application-settings");
var axios_1 = require("axios");
var frame_1 = require("tns-core-modules/ui/frame");
var nativescript_barcodescanner_1 = require("nativescript-barcodescanner");
var dialogs = require("tns-core-modules/ui/dialogs");
var BagModel = /** @class */ (function (_super) {
    __extends(BagModel, _super);
    function BagModel() {
        var _this = _super.call(this) || this;
        _this.set('url', settings.getString('url') + '/');
        _this.visibility_processing = 'collapsed';
        _this.visibility_page = 'visible';
        return _this;
    }
    BagModel.prototype.loaded = function (args) {
        var order = JSON.parse(settings.getString('order', null));
        if (order) {
            this.set('items', order.items);
        }
        else {
            this.set('items', null);
        }
    };
    BagModel.prototype.onItemTapItem = function (args) {
        var _this = this;
        dialogs.action("", "Cancelar", ["Remover Item", "Editar Item"]).then(function (result) {
            console.log("Dialog result: " + result);
            if (result == "Remover Item") {
                _this.remove(args.view.bindingContext.id);
            }
            else if (result == "Editar Item") {
                frame_1.Frame.getFrameById('products-frame').navigate({ moduleName: "views/tab/products/product/product-page", context: args.view.bindingContext.product_id, backstackVisible: false });
                var tab_view = frame_1.Frame.getFrameById('root-frame').getViewById('tab-view');
                tab_view.selectedIndex = 2;
            }
        });
    };
    BagModel.prototype.remove = function (id) {
        var _this = this;
        this.set('visibility_processing', 'visible');
        this.set('visibility_page', 'collapsed');
        this.set('processing_message', 'Removendo Item');
        axios_1.default.delete(settings.getString("api") + '/items/' + id, { auth: { username: settings.getString("username"), password: settings.getString("password") } }).then(function (result) {
            console.log(result.data);
            settings.setString('order', JSON.stringify(result.data));
            _this.set('items', result.data.items);
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
            else if (error.response.status == 403) {
                alert(error.response.data);
            }
            else {
                console.log(error.response);
                alert(error.response.data.message);
            }
            _this.set('visibility_processing', 'collapsed');
            _this.set('visibility_page', 'visible');
        });
    };
    BagModel.prototype.camera = function (args) {
        var _this = this;
        var barcodescanner = new nativescript_barcodescanner_1.BarcodeScanner();
        barcodescanner.scan({
            formats: "QR_CODE, EAN_13,CODE_128",
            showFlipCameraButton: true,
            preferFrontCamera: false,
            showTorchButton: true,
            beepOnScan: true,
            torchOn: false,
            resultDisplayDuration: 0,
            openSettingsIfPermissionWasPreviouslyDenied: true
        }).then(function (result) {
            var that = _this;
            setTimeout(function () { that.search(result.text); }, 100);
        }, function (errorMessage) {
            alert('Erro scanning');
        });
    };
    BagModel.prototype.search = function (search) {
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
    return BagModel;
}(observable_1.Observable));
exports.BagModel = BagModel;
