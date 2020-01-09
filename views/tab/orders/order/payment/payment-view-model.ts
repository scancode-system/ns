import { Observable } from "tns-core-modules/data/observable";
import { Frame } from "tns-core-modules/ui/frame";
import * as settings from "tns-core-modules/application-settings";
import axios from "axios";

export class PaymentModel extends Observable {

	public visible_loading;
	public visible_loaded;
	public visible_update_payment;

	public payments: Array<object>;
	public selected_payment_id;

	constructor() {
		super();
		this.visible_loading = 'visible';
		this.visible_loaded = 'collapsed';
		this.visible_update_payment = 'collapsed';
	}

	public loaded(args) {
		axios.get(settings.getString("api")+'/payments/all', {auth:{username:settings.getString("username"), password: settings.getString("password")}}).then(
			(result) => {
				this.set('payments', result.data);
				this.set('visible_loading', 'collapsed');
				this.set('visible_loaded', 'visible');
			},
			(error) => {
				alert(error.response.data.message);
			});
	}

	public update(args) {
		this.set('visible_update_payment', 'visible');
		this.set('visible_loaded', 'collapsed');

		axios.put(settings.getString("api")+'/orders/'+JSON.parse(settings.getString('order')).id, {payment_id: this.selected_payment_id}, {auth:{username:settings.getString("username"), password: settings.getString("password")}}).then(
			(result) => {
				Frame.getFrameById('orders-frame').goBack();
			},
			(error) => {
				alert(error.response.data.message);
			});

	}

}
