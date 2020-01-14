"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shipping_company_view_model_1 = require("./shipping-company-view-model");
function navigatingTo(args) {
    var page = args.object;
    page.bindingContext = new shipping_company_view_model_1.ShippingCompanyModel();
}
exports.navigatingTo = navigatingTo;
