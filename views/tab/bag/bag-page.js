"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bag_view_model_1 = require("./bag-view-model");
function navigatingTo(args) {
    var page = args.object;
    page.bindingContext = new bag_view_model_1.BagModel();
}
exports.navigatingTo = navigatingTo;
