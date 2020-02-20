import { Observable, PropertyChangeData } from "tns-core-modules/data/observable";
import { Frame } from "tns-core-modules/ui/frame";
import * as settings from "tns-core-modules/application-settings";
import axios from "axios";

export class ClientListModel extends Observable {

	public clients: Array<object>;
	public search;

	public visibility_processing;
	public visibility_page;
	public processing_message;

	constructor() {
		super();
		this.visibility_processing = 'collapsed';
		this.visibility_page = 'visible';
		this.processing_message = 'Buscando Clientes';

		this.on(Observable.propertyChangeEvent, (propertyChangeData: PropertyChangeData) => {
			if (propertyChangeData.propertyName === "search") {
				this.set('visibility_processing', 'visible');
				this.set('visibility_page', 'collapsed');
				setTimeout(function(model, length_before){
					if(length_before == model.search.length){
						model.set('visibility_processing', 'collapsed');
						model.set('visibility_page', 'visible');
						model.filter();
					} else {
						//console.log('nao');
					}
				}, 1000, this, this.search.length);

				//this.filter();
			}
		}, this);		
	}

	public filter(){
		var clients_all = JSON.parse(settings.getString('clients', '[]'));
		var clients = clients_all.filter((client, index) => {
			if (this.search != "") {
				if (client.id.toString().indexOf(this.search) != -1) {
					return true;
				}
				if (client.fantasy_name != null) {
					if (client.fantasy_name.toLowerCase().indexOf(this.search.toLowerCase()) != -1) {
						return true;
					}   
				}
				if (client.corporate_name != null) {
					if (client.corporate_name.toLowerCase().indexOf(this.search.toLowerCase()) != -1) {
						return true;
					}   
				}
				if (client.cpf_cnpj != null) {
					if (client.cpf_cnpj.indexOf(this.search) != -1) {
						return true;
					}
				}
			}
			return false;
		});

		clients = clients.slice(-30);
		this.set('clients', clients);
	}


	public gotoClientShow(args){
		var client = args.view.bindingContext;
		Frame.getFrameById('orders-frame').navigate({moduleName: "views/tab/orders/order/client/client-show/client-show-page", context: {id: client.id, buyer: client.buyer, phone: client.phone, email: client.email},  backstackVisible: false});
	}

	public gotoClientCreate(){
		Frame.getFrameById('orders-frame').navigate({moduleName: "views/tab/orders/order/client/client-create/client-create-page"});
	}

}



