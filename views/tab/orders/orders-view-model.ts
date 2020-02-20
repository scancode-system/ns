import { Observable } from "tns-core-modules/data/observable";
import { Frame } from "tns-core-modules/ui/frame";
import * as settings from "tns-core-modules/application-settings";
import axios from "axios";
import * as dialogs from "tns-core-modules/ui/dialogs";

export class OrdersModel extends Observable {

	public loading;
	public content;

	constructor() {
		super();
		this.loading = 'collapsed';
		this.content = 'visible';
		settings.remove('order');
	}

	public loaded(args){

	}

	public gotoHistoric(){
		Frame.getFrameById('orders-frame').navigate({moduleName: "views/tab/orders/historic/historic-page", backstackVisible: false});
	}

	public gotoOrder(){
		dialogs.confirm({
			message: "Deseja iniciar um novo pedido?",
			okButtonText: "Sim",
			cancelButtonText: "Não",
			neutralButtonText: "Cancelar"
		})
		.then((result) => {
			if(result){
				this.set('loading', 'visible');
				this.set('content', 'collapsed');

				axios.post(settings.getString("api")+'/orders', {saller_id: JSON.parse(settings.getString('saller')).id},  {auth:{username:settings.getString("username"), password: settings.getString("password")}}).then(
					(result) => {
						settings.setString('order', JSON.stringify(result.data));
						Frame.getFrameById('orders-frame').navigate({moduleName: "views/tab/orders/order/order-page", context: result.data.id});
					},
					(error) => {
						alert(error.response.data.message);
					});
			}
		});
	}
	

	/*public logout(){
		settings.remove('saller');
		settings.remove('products');
		settings.remove('clients');
		settings.remove('shipping_companies');
		settings.remove('password');
		Frame.getFrameById('root-frame').navigate({moduleName: "views/login/login-page", clearHistory: true});
	}*/

}
