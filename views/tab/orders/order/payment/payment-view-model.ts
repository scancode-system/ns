import { Observable } from "tns-core-modules/data/observable";
import { Frame } from "tns-core-modules/ui/frame";

export class PaymentModel extends Observable {

	public payments: Array<object>;

	constructor() {
		super();
	}

	public loaded(args) {
		this.set('payments', [
			'Pagamento 1', 
			'Pagamento 2', 
			'Pagamento 3' 
			]);
	}

}
