import { Observable } from "tns-core-modules/data/observable";
import axios from "axios";
import * as settings from "tns-core-modules/application-settings";
import { Frame } from "tns-core-modules/ui/frame";

export class ProductModel extends Observable {

	public id: number;
	public product; 
	public url;

	public loading;
	public content;

	constructor(id) {
		super();
		this.id = id;
		this.url = settings.getString('url')+'/';

		this.loading = 'visible';
		this.content = 'collapsed';

		axios.get(settings.getString("api")+'/products/'+this.id, {auth:{username:settings.getString("username"), password: settings.getString("password")}}).then(
			(result) => {
				this.set('product', result.data);
				this.set('loading', 'collapsed');
				this.set('content', 'visible');
			},
			(error) => {
				if(error.response.status == 401)
				{
					settings.remove('saller');
					settings.remove('products');
					settings.remove('clients');
					settings.remove('shipping_companies');
					Frame.getFrameById("root-frame").navigate({moduleName: "views/login/login-page", clearHistory: true});
				} else if(error.response.status == 404){
					alert('Produto não encontrado');
				} else {
					alert('Chame o administrador do sistema');
				}
			});

	}

	public loaded(args) {

	}



}
