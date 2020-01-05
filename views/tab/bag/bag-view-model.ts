import { Observable } from "tns-core-modules/data/observable";

export class BagModel extends Observable {

	public items: Array<object>;

	constructor() {
		super();
		this.items = [];
	}

	public loaded(args) {
		this.set('items', [
			{item_product: {sku: 'CAC1023', description: 'BIKINI SUPER TOP'}, qty: 4, price: 23232, total: 3423423},
			{item_product: {sku: 'CAC1023', description: 'BIKINI SUPER TOP'}, qty: 4, price: 23232, total: 3423423},
			{item_product: {sku: 'CAC1023', description: 'BIKINI SUPER TOP'}, qty: 4, price: 23232, total: 3423423}
			]);
	}

	public onItemTapItem(args){
		console.log("pode deletar ou editar!!!");
	}

}
