import { Observable } from "tns-core-modules/data/observable";
import { Frame } from "tns-core-modules/ui/frame";
import * as settings from "tns-core-modules/application-settings";
import axios from "axios";

export class HistoricModel extends Observable {

	public orders: Array<object>;
	public saller;

	public visibility_processing;
	public visibility_page;
	public processing_message;

	public total;
	public orders_count;

	constructor() {
		super();
		this.visibility_processing = 'visible';
		this.visibility_page = 'collapsed';
		this.processing_message = 'Carregando pedidos';
		this.saller = JSON.parse(settings.getString('saller'));

		axios.get(settings.getString("api")+'/orders/loadBySaller/'+this.saller.id, {auth:{username:settings.getString("username"), password: settings.getString("password")}}).then(
			(result) => {
				var orders = result.data;
				orders.reverse(); 
				this.set('orders', orders);

				let total = 0;
				let orders_count = 0;
				for (let order of orders) {
					if(order.status_id == 2){
						orders_count++;
						total+= order.total;
					}
				}

				this.set('total', total);
				this.set('orders_count', orders_count);
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
					this.set('visibility_processing', 'collapsed');
					this.set('visibility_page', 'visible');
				}
			});
	}

	public selectOrder(args){
		this.set('visibility_processing', 'visible');
		this.set('visibility_page', 'collapsed');
		this.set('processing_message', 'Carregando pedido');
		axios.get(settings.getString("api")+'/orders/'+args.view.bindingContext.id, {auth:{username:settings.getString("username"), password: settings.getString("password")}}).then(
			(result) => {
				settings.setString('order', JSON.stringify(result.data));
				Frame.getFrameById('orders-frame').navigate({moduleName: "views/tab/orders/order/order-page", context: result.data.id});
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
					this.set('visibility_processing', 'collapsed');
					this.set('visibility_page', 'visible');
				}
			});
	} 


}
