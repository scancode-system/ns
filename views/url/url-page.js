"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var url_view_model_1 = require("./url-view-model");
function navigatingTo(args) {
    var page = args.object;
    page.bindingContext = new url_view_model_1.UrlModel();
}
exports.navigatingTo = navigatingTo;
