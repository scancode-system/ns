"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var client_show_view_model_1 = require("./client-show-view-model");
function navigatingTo(args) {
    var page = args.object;
    console.log(page.navigationContext);
    page.bindingContext = new client_show_view_model_1.ClientShowModel(page.navigationContext.id, page.navigationContext.buyer, page.navigationContext.phone, page.navigationContext.email);
}
exports.navigatingTo = navigatingTo;
