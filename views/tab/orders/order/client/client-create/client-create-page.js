"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var client_create_view_model_1 = require("./client-create-view-model");
function navigatingTo(args) {
    var page = args.object;
    page.bindingContext = new client_create_view_model_1.ClientCreateModel();
}
exports.navigatingTo = navigatingTo;
