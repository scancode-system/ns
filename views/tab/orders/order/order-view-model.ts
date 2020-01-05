import { Observable } from "tns-core-modules/data/observable";
import { Frame } from "tns-core-modules/ui/frame";

export class OrderModel extends Observable {

	constructor() {
		super();
	}

	public loaded(args) {

	}

	public gotoClient(){
		Frame.getFrameById('orders-frame').navigate("views/tab/orders/order/client/client-list/client-list-page");
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
