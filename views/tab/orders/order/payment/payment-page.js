"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var payment_view_model_1 = require("./payment-view-model");
function navigatingTo(args) {
    var page = args.object;
    page.bindingContext = new payment_view_model_1.PaymentModel();
}
exports.navigatingTo = navigatingTo;
