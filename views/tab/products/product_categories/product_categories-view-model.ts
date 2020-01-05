import { Observable } from "tns-core-modules/data/observable";
import { Frame } from "tns-core-modules/ui/frame";

export class ProductCategoriesModel extends Observable {

	public categories: Array<object>;

	constructor() {
		super();
	}

	public loaded(args) {
		this.set('categories', [
			{name: 'Categoria 1'},
			{name: 'Categoria 2'},
			{name: 'Categoria 3'},
			{name: 'Categoria 4'},
			{name: 'Categoria 5'},
			{name: 'Categoria 6'},
			{name: 'Categoria 7'},
			{name: 'Categoria 8'},
			{name: 'Categoria 9'},
			]);
	}

	public gotoProducts(args){
		Frame.getFrameById('products-frame').navigate("views/tab/products/products/products-page");
	}

}