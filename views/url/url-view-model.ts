import { Observable } from "tns-core-modules/data/observable";
import { Frame } from "tns-core-modules/ui/frame";
import axios from "axios";
import * as settings from "tns-core-modules/application-settings";


export class UrlModel extends Observable {

	private url: string;

	public visibility_processing;
	public visibility_page;
	public processing_message;

	constructor() {
		super();
		this.visibility_processing = 'collapsed';
		this.visibility_page = 'visible';
	}


	public check() {
		this.set('visibility_processing', 'visible');
		this.set('visibility_page', 'collapsed');
		this.set('processing_message', 'Checando conexão');
		axios.get(this.url+'/api/dashboard/check').then(
			(result) => {
				if(result.status == 200){
					settings.setString('url', this.url);
					settings.setString('api', settings.getString('url')+'/api');
					Frame.getFrameById("root-frame").navigate({moduleName: "views/login/login-page", clearHistory: true});
				} else {
					alert('Servidor não encontrado');
					this.set('visibility_processing', 'collapsed');
					this.set('visibility_page', 'visible');
				}
			},
			(error) => {
				alert('Servidor não encontrado');
				this.set('visibility_processing', 'collapsed');
				this.set('visibility_page', 'visible');
			});
	}

}
