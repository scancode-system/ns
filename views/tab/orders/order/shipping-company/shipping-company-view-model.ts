import { Observable, PropertyChangeData } from "tns-core-modules/data/observable";
import { Frame } from "tns-core-modules/ui/frame";
import * as settings from "tns-core-modules/application-settings";
import axios from "axios";

export class ShippingCompanyModel extends Observable {

	public shipping_companies: Array<object>;
	public search;
	public name;

	public visibility_processing;
	public visibility_page;
	public processing_message;

	constructor() {
		super();
		this.visibility_processing = 'collapsed';
		this.visibility_page = 'visible';

		this.on(Observable.propertyChangeEvent, (propertyChangeData: PropertyChangeData) => {
			if (propertyChangeData.propertyName === "search") {
				this.updateShippingCompany();
			}
		}, this);
	}

	public updateShippingCompany(){
		var shipping_companies_all = JSON.parse(settings.getString('shipping_companies', '[]'));
		var shipping_companies = shipping_companies_all.filter((shipping_company, index) => {
			if (this.search != "") {
				if (shipping_company.id.toString().indexOf(this.search) != -1) {
					return true;
				}
				if (shipping_company.name.toLowerCase().indexOf(this.search.toLowerCase()) != -1) {
					return true;
				}   
			}
			return false;
		});

		shipping_companies = shipping_companies.slice(-5);
		this.set('shipping_companies', shipping_companies);
	}

	public itemTapUpdate(args){
		this.update(args.view.bindingContext.id);
	}

	public update(id){
		this.set('visibility_processing', 'visible');
		this.set('visibility_page', 'collapsed');
		this.set('processing_message', 'Atualizando Transportadora');
		axios.put(settings.getString("api")+'/orders/'+JSON.parse(settings.getString('order')).id, {shipping_company_id: id}, {auth:{username:settings.getString("username"), password: settings.getString("password")}}).then(
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

	public store(args){
		this.set('visibility_processing', 'visible');
		this.set('visibility_page', 'collapsed');
		this.set('processing_message', 'Cadastrando nova Transportadora');
		axios.post(settings.getString("api")+'/shipping_companies', {name: this.name}, {auth:{username:settings.getString("username"), password: settings.getString("password")}}).then(
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
				} else {
					alert('Chame o administrador do sistema');
				}
			});
	}

}
