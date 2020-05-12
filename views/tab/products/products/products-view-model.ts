import { Observable } from "tns-core-modules/data/observable";
import { Frame } from "tns-core-modules/ui/frame";
import * as settings from "tns-core-modules/application-settings";

export class ProductsModel extends Observable {

	public products: Array<object>;
	public id: number;
	public description: string;

	constructor(category) {
		super();
		this.id = category.id;
		this.description = category.description; 
	}

	public loaded(args) {
		var id = this.id;
		var products = JSON.parse(settings.getString('products', '[]'));

		products = products.filter(function(product){
			return (product.product_category_id == id);
		});

		this.set('products', products);
	}

	public gotoProduct(args){
		Frame.getFrameById('products-frame').navigate({moduleName: "views/tab/products/product-compact/product-compact-page", context: args.view.bindingContext.id, backstackVisible: false});
	}

}
