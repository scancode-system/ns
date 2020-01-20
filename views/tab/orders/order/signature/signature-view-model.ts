import { Observable } from "tns-core-modules/data/observable";
import { Frame } from "tns-core-modules/ui/frame";
import * as settings from "tns-core-modules/application-settings";
import axios from "axios";
import { DrawingPad } from 'nativescript-drawingpad';

export class SignatureModel extends Observable {

	public visibility_processing;
	public visibility_page;
	public processing_message;

	public order;

	constructor() {
		super();
		this.visibility_processing = 'collapsed';
		this.visibility_page = 'visible';
		this.processing_message = 'Atualizando Assinatura';

		this.order = JSON.parse(settings.getString('order'));
	}


	public update(args){
		this.set('visibility_processing', 'visible');
		this.set('visibility_page', 'collapsed');

		var ImageSourceModule = require('tns-core-modules/image-source');
		let drawingPad = <DrawingPad>Frame.getFrameById('orders-frame').getViewById('assinatura');

		drawingPad.getDrawing().then((desenho) => {
			var image = ImageSourceModule.fromNativeSource( desenho );
			var base64 = image.toBase64String();
			//var page = args.object.page;

			axios.put(settings.getString("api")+'/orders/'+this.order.id, {signature: base64}, {auth:{username:settings.getString("username"), password: settings.getString("password")}}).then(
				(result) => {
					settings.setString('order', JSON.stringify(result.data));
					Frame.getFrameById('orders-frame').goBack();
				},
				(error) => {
					console.log('ERROR');
					if(error.response.status == 401)
					{
						Frame.getFrameById("root-frame").navigate({moduleName: "views/login/login-page", clearHistory: true});
					} else if(error.response.status == 403){
						alert(error.response.data);					
					} else {
						alert(error.response.data.message);
						alert('Chame o administrador do sistema');
					}
					this.set('visibility_processing', 'collapsed');
					this.set('visibility_page', 'visible');
				});

		});
	}

}




