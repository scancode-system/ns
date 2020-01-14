"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tab_view_model_1 = require("./tab-view-model");
function navigatingTo(args) {
    var page = args.object;
    page.bindingContext = new tab_view_model_1.TabModel();
}
exports.navigatingTo = navigatingTo;
