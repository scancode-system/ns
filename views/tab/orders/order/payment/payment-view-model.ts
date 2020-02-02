import { Observable } from "tns-core-modules/data/observable";
import { Frame } from "tns-core-modules/ui/frame";
import * as settings from "tns-core-modules/application-settings";
import axios from "axios";

export class PaymentModel extends Observable {

	public visible_loading;
	public visible_loaded;
	public visible_update_payment;

	public order;
	public payments: Array<object>;
	public selected_payment_id;
	public index;

	constructor() {
		super();
		this.visible_loading = 'visible';
		this.visible_loaded = 'collapsed';
		this.visible_update_payment = 'collapsed';
		this.order = JSON.parse(settings.getString('order'));
	}

	public loaded(args) {

		axios.get(settings.getString("api")+'/payments/all', {auth:{username:settings.getString("username"), password: settings.getString("password")}}).then(
			(result) => {
				var payments = result.data;
				var payments_allowed = payments.filter(function(payment){
					return payment.min_value <= this
					//alert(this);
				}, this.order.total);
				payments_allowed.unshift({description: 'Selecione um Pagamento'});

				this.set('payments', payments_allowed);

				this.set('visible_loading', 'collapsed');
				this.set('visible_loaded', 'visible');

				var index = payments.findIndex(function(this, payment){
					return payment.id == this.order.order_payment.payment_id;
				}, this);

				this.set('index', index);
			},
			(error) => {
				alert(error.response.data.message);
			});
	}

	public update(args) {
		this.set('visible_update_payment', 'visible');
		this.set('visible_loaded', 'collapsed');
		var payment = this.selected_payment_id;
		if(!payment){
			payment = null;
		}

		console.log(settings.getString("api")+'/orders/'+this.order.id);
		axios.put(settings.getString("api")+'/orders/'+this.order.id, {payment_id: payment}, {auth:{username:settings.getString("username"), password: settings.getString("password")}}).then(
			(result) => {
				settings.setString('order', JSON.stringify(result.data));
				Frame.getFrameById('orders-frame').goBack();
			},
			(error) => {
				console.log(error.response);
				if(error.response.status == 403){
					alert(error.response.data);					
				}
				this.set('visible_update_payment', 'collapsed');
				this.set('visible_loaded', 'visible');
			});

	}

}
