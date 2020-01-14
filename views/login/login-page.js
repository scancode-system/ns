"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var login_view_model_1 = require("./login-view-model");
function navigatingTo(args) {
    var page = args.object;
    page.bindingContext = new login_view_model_1.LoginModel();
}
exports.navigatingTo = navigatingTo;
