import { Observable } from "tns-core-modules/data/observable";
//import { Frame } from "tns-core-modules/ui/frame";
import axios from "axios";
import * as settings from "tns-core-modules/application-settings";


export class TabModel extends Observable {

	constructor() {
		super();
	}

	public refresh(){
		console.log('refresh');
		axios.get(settings.getString("api")+'/products/all', {auth:{username:settings.getString("username"), password: settings.getString("password")}}).then(
			(result) => {
				
			},
			(error) => {
				alert(error);

				alert(error.response);
			});
	}

}
