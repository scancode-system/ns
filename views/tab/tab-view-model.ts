import { Observable } from "tns-core-modules/data/observable";
import axios from "axios";
import * as settings from "tns-core-modules/application-settings";
import { Frame } from "tns-core-modules/ui/frame";


export class TabModel extends Observable {

	public visibility_processing_tab;
	public visibility_tab;
	public processing_message_tab;

	constructor() {
		super();

		this.visibility_processing_tab = 'collapsed';
		this.visibility_tab = 'visible';

		//console.log('constructor: tab');
	}

	public loaded(){
		//console.log('loaded: tab');
	}

	public refresh(){
		this.updateProducts();
	}

	public updateProducts(){
		this.set('visibility_processing_tab', 'visible');
		this.set('visibility_tab', 'collapsed');
		this.set('processing_message_tab', 'Atualizando Produtos');
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
		this.set('processing_message_tab', 'Atualizando Transportadoras');
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
		this.set('processing_message_tab', 'Atualizando Clientes');
		axios.get(settings.getString("api")+'/clients/load', {auth:{username:settings.getString("username"), password: settings.getString("password")}}).then(
			(result) => {
				settings.setString('clients', JSON.stringify(result.data));

				this.set('visibility_processing_tab', 'collapsed');
				this.set('visibility_tab', 'visible');
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
