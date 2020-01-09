import { Observable } from "tns-core-modules/data/observable";
import { Frame } from "tns-core-modules/ui/frame";
import * as settings from "tns-core-modules/application-settings";

export class ProductCategoriesModel extends Observable {

	public categories: Array<object>;

	constructor() {
		super();
	}

	public loaded(args) {
		var products = JSON.parse(settings.getString('products', '[]'));

		var categories = [];
		products.forEach(function(product){
			var less = true;
			categories.forEach(function(category){
				if(product.product_category.description == category.description){
					less = false;
				}
			});
			if(less){
				categories.push(product.product_category);
			}
		});

		this.set('categories', categories);
	}

	public gotoProducts(args){
		Frame.getFrameById('products-frame').navigate({moduleName: "views/tab/products/products/products-page", context: args.view.bindingContext.id});
	}

}