import { Observable } from "tns-core-modules/data/observable";
import { Frame } from "tns-core-modules/ui/frame";

export class ProductsModel extends Observable {

	public products: Array<object>;

	constructor() {
		super();
	}

	public loaded(args) {
		this.set('products', [
			{sku: 'CAC023', description: 'Bkini Amarelo G', price: 332.43},
			{sku: 'CAC023', description: 'Bkini Amarelo G', price: 332.43},
			{sku: 'CAC023', description: 'Bkini Amarelo G', price: 332.43},
			{sku: 'CAC023', description: 'Bkini Amarelo G', price: 332.43},
			{sku: 'CAC023', description: 'Bkini Amarelo G', price: 332.43},
			{sku: 'CAC023', description: 'Bkini Amarelo G', price: 332.43},
			{sku: 'CAC023', description: 'Bkini Amarelo G', price: 332.43},
			{sku: 'CAC023', description: 'Bkini Amarelo G', price: 332.43},
			{sku: 'CAC023', description: 'Bkini Amarelo G', price: 332.43},
			{sku: 'CAC023', description: 'Bkini Amarelo G', price: 332.43},
			{sku: 'CAC023', description: 'Bkini Amarelo G', price: 332.43}
			]);
	}

	public gotoProduct(args){
		Frame.getFrameById('products-frame').navigate("views/tab/products/product/product-page");
	}

}
