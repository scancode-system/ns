"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var client_list_view_model_1 = require("./client-list-view-model");
function navigatingTo(args) {
    var page = args.object;
    page.bindingContext = new client_list_view_model_1.ClientListModel();
}
exports.navigatingTo = navigatingTo;
