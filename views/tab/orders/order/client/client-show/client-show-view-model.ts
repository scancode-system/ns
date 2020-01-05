import { Observable } from "tns-core-modules/data/observable";
import { Frame } from "tns-core-modules/ui/frame";

export class ClientShowModel extends Observable {

	public clients: Array<object>;

	constructor() {
		super();
	}

	public loaded(args) {
		this.set('clients', [
			{corporate_name: 'Cila Ltda.', cpf_cnpj: '43274732848923'},
			{corporate_name: 'Cila Ltda.', cpf_cnpj: '43274732848923'},
			{corporate_name: 'Cila Ltda.', cpf_cnpj: '43274732848923'},
			{corporate_name: 'Cila Ltda.', cpf_cnpj: '43274732848923'},
			{corporate_name: 'Cila Ltda.', cpf_cnpj: '43274732848923'},
			{corporate_name: 'Cila Ltda.', cpf_cnpj: '43274732848923'},
			{corporate_name: 'Cila Ltda.', cpf_cnpj: '43274732848923'},
			{corporate_name: 'Cila Ltda.', cpf_cnpj: '43274732848923'},
			{corporate_name: 'Cila Ltda.', cpf_cnpj: '43274732848923'}
			]);
	}

	public gotoClientShow(){
		Frame.getFrameById('orders-frame').navigate("views/tab/orders/order/client/client-show/client-show-page");
	}

	public gotoClientCreate(){
		Frame.getFrameById('orders-frame').navigate("views/tab/orders/order/client/client-create/client-create-page");
	}

}
