"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var delivery_view_model_1 = require("./delivery-view-model");
function navigatingTo(args) {
    var page = args.object;
    page.bindingContext = new delivery_view_model_1.DeliveryModel();
}
exports.navigatingTo = navigatingTo;
