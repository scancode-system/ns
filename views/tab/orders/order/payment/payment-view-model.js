"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var observable_1 = require("tns-core-modules/data/observable");
var frame_1 = require("tns-core-modules/ui/frame");
var settings = require("tns-core-modules/application-settings");
var axios_1 = require("axios");
var PaymentModel = /** @class */ (function (_super) {
    __extends(PaymentModel, _super);
    function PaymentModel() {
        var _this = _super.call(this) || this;
        _this.visible_loading = 'visible';
        _this.visible_loaded = 'collapsed';
        _this.visible_update_payment = 'collapsed';
        _this.order = JSON.parse(settings.getString('order'));
        return _this;
    }
    PaymentModel.prototype.loaded = function (args) {
        var _this = this;
        axios_1.default.get(settings.getString("api") + '/payments/all', { auth: { username: settings.getString("username"), password: settings.getString("password") } }).then(function (result) {
            var payments = result.data;
            payments.unshift({ description: 'Selecione um Pagamento' });
            _this.set('payments', payments);
            _this.set('visible_loading', 'collapsed');
            _this.set('visible_loaded', 'visible');
            var index = payments.findIndex(function (payment) {
                return payment.id == this.order.order_payment.payment_id;
            }, _this);
            _this.set('index', index);
            console.log(index);
        }, function (error) {
            alert(error.response.data.message);
        });
    };
    PaymentModel.prototype.update = function (args) {
        var _this = this;
        this.set('visible_update_payment', 'visible');
        this.set('visible_loaded', 'collapsed');
        var payment = this.selected_payment_id;
        if (!payment) {
            payment = null;
        }
        console.log(settings.getString("api") + '/orders/' + this.order.id);
        axios_1.default.put(settings.getString("api") + '/orders/' + this.order.id, { payment_id: payment }, { auth: { username: settings.getString("username"), password: settings.getString("password") } }).then(function (result) {
            settings.setString('order', JSON.stringify(result.data));
            frame_1.Frame.getFrameById('orders-frame').goBack();
        }, function (error) {
            console.log(error.response);
            if (error.response.status == 403) {
                alert(error.response.data);
            }
            _this.set('visible_update_payment', 'collapsed');
            _this.set('visible_loaded', 'visible');
        });
    };
    return PaymentModel;
}(observable_1.Observable));
exports.PaymentModel = PaymentModel;
