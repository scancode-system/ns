"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var observable_1 = require("tns-core-modules/data/observable");
var frame_1 = require("tns-core-modules/ui/frame");
var axios_1 = require("axios");
var settings = require("tns-core-modules/application-settings");
var UrlModel = /** @class */ (function (_super) {
    __extends(UrlModel, _super);
    function UrlModel() {
        var _this = _super.call(this) || this;
        _this.visibility_processing = 'collapsed';
        _this.visibility_page = 'visible';
        return _this;
    }
    UrlModel.prototype.check = function () {
        var _this = this;
        this.set('visibility_processing', 'visible');
        this.set('visibility_page', 'collapsed');
        this.set('processing_message', 'Checando conexão');
        axios_1.default.get(this.url + '/api/dashboard/check').then(function (result) {
            if (result.status == 200) {
                settings.setString('url', _this.url);
                settings.setString('api', settings.getString('url') + '/api');
                frame_1.Frame.getFrameById("root-frame").navigate({ moduleName: "views/login/login-page", clearHistory: true });
            }
            else {
                alert('Servidor não encontrado');
                _this.set('visibility_processing', 'collapsed');
                _this.set('visibility_page', 'visible');
            }
        }, function (error) {
            alert('Servidor não encontrado');
            _this.set('visibility_processing', 'collapsed');
            _this.set('visibility_page', 'visible');
        });
    };
    return UrlModel;
}(observable_1.Observable));
exports.UrlModel = UrlModel;
