import { Observable } from "tns-core-modules/data/observable";
import { Frame } from "tns-core-modules/ui/frame";

export class ObservationModel extends Observable {

	constructor() {
		super();
	}

	public loaded(args) {
		console.log('loaded orders');
	}

	public gotoHistoric(){
		Frame.getFrameById('orders-frame').navigate("views/tab/orders/historic/historic-page");
	}



}
