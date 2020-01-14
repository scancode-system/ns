"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var order_view_model_1 = require("./order-view-model");
function navigatingTo(args) {
    var page = args.object;
    page.bindingContext = new order_view_model_1.OrderModel(page.navigationContext);
}
exports.navigatingTo = navigatingTo;
