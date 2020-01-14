"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var orders_view_model_1 = require("./orders-view-model");
function navigatingTo(args) {
    var page = args.object;
    page.bindingContext = new orders_view_model_1.OrdersModel();
}
exports.navigatingTo = navigatingTo;
