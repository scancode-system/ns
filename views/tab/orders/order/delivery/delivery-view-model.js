"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var observable_1 = require("tns-core-modules/data/observable");
var frame_1 = require("tns-core-modules/ui/frame");
var settings = require("tns-core-modules/application-settings");
var axios_1 = require("axios");
var DeliveryModel = /** @class */ (function (_super) {
    __extends(DeliveryModel, _super);
    function DeliveryModel() {
        var _this = _super.call(this) || this;
        _this.visible_loaded = 'visible';
        _this.visible_update_full_delivery = 'collapsed';
        return _this;
    }
    DeliveryModel.prototype.loaded = function (args) {
        console.log('loaded orders');
    };
    DeliveryModel.prototype.updateOne = function () {
        this.update(1);
    };
    DeliveryModel.prototype.updateZero = function () {
        this.update(0);
    };
    DeliveryModel.prototype.update = function (full_delivery) {
        var _this = this;
        this.set('visible_update_full_delivery', 'visible');
        this.set('visible_loaded', 'collapsed');
        axios_1.default.put(settings.getString("api") + '/orders/' + JSON.parse(settings.getString('order')).id, { full_delivery: full_delivery }, { auth: { username: settings.getString("username"), password: settings.getString("password") } }).then(function (result) {
            settings.setString('order', JSON.stringify(result.data));
            frame_1.Frame.getFrameById('orders-frame').goBack();
        }, function (error) {
            _this.set('visible_update_full_delivery', 'collapsed');
            _this.set('visible_loaded', 'visible');
            if (error.response.status == 403) {
                alert(error.response.data);
            }
            else {
                alert(error.response.data.message);
            }
        });
    };
    return DeliveryModel;
}(observable_1.Observable));
exports.DeliveryModel = DeliveryModel;
