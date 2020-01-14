"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var observable_1 = require("tns-core-modules/data/observable");
var frame_1 = require("tns-core-modules/ui/frame");
var settings = require("tns-core-modules/application-settings");
var ClientListModel = /** @class */ (function (_super) {
    __extends(ClientListModel, _super);
    function ClientListModel() {
        var _this = _super.call(this) || this;
        _this.visibility_processing = 'collapsed';
        _this.visibility_page = 'visible';
        _this.on(observable_1.Observable.propertyChangeEvent, function (propertyChangeData) {
            if (propertyChangeData.propertyName === "search") {
                _this.filter();
            }
        }, _this);
        return _this;
    }
    ClientListModel.prototype.filter = function () {
        var _this = this;
        var clients_all = JSON.parse(settings.getString('clients', '[]'));
        var clients = clients_all.filter(function (client, index) {
            if (_this.search != "") {
                if (client.id.toString().indexOf(_this.search) != -1) {
                    return true;
                }
                if (client.fantasy_name != null) {
                    if (client.fantasy_name.toLowerCase().indexOf(_this.search.toLowerCase()) != -1) {
                        return true;
                    }
                }
                if (client.corporate_name != null) {
                    if (client.corporate_name.toLowerCase().indexOf(_this.search.toLowerCase()) != -1) {
                        return true;
                    }
                }
                if (client.cpf_cnpj != null) {
                    if (client.cpf_cnpj.indexOf(_this.search) != -1) {
                        return true;
                    }
                }
            }
            return false;
        });
        clients = clients.slice(-10);
        this.set('clients', clients);
    };
    ClientListModel.prototype.gotoClientShow = function (args) {
        var client = args.view.bindingContext;
        frame_1.Frame.getFrameById('orders-frame').navigate({ moduleName: "views/tab/orders/order/client/client-show/client-show-page", context: { id: client.id, buyer: client.buyer, phone: client.phone, email: client.email }, backstackVisible: false });
    };
    ClientListModel.prototype.gotoClientCreate = function () {
        frame_1.Frame.getFrameById('orders-frame').navigate({ moduleName: "views/tab/orders/order/client/client-create/client-create-page" });
    };
    return ClientListModel;
}(observable_1.Observable));
exports.ClientListModel = ClientListModel;
