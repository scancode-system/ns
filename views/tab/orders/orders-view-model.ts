import { Observable } from "tns-core-modules/data/observable";
import { Frame } from "tns-core-modules/ui/frame";
import * as settings from "tns-core-modules/application-settings";

export class OrdersModel extends Observable {

	constructor() {
		super();
	}

	public gotoHistoric(){
		Frame.getFrameById('orders-frame').navigate("views/tab/orders/historic/historic-page");
	}

	public gotoOrder(){
		Frame.getFrameById('orders-frame').navigate("views/tab/orders/order/order-page");
	}

	public logout(){
		settings.remove('saller')
		Frame.getFrameById('root-frame').navigate({moduleName: "views/login/login-page", clearHistory: true});
	}

}
