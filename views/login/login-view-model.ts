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
		this.password =  '';

		this.set('visibility_processing', 'visible');
		this.set('visibility_page', 'collapsed');
		this.set('processing_message', 'Verificando Credenciais');

		/*settings.remove('order');
		settings.remove('saller');
		settings.remove('products');
		settings.remove('clients');
		settings.remove('shipping_companies');*/		
	}

	public loaded(){
		if(settings.getString('saller' , null)){
			Frame.getFrameById("root-frame").navigate({moduleName: "views/tab/tab-page", clearHistory: true});
		} else {
			this.set('visibility_processing', 'visible');
			this.set('visibility_page', 'collapsed');
			this.set('processing_message', 'Checando conexão');
			axios.get(settings.getString("api")+'/dashboard/check').then(
				(result) => {
					if(result.status == 200){
						this.set('visibility_processing', 'collapsed');
						this.set('visibility_page', 'visible');
					} else {
						Frame.getFrameById("root-frame").navigate({moduleName: "views/url/url-page", clearHistory: true});
					}
				},
				(error) => {
					Frame.getFrameById("root-frame").navigate({moduleName: "views/url/url-page", clearHistory: true});
				});
		}
	}

	public login() {
		this.set('visibility_processing', 'visible');
		this.set('visibility_page', 'collapsed');
		this.set('processing_message', 'Autenticando');
		axios.get(settings.getString("api")+'/sallers/auth', {auth:{username:this.email, password: this.password}}).then(
			(result) => {
				settings.setString('username', this.email);
				settings.setString('password', this.password);
				settings.setString('saller', JSON.stringify(result.data));
				this.updateProducts();
			},
			(error) => {
				console.log('1');
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
		this.set('processing_message', 'Sincronizando Produtos');
		console.log(settings.getString("api")+'/products');
		axios.get(settings.getString("api")+'/products', {auth:{username:settings.getString("username"), password: settings.getString("password")}}).then(
			(result) => {
				settings.setString('products', JSON.stringify(result.data));
				this.updateShippingCompanies();
			},
			(error) => {
				console.log(error);
				if(error.response.status == 401)
				{
					Frame.getFrameById("root-frame").navigate({moduleName: "views/login/login-page", clearHistory: true});
				} else {
					alert('Chame o administrador do sistema');
				}
			});
	}

	public updateShippingCompanies(){
		this.set('processing_message', 'Sincronizando Transportadoras');
		axios.get(settings.getString("api")+'/shipping_companies/load', {auth:{username:settings.getString("username"), password: settings.getString("password")}}).then(
			(result) => {
				settings.setString('shipping_companies', JSON.stringify(result.data));
				this.updateClients();
			},
			(error) => {
				if(error.response.status == 401)
				{
					Frame.getFrameById("root-frame").navigate({moduleName: "views/login/login-page", clearHistory: true});
				} else {
					alert('Chame o administrador do sistema');
				}
			});
	}

	public updateClients(){
		this.set('processing_message', 'Sincronizando Clientes');
		axios.get(settings.getString("api")+'/clients/load', {auth:{username:settings.getString("username"), password: settings.getString("password")}}).then(
			(result) => {
				settings.setString('clients', JSON.stringify(result.data));
				Frame.getFrameById("root-frame").navigate({moduleName: "views/tab/tab-page", clearHistory: true});
			},
			(error) => {
				if(error.response.status == 401)
				{
					Frame.getFrameById("root-frame").navigate({moduleName: "views/login/login-page", clearHistory: true});
				} else {
					alert('Chame o administrador do sistema');
				}
			});
	}

}
