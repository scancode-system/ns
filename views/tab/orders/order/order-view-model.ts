import { Observable } from "tns-core-modules/data/observable";
import { Frame } from "tns-core-modules/ui/frame";
import axios from "axios";
import * as settings from "tns-core-modules/application-settings";

export class OrderModel extends Observable {

	public order;

	public visible_loading;
	public visible_loaded;

	constructor(id) {
		super();
		this.visible_loading = 'visible';
		this.visible_loaded = 'collapsed';

		settings.setString('order', JSON.stringify({id:id}));
	}

	public loaded(args) {
		var order = JSON.parse(settings.getString('order'));
		axios.get(settings.getString("api")+'/orders/'+order.id, {auth:{username:settings.getString("username"), password: settings.getString("password")}}).then(
			(result) => {
				settings.setString('order', JSON.stringify(result.data));
				this.set('order', result.data);
				this.set('visible_loading', 'collapsed');
				this.set('visible_loaded', 'visible');
			},
			(error) => {
				alert(error.response.data.message);
			});
	}

	public gotoClient(){
		var order_client = this.order.order_client;
		if(order_client.client_id){
			Frame.getFrameById('orders-frame').navigate({moduleName: "views/tab/orders/order/client/client-show/client-show-page", context: {id: order_client.client_id, buyer: order_client.buyer, phone: order_client.phone, email: order_client.email},  backstackVisible: false});
		} else {
			Frame.getFrameById('orders-frame').navigate({moduleName: "views/tab/orders/order/client/client-list/client-list-page",  backstackVisible: false});
		}

	}

	public gotoPayment(){
		Frame.getFrameById('orders-frame').navigate("views/tab/orders/order/payment/payment-page");
	}

	public gotoObservation(){
		Frame.getFrameById('orders-frame').navigate("views/tab/orders/order/observation/observation-page");
	}

	public gotoDelivery(){
		Frame.getFrameById('orders-frame').navigate("views/tab/orders/order/delivery/delivery-page");
	}

	public gotoShippingCompany(){
		Frame.getFrameById('orders-frame').navigate("views/tab/orders/order/shipping-company/shipping-company-page");
	}



}
