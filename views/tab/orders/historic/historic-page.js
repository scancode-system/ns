"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var historic_view_model_1 = require("./historic-view-model");
function navigatingTo(args) {
    var page = args.object;
    page.bindingContext = new historic_view_model_1.HistoricModel();
}
exports.navigatingTo = navigatingTo;
