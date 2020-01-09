import { Observable } from "tns-core-modules/data/observable";
import { Frame } from "tns-core-modules/ui/frame";
import * as settings from "tns-core-modules/application-settings";
import axios from "axios";

export class ObservationModel extends Observable {

	public visible_loaded;
	public visible_update_observation;
	public observation;

	constructor() {
		super();
		this.visible_loaded = 'visible';
		this.visible_update_observation = 'collapsed';
		this.observation = JSON.parse(settings.getString('order')).observation;
	}

	public loaded(args) {

	}

	public update(){
		this.set('visible_update_observation', 'visible');
		this.set('visible_loaded', 'collapsed');

		axios.put(settings.getString("api")+'/orders/'+JSON.parse(settings.getString('order')).id, {observation: this.observation}, {auth:{username:settings.getString("username"), password: settings.getString("password")}}).then(
			(result) => {
				Frame.getFrameById('orders-frame').goBack();
			},
			(error) => {
				alert(error.response.data.message);
			});

		//Frame.getFrameById('orders-frame').navigate("views/tab/orders/historic/historic-page");
	}



}
