import { Observable } from "tns-core-modules/data/observable";
import { Frame } from "tns-core-modules/ui/frame";
import * as settings from "tns-core-modules/application-settings";
import axios from "axios";

export class DeliveryModel extends Observable {

	public visible_loaded;
	public visible_update_full_delivery;

	constructor() {
		super();
		this.visible_loaded = 'visible';
		this.visible_update_full_delivery = 'collapsed';
	}

	public updateOne(){
		this.update(1);
	}

	public updateZero(){
		this.update(0);
	}

	private update(full_delivery){
		this.set('visible_update_full_delivery', 'visible');
		this.set('visible_loaded', 'collapsed');

		axios.put(settings.getString("api")+'/orders/'+JSON.parse(settings.getString('order')).id, {full_delivery: full_delivery}, {auth:{username:settings.getString("username"), password: settings.getString("password")}}).then(
			(result) => {
				settings.setString('order', JSON.stringify(result.data));
				Frame.getFrameById('orders-frame').goBack();
			},
			(error) => {
				this.set('visible_update_full_delivery', 'collapsed');
				this.set('visible_loaded', 'visible');
				if(error.response.status == 403){
					alert(error.response.data);					
				} else {
					alert(error.response.data.message);
				}
			});
	}



}
