import { Observable } from "tns-core-modules/data/observable";

export class ProductModel extends Observable {

	constructor() {
		super();
	}

	public loaded(args) {
		console.log('loaded products');
	}

}
