import { Observable } from "tns-core-modules/data/observable";
import { Frame } from "tns-core-modules/ui/frame";
import * as settings from "tns-core-modules/application-settings";
import axios from "axios";


export class OrdersModel extends Observable {

	public loading;
	public content;

	constructor() {
		super();
		this.loading = 'collapsed';
		this.content = 'visible';
	}

	public gotoHistoric(){
		Frame.getFrameById('orders-frame').navigate("views/tab/orders/historic/historic-page");
	}

	public gotoOrder(){
		this.set('loading', 'visible');
		this.set('content', 'collapsed');

		axios.post(settings.getString("api")+'/orders', {saller_id: settings.getNumber('saller')},  {auth:{username:settings.getString("username"), password: settings.getString("password")}}).then(
			(result) => {
				Frame.getFrameById('orders-frame').navigate({moduleName: "views/tab/orders/order/order-page", context: result.data.id});
			},
			(error) => {
				alert(error.response.data.message);
			});
	}

	public logout(){
		settings.remove('saller');
		settings.remove('products');
		settings.remove('clients');
		settings.remove('shipping_companies');
		Frame.getFrameById('root-frame').navigate({moduleName: "views/login/login-page", clearHistory: true});
	}

}
