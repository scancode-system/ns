import { Observable } from "tns-core-modules/data/observable";
import { Frame } from "tns-core-modules/ui/frame";
import axios from "axios";
import * as settings from "tns-core-modules/application-settings";


export class LoginModel extends Observable {

	private email: string;
	private password: string;

	public visibility_processing;
	public visibility_page;
	public processing_message;

	constructor() {
		super();
		this.email =  settings.getString('username');
		this.password =  settings.getString('password');

		this.visibility_processing = 'collapsed';
		this.visibility_page = 'visible';
	}

	public login() {
		this.set('visibility_processing', 'visible');
		this.set('visibility_page', 'collapsed');
		this.set('processing_message', 'Autenticando');
		axios.get(settings.getString("api")+'/sallers/auth', {auth:{username:this.email, password: this.password}}).then(
			(result) => {
				settings.setString('username', this.email);
				settings.setString('password', this.password);
				settings.setNumber('saller', result.data.id);
				this.updateProducts();
			},
			(error) => {
				if(error.response.status == 401){
					alert('Login inválido');
					this.set('visibility_processing', 'collapsed');
					this.set('visibility_page', 'visible');
				} else {
					alert('Chame o administrador do sistema');
				}
			});
	}

	public updateProducts(){
		this.set('processing_message', 'Atualizando Produtos');
		axios.get(settings.getString("api")+'/products', {auth:{username:settings.getString("username"), password: settings.getString("password")}}).then(
			(result) => {
				settings.setString('products', JSON.stringify(result.data));
				this.updateShippingCompanies();
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

	public updateShippingCompanies(){
		this.set('processing_message', 'Atualizando Transportadoras');
		axios.get(settings.getString("api")+'/shipping_companies/load', {auth:{username:settings.getString("username"), password: settings.getString("password")}}).then(
			(result) => {
				settings.setString('shipping_companies', JSON.stringify(result.data));
				this.updateClients();
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

	public updateClients(){
		this.set('processing_message', 'Atualizando Clientes');
		axios.get(settings.getString("api")+'/clients/load', {auth:{username:settings.getString("username"), password: settings.getString("password")}}).then(
			(result) => {
				settings.setString('clients', JSON.stringify(result.data));
				Frame.getFrameById("root-frame").navigate({moduleName: "views/tab/tab-page", clearHistory: true});
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
