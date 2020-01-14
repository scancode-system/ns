"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var observable_1 = require("tns-core-modules/data/observable");
var frame_1 = require("tns-core-modules/ui/frame");
var settings = require("tns-core-modules/application-settings");
var axios_1 = require("axios");
var ObservationModel = /** @class */ (function (_super) {
    __extends(ObservationModel, _super);
    function ObservationModel() {
        var _this = _super.call(this) || this;
        _this.visible_loaded = 'visible';
        _this.visible_update_observation = 'collapsed';
        _this.observation = JSON.parse(settings.getString('order')).observation;
        return _this;
    }
    ObservationModel.prototype.loaded = function (args) {
    };
    ObservationModel.prototype.update = function () {
        var _this = this;
        this.set('visible_update_observation', 'visible');
        this.set('visible_loaded', 'collapsed');
        axios_1.default.put(settings.getString("api") + '/orders/' + JSON.parse(settings.getString('order')).id, { observation: this.observation }, { auth: { username: settings.getString("username"), password: settings.getString("password") } }).then(function (result) {
            settings.setString('order', JSON.stringify(result.data));
            frame_1.Frame.getFrameById('orders-frame').goBack();
        }, function (error) {
            _this.set('visible_update_observation', 'collapsed');
            _this.set('visible_loaded', 'visible');
            if (error.response.status == 403) {
                alert(error.response.data);
            }
            else {
                alert(error.response.data.message);
            }
        });
        //Frame.getFrameById('orders-frame').navigate("views/tab/orders/historic/historic-page");
    };
    return ObservationModel;
}(observable_1.Observable));
exports.ObservationModel = ObservationModel;
