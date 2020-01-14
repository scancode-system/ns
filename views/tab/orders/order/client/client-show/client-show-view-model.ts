import { Observable } from "tns-core-modules/data/observable";
import { Frame } from "tns-core-modules/ui/frame";
import * as settings from "tns-core-modules/application-settings";
import axios from "axios";

export class ClientShowModel extends Observable {

	public id;
	public order;
	public client;

	public buyer;
	public phone;
	public email;

	public visibility_processing;
	public visibility_page;
	public processing_message;

	constructor(id, buyer = null, phone = null, email = null) {
		super();
		this.id = id;
		this.order = JSON.parse(settings.getString('order'));

		this.visibility_processing = 'visible';
		this.visibility_page = 'collapsed';
		this.processing_message = 'Carregando Cliente';

		this.buyer = buyer;
		this.email = email;
		this.phone = phone;
	}

	public loaded(args) {
		axios.get(settings.getString("api")+'/clients/load/'+this.id, {auth:{username:settings.getString("username"), password: settings.getString("password")}}).then(
			(result) => {
				this.set('client', result.data);
				this.setBuyer();
				this.set('visibility_processing', 'collapsed');
				this.set('visibility_page', 'visible');
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

	private setBuyer(){
		var buyer = (this.order.order_client.buyer ) ? this.order.order_client.buyer: this.client.buyer;
		var phone = (this.order.order_client.phone ) ? this.order.order_client.phone: this.client.phone;
		var email = (this.order.order_client.email ) ? this.order.order_client.email: this.client.email;

		if(!this.buyer){
			this.set('buyer', buyer);
		}
		if(!this.email){
			this.set('email', email);
		}
		if(!this.phone){
			this.set('phone', phone);
		}
	}

	public update(args){
		this.set('visibility_processing', 'visible');
		this.set('visibility_page', 'collapsed');
		this.set('processing_message', 'Atualizando Cliente');
		axios.put(settings.getString("api")+'/orders/'+JSON.parse(settings.getString('order')).id, {client_id: this.id}, {auth:{username:settings.getString("username"), password: settings.getString("password")}}).then(
			(result) => {
				this.updateBuyer();
			},
			(error) => {
				if(error.response.status == 401)
				{
					settings.remove('saller');
					settings.remove('products');
					settings.remove('clients');
					settings.remove('shipping_companies');
					Frame.getFrameById("root-frame").navigate({moduleName: "views/login/login-page", clearHistory: true});
				}else if(error.response.status == 403){
					alert(error.response.data);					
				}else {
					console.log(error);
					console.log(error.response);
					alert('Chame o administrador do sistema');
				}
				this.set('visibility_processing', 'collapsed');
				this.set('visibility_page', 'visible');
			});
	}

	public updateBuyer(){
		this.set('processing_message', 'Atualizando Comprador');
		axios.put(settings.getString("api")+'/orders/'+JSON.parse(settings.getString('order')).id+'/updateBuyer', {buyer: this.buyer, email: this.email, phone: this.phone}, {auth:{username:settings.getString("username"), password: settings.getString("password")}}).then(
			(result) => {
				settings.setString('order', JSON.stringify(result.data));
				Frame.getFrameById('orders-frame').goBack();
			},
			(error) => {
				console.log(error);
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

	public gotoList(args){
		Frame.getFrameById('orders-frame').navigate({moduleName: "views/tab/orders/order/client/client-list/client-list-page",  backstackVisible: false});
	}


}
