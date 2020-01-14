"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var observable_1 = require("tns-core-modules/data/observable");
var frame_1 = require("tns-core-modules/ui/frame");
var settings = require("tns-core-modules/application-settings");
var axios_1 = require("axios");
var ClientCreateModel = /** @class */ (function (_super) {
    __extends(ClientCreateModel, _super);
    function ClientCreateModel() {
        var _this = _super.call(this) || this;
        _this.visibility_processing = 'collapsed';
        _this.visibility_page = 'visible';
        return _this;
    }
    ClientCreateModel.prototype.store = function (args) {
        var _this = this;
        var client = {
            cpf_cnpj: this.cpf_cnpj,
            corporate_name: this.corporate_name,
            fantasy_name: this.fantasy_name,
            buyer: this.buyer,
            phone: this.phone,
            email: this.email,
            postcode: this.postcode,
            street: this.street,
            number: this.number,
            apartment: this.apartment,
            neighborhood: this.neighborhood,
            city: this.city,
            st: this.st
        };
        this.set('visibility_processing', 'visible');
        this.set('visibility_page', 'collapsed');
        this.set('processing_message', 'Cadastrando Cliente');
        axios_1.default.post(settings.getString("api") + '/clients', client, { auth: { username: settings.getString("username"), password: settings.getString("password") } }).then(function (result) {
            _this.update(result.data.id);
        }, function (error) {
            if (error.response.status == 401) {
                settings.remove('saller');
                settings.remove('products');
                settings.remove('clients');
                settings.remove('shipping_companies');
                frame_1.Frame.getFrameById("root-frame").navigate({ moduleName: "views/login/login-page", clearHistory: true });
            }
            else if (error.response.status == 422) {
                _this.set('visibility_processing', 'collapsed');
                _this.set('visibility_page', 'visible');
                /*var errors = Object.keys(error.response.data.errors);
                alert(error.response.data.errors[errors[0]]);*/
                var errors = Object.keys(error.response.data.errors);
                alert(error.response.data.errors[errors[0]][0]);
            }
            else {
                alert('Chame o administrador do sistema');
            }
        });
    };
    ClientCreateModel.prototype.update = function (id) {
        var _this = this;
        this.set('processing_message', 'Registrando Cliente no Pedido');
        axios_1.default.put(settings.getString("api") + '/orders/' + JSON.parse(settings.getString('order')).id, { client_id: id }, { auth: { username: settings.getString("username"), password: settings.getString("password") } }).then(function (result) {
            settings.setString('order', JSON.stringify(result.data));
            frame_1.Frame.getFrameById('orders-frame').goBack();
        }, function (error) {
            if (error.response.status == 401) {
                settings.remove('saller');
                settings.remove('products');
                settings.remove('clients');
                settings.remove('shipping_companies');
                frame_1.Frame.getFrameById("root-frame").navigate({ moduleName: "views/login/login-page", clearHistory: true });
            }
            else if (error.response.status == 403) {
                alert(error.response.data);
            }
            else {
                alert('Chame o administrador do sistema');
            }
            _this.set('visibility_processing', 'collapsed');
            _this.set('visibility_page', 'visible');
        });
    };
    ClientCreateModel.prototype.postcodeBlur = function (args) {
        var _this = this;
        axios_1.default.get(settings.getString("api") + '/client_utils/cep/' + this.postcode, { auth: { username: settings.getString("username"), password: settings.getString("password") } }).then(function (result) {
            if (result.data.endereco) {
                _this.set('street', result.data.endereco.logradouro);
                _this.set('apartment', result.data.endereco.complemento);
                _this.set('neighborhood', result.data.endereco.bairro);
                _this.set('city', result.data.endereco.localidade);
                _this.set('st', result.data.endereco.uf);
            }
        }, function (error) {
            if (error.response.status == 401) {
                settings.remove('saller');
                settings.remove('products');
                settings.remove('clients');
                settings.remove('shipping_companies');
                frame_1.Frame.getFrameById("root-frame").navigate({ moduleName: "views/login/login-page", clearHistory: true });
            }
            else {
                alert('Chame o administrador do sistema');
            }
        });
    };
    ClientCreateModel.prototype.cpfCnpjBlur = function (args) {
        var _this = this;
        axios_1.default.get(settings.getString("api") + '/client_utils/cnpj/' + this.cpf_cnpj, { auth: { username: settings.getString("username"), password: settings.getString("password") } }).then(function (result) {
            if (result.data.dados) {
                if (result.data.dados.status != 'ERROR') {
                    var empresa = result.data.dados;
                    _this.set('fantasy_name', empresa.fantasia);
                    _this.set('corporate_name', empresa.nome);
                    _this.set('email', empresa.email);
                    _this.set('phone', empresa.telefone);
                    _this.set('street', empresa.logradouro + ', ' + empresa.numero);
                    _this.set('neighborhood', empresa.bairro);
                    _this.set('city', empresa.municipio);
                    _this.set('st', empresa.uf);
                    _this.set('postcode', empresa.cep);
                }
            }
        }, function (error) {
            if (error.response.status == 401) {
                settings.remove('saller');
                settings.remove('products');
                settings.remove('clients');
                settings.remove('shipping_companies');
                frame_1.Frame.getFrameById("root-frame").navigate({ moduleName: "views/login/login-page", clearHistory: true });
            }
            else {
                alert('Chame o administrador do sistema');
            }
        });
    };
    return ClientCreateModel;
}(observable_1.Observable));
exports.ClientCreateModel = ClientCreateModel;
