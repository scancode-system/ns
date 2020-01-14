"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var observation_view_model_1 = require("./observation-view-model");
function navigatingTo(args) {
    var page = args.object;
    page.bindingContext = new observation_view_model_1.ObservationModel();
}
exports.navigatingTo = navigatingTo;
