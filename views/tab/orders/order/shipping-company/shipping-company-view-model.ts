import { Observable } from "tns-core-modules/data/observable";
import { Frame } from "tns-core-modules/ui/frame";

export class ShippingCompanyModel extends Observable {

	public shipping_companies: Array<object>;

	constructor() {
		super();
	}

	public loaded(args) {
		this.set('shipping_companies', [
			{name: 'Neponucemo'},
			{name: 'Neponucemo'},
			{name: 'Neponucemo'},
			{name: 'Neponucemo'},
			{name: 'Neponucemo'},
			{name: 'Neponucemo'},
			{name: 'Neponucemo'},
			{name: 'Neponucemo'},
			{name: 'Neponucemo'},
			{name: 'Neponucemo'},
			]);
	}

	public gotoHistoric(){
		Frame.getFrameById('orders-frame').navigate("views/tab/orders/historic/historic-page");
	}



}
