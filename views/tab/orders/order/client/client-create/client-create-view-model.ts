import { Observable } from "tns-core-modules/data/observable";
import { Frame } from "tns-core-modules/ui/frame";
import * as settings from "tns-core-modules/application-settings";
import axios from "axios";

export class ClientCreateModel extends Observable {

	public clients: Array<object>;

	public cpf_cnpj;
	public corporate_name;
	public fantasy_name;
	public buyer;
	public email;
	public phone;

	public postcode;
	public street;
	public number;
	public apartment;
	public neighborhood;
	public city;
	public st;

	public visibility_processing;
	public visibility_page;
	public processing_message;

	constructor() {
		super();

		this.visibility_processing = 'collapsed';
		this.visibility_page = 'visible';
	}

	public store(args){
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
		axios.post(settings.getString("api")+'/clients', client, {auth:{username:settings.getString("username"), password: settings.getString("password")}}).then(
			(result) => {
				this.update(result.data.id);
			},
			(error) => {
				if(error.response.status == 401)
				{
					settings.remove('saller');
					settings.remove('products');
					settings.remove('clients');
					settings.remove('shipping_companies');
					Frame.getFrameById("root-frame").navigate({moduleName: "views/login/login-page", clearHistory: true});
				} else if(error.response.status == 422)  {
					this.set('visibility_processing', 'collapsed');
					this.set('visibility_page', 'visible');
					var errors = Object.keys(error.response.data.errors);
					alert(error.response.data.errors[errors[0]]);
				}else {
					alert('Chame o administrador do sistema');
				}
			});
	}

	public update(id){
		this.set('processing_message', 'Registrando Cliente no Pedido');
		axios.put(settings.getString("api")+'/orders/'+JSON.parse(settings.getString('order')).id, {client_id: id}, {auth:{username:settings.getString("username"), password: settings.getString("password")}}).then(
			(result) => {
				Frame.getFrameById('orders-frame').goBack();
			},
			(error) => {
				if(error.response.status == 401)
				{
					settings.remove('saller');
					settings.remove('products');
					settings.remove('clients');
					settings.remove('shipping_companies');
					Frame.getFrameById("root-frame").navigate({moduleName: "views/login/login-page", clearHistory: true});
				} else {
					alert('Chame o administrador do sistema');
				}
			});
	}

	public postcodeBlur(args){
		axios.get(settings.getString("api")+'/client_utils/cep/'+this.postcode, {auth:{username:settings.getString("username"), password: settings.getString("password")}}).then(
			(result) => {
				if(result.data.endereco){
					this.set('street', result.data.endereco.logradouro);
					this.set('apartment', result.data.endereco.complemento);
					this.set('neighborhood', result.data.endereco.bairro);
					this.set('city', result.data.endereco.localidade);
					this.set('st', result.data.endereco.uf);
				}
			},
			(error) => {
				if(error.response.status == 401)
				{
					settings.remove('saller');
					settings.remove('products');
					settings.remove('clients');
					settings.remove('shipping_companies');
					Frame.getFrameById("root-frame").navigate({moduleName: "views/login/login-page", clearHistory: true});
				} else {
					alert('Chame o administrador do sistema');
				}
			});
	}


	public cpfCnpjBlur(args){
		axios.get(settings.getString("api")+'/client_utils/cnpj/'+this.cpf_cnpj, {auth:{username:settings.getString("username"), password: settings.getString("password")}}).then(
			(result) => {
				if(result.data.dados) {
					if(result.data.dados.status != 'ERROR'){
						var empresa = result.data.dados;

						this.set('fantasy_name', empresa.fantasia);
						this.set('corporate_name', empresa.nome);
						this.set('email', empresa.email);
						this.set('phone', empresa.telefone);
						this.set('street', empresa.logradouro+', '+empresa.numero);
						this.set('neighborhood', empresa.bairro);
						this.set('city', empresa.municipio);
						this.set('st', empresa.uf);
						this.set('postcode', empresa.cep);
					}
				}
			},
			(error) => {
				if(error.response.status == 401)
				{
					settings.remove('saller');
					settings.remove('products');
					settings.remove('clients');
					settings.remove('shipping_companies');
					Frame.getFrameById("root-frame").navigate({moduleName: "views/login/login-page", clearHistory: true});
				} else {
					alert('Chame o administrador do sistema');
				}
			});
	}

}
