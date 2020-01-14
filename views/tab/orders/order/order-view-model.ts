import { Observable } from "tns-core-modules/data/observable";
import { Frame } from "tns-core-modules/ui/frame";
import axios from "axios";
import * as settings from "tns-core-modules/application-settings";
import { BarcodeScanner } from "nativescript-barcodescanner";
import { TabView } from "tns-core-modules/ui/tab-view";
import * as dialogs from "tns-core-modules/ui/dialogs";

export class OrderModel extends Observable {

	public order;

	public visibility_processing;
	public visibility_page;
	public processing_message;

	constructor(id) {
		super();
	}

	public loaded(args = null) {
		this.set('visibility_processing', 'collapsed');
		this.set('visibility_page', 'visible');
		this.set('order', JSON.parse(settings.getString('order')));
	}


	public gotoClient(){
		var order_client = this.order.order_client;
		if(order_client.client_id){
			Frame.getFrameById('orders-frame').navigate({moduleName: "views/tab/orders/order/client/client-show/client-show-page", context: {id: order_client.client_id, buyer: order_client.buyer, phone: order_client.phone, email: order_client.email},  backstackVisible: false});
		} else {
			Frame.getFrameById('orders-frame').navigate({moduleName: "views/tab/orders/order/client/client-list/client-list-page",  backstackVisible: false});
		}

	}

	public gotoPayment(){
		Frame.getFrameById('orders-frame').navigate("views/tab/orders/order/payment/payment-page");
	}

	public gotoObservation(){
		Frame.getFrameById('orders-frame').navigate("views/tab/orders/order/observation/observation-page");
	}

	public gotoDelivery(){
		Frame.getFrameById('orders-frame').navigate("views/tab/orders/order/delivery/delivery-page");
	}

	public gotoShippingCompany(){
		Frame.getFrameById('orders-frame').navigate("views/tab/orders/order/shipping-company/shipping-company-page");
	}

	public gotoSignature(){
		Frame.getFrameById('orders-frame').navigate("views/tab/orders/order/signature/signature-page");		
	}

	public discountPrompt(){
		dialogs.prompt({
			title: "Desconto",
			message: "O desconto será atribuído a cada item no pedido. Lembrando que alguns items pode ter limitação na porcentagem de desconto.",
			okButtonText: "Confirmar",
			cancelButtonText: "Cancelar",
			defaultText: "",
			inputType: dialogs.inputType.number
		}).then(
		(result) => {
			if(result.result && result.text != ''){
				this.set('visibility_processing', 'visible');
				this.set('visibility_page', 'collapsed');
				this.set('processing_message', 'Aplicando desconto');

				axios.put(settings.getString("api")+'/orders/'+this.order.id+'/updateDiscount', {discount: result.text}, {auth:{username:settings.getString("username"), password: settings.getString("password")}}).then(
					(result) => {
						settings.setString('order', JSON.stringify(result.data));
						this.loaded();
					},
					(error) => {
						if(error.response.status == 401)
						{
							settings.remove('saller');
							settings.remove('products');
							settings.remove('clients');
							settings.remove('shipping_companies');
							Frame.getFrameById("root-frame").navigate({moduleName: "views/login/login-page", clearHistory: true});
						} else if(error.response.status == 422) {
							var errors = Object.keys(error.response.data.errors);
							alert(error.response.data.errors[errors[0]][0]);
						} else if(error.response.status == 403){
							alert(error.response.data);					
						} else {
							alert('Chame o administrador do sistema');
							alert(error.response.data.message);
						}
						this.loaded();
					});
			}
		});
	}

	public completedTap(args){
		dialogs.confirm("Deseja concluir o pedido?").then(function (result) {
			if(result){
				this.completed();
			}
		}.bind(this));
	}

	public completed(args){
		this.set('visibility_processing', 'visible');
		this.set('visibility_page', 'collapsed');
		this.set('processing_message', 'Concluindo Pedido');

		axios.put(settings.getString("api")+'/orders/'+this.order.id, {status_id: 2}, {auth:{username:settings.getString("username"), password: settings.getString("password")}}).then(
			(result) => {
				alert('Pedido Concluído');
				Frame.getFrameById("orders-frame").navigate({moduleName: "views/tab/orders/orders-page", clearHistory: true});
			},
			(error) => {
				if(error.response.status == 401)
				{
					settings.remove('saller');
					settings.remove('products');
					settings.remove('clients');
					settings.remove('shipping_companies');
					Frame.getFrameById("root-frame").navigate({moduleName: "views/login/login-page", clearHistory: true});
				} else {
					this.set('visibility_processing', 'collapsed');
					this.set('visibility_page', 'visible');
					alert(error.response.data.message);
				}
			});
	}

	public reserveTap(args){
		dialogs.confirm("Deseja resevar o pedido?").then(function (result) {
			if(result){
				this.reserve();
			}
		}.bind(this));
	}

	public reserve(args){
		this.set('visibility_processing', 'visible');
		this.set('visibility_page', 'collapsed');
		this.set('processing_message', 'Reservando Pedido');

		axios.put(settings.getString("api")+'/orders/'+this.order.id, {status_id: 4}, {auth:{username:settings.getString("username"), password: settings.getString("password")}}).then(
			(result) => {
				Frame.getFrameById("orders-frame").navigate({moduleName: "views/tab/orders/orders-page", clearHistory: true});
			},
			(error) => {
				if(error.response.status == 401)
				{
					settings.remove('saller');
					settings.remove('products');
					settings.remove('clients');
					settings.remove('shipping_companies');
					Frame.getFrameById("root-frame").navigate({moduleName: "views/login/login-page", clearHistory: true});
				} else {
					alert('Chame o administrador do sistema');
					alert(error.response.data.message);
				}
			});
	}

	public cancelTap(args){
		dialogs.confirm("Deseja cancelar o pedido?").then(function (result) {
			if(result){
				this.cancel();
			}
		}.bind(this));
	}


	public cancel(){
		this.set('visibility_processing', 'visible');
		this.set('visibility_page', 'collapsed');
		this.set('processing_message', 'Cancelando Pedido');

		axios.put(settings.getString("api")+'/orders/'+this.order.id, {status_id: 3}, {auth:{username:settings.getString("username"), password: settings.getString("password")}}).then(
			(result) => {
				Frame.getFrameById("orders-frame").navigate({moduleName: "views/tab/orders/orders-page", clearHistory: true});
			},
			(error) => {
				if(error.response.status == 401)
				{
					settings.remove('saller');
					settings.remove('products');
					settings.remove('clients');
					settings.remove('shipping_companies');
					Frame.getFrameById("root-frame").navigate({moduleName: "views/login/login-page", clearHistory: true});
				} else {
					alert('Chame o administrador do sistema');
					alert(error.response.data.message);
				}
			});
	}

	public printTap(args){
		this.set('visibility_processing', 'visible');
		this.set('visibility_page', 'collapsed');
		this.set('processing_message', 'Solicitando impressão');

		axios.get(settings.getString("api")+'/print_auto/'+this.order.id, {auth:{username:settings.getString("username"), password: settings.getString("password")}}).then(
			(result) => {
				alert('Impressão Solicitada');
				this.set('visibility_processing', 'collapsed');
				this.set('visibility_page', 'visible');
			},
			(error) => {
				if(error.response.status == 401)
				{
					settings.remove('saller');
					settings.remove('products');
					settings.remove('clients');
					settings.remove('shipping_companies');
					Frame.getFrameById("root-frame").navigate({moduleName: "views/login/login-page", clearHistory: true});
				} else {
					alert('Chame o administrador do sistema');
					alert(error.response.data.message);
				}
			});
	}

	public homeTap(args){
		Frame.getFrameById("orders-frame").navigate({moduleName: "views/tab/orders/orders-page", clearHistory: true});
	}
}
