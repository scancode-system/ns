import { Observable } from "tns-core-modules/data/observable";
import { Frame } from "tns-core-modules/ui/frame";
import axios from "axios";
import * as settings from "tns-core-modules/application-settings";


export class LoginModel extends Observable {

	private email: string;
	private password: string;

	constructor() {
		super();
		this.email =  settings.getString('username');
		this.password =  settings.getString('password');
	}

	public login() {
		axios.get(settings.getString("api")+'/sallers/auth', {auth:{username:this.email, password: this.password}}).then(
			(result) => {
				if(isNaN(result.data.id))
				{
					alert('Representante, não encontrado, verifique a REDE');
				} else {
					settings.setString('username', this.email);
					settings.setString('password', this.password);
					settings.setNumber('saller', result.data.id);
					Frame.getFrameById("root-frame").navigate({moduleName: "views/tab/tab-page", clearHistory: true});
				}
			},
			(error) => {
				alert(error.response.data.message);
			});
	}

}
