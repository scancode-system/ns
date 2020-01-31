import { Observable } from "tns-core-modules/data/observable";
import axios from "axios";
import * as settings from "tns-core-modules/application-settings";
import { Frame } from "tns-core-modules/ui/frame";
import { TabView } from "tns-core-modules/ui/tab-view";
import * as dialogs from "tns-core-modules/ui/dialogs";
import * as utils from "tns-core-modules/utils/utils";
import { isIOS, isAndroid } from "tns-core-modules/platform";


export class ProductModel extends Observable {

	public product; 
	public item;
	public observation;

	public id: number;
	public url;

	public visibility_processing;
	public visibility_page;
	public visibility_edit_item;
	public processing_message;

	public selected__product_family_id;
	public index_product_family;

	constructor(id) {
		super();
		this.id = id;
		this.url = settings.getString('url')+'/';
	}

	public loaded(args) {
		this.set('visibility_processing', 'visible');
		this.set('visibility_page', 'collapsed');
		this.set('visibility_edit_item', 'collapsed');
		this.set('processing_message', 'Carregando Produto');

		axios.get(settings.getString("api")+'/products/'+this.id, {auth:{username:settings.getString("username"), password: settings.getString("password")}}).then(
			(result) => {
				this.set('product', result.data);
				this.loadItem(result.data.id);

				this.set('visibility_processing', 'collapsed');
				this.set('visibility_page', 'visible');

				if(this.item.order_id){
					this.set('visibility_edit_item', 'visible');
				}

				this.setListPickerProductFamily();
			},
			(error) => {
				console.log(error.response);
				if(error.response.status == 401)
				{
					Frame.getFrameById("root-frame").navigate({moduleName: "views/login/login-page", clearHistory: true});
				} else if(error.response.status == 404){
					alert('Produto não encontrado');
				} else {
					alert(error.response.data.message);
					alert('Chame o administrador do sistema.');
				}
			});
	}

	public loadItem(id){
		var order = JSON.parse(settings.getString('order', null));
		if(order){
			var item = order.items.find(function(item){
				return item.product_id == id 
			});

			if(item){
				this.set('item', {id: item.id, order_id: item.order_id, product_id: item.product_id, qty: item.qty, discount: Math.round(item.discount), price: item.price, observation: item.observation});
				this.set('observation', item.observation);
			} else {
				this.set('item', {id: null, order_id: order.id, product_id: this.id, qty:1, discount: 0, price: this.product.price, observation: ''});
			}
		} else {
			this.set('item', {order_id: null});
		}	
	}

	public setListPickerProductFamily(){
		var index_product_family = this.product.family.findIndex(function(this, product){
			return this.id == product.id;
		}, this);

		this.set('index_product_family', index_product_family);
	}

	public selectProductTap(args){
		Frame.getFrameById('products-frame').navigate({moduleName: "views/tab/products/product/product-page", context: this.selected__product_family_id, backstackVisible: false});
	}

	public add(args){
		this.updateQty(1);
	}

	public remove(args){
		if(this.item.qty>1){
			this.updateQty(-1);
		}
	}

	private updateQty(qty){
		this.set('item', {id: this.item.id, order_id: this.item.order_id, product_id: this.item.product_id, qty: (this.item.qty+qty), discount: this.item.discount, price: this.item.price, observation: this.item.observation});
	}

	private updateDiscount(discount){
		this.set('item', {id: this.item.id, order_id: this.item.order_id, product_id: this.item.product_id, qty: this.item.qty, discount: discount, price: this.item.price, observation: this.item.observation});
	}

	private updateObservation(observation){
		this.set('item', {id: this.item.id, order_id: this.item.order_id, product_id: this.item.product_id, qty: this.item.qty, discount: this.item.discount, price: this.item.price, observation: observation});
	}

	public discountPrompt(){
		dialogs.prompt({
			title: "Desconto - Item",
			message: this.messageDiscountPrompt(),
			okButtonText: "Confirmar",
			cancelButtonText: "Cancelar",
			defaultText: "",
			inputType: dialogs.inputType.number
		}).then(
		(result) => {
			/* ATENÇÃO O TECLADO FICA LEVANTADO POR CAUSA DO TEXTVIWE PARA LEITURA DA BARRA DE CODIGO QUE VOLTA A FOCAR NELE */
			setTimeout(function(){
				if (isIOS) {
					Frame.topmost().nativeView.endEditing(true);
				}
				if (isAndroid) {
					utils.ad.dismissSoftInput();
				}
			}, 50);
			
			if(result.result){
				if(result.text == ''){
					this.updateDiscount(0);
				} else {
					this.updateDiscount(result.text);	
				}
			}
		});
	}

	private messageDiscountPrompt(){
		if(this.product.discount_limit == 100){
			return '';
		} else if(this.product.discount_limit == 0) {
			return 'Atenção: Este produto está bloqueado para receber desconto.';
		} else {
			return 'Atenção: Este produto possui limitador de desconto.';
		}
	}


	public confirm(args){
		this.set('visibility_processing', 'visible');
		this.set('visibility_page', 'collapsed');
		this.set('visibility_edit_item', 'collapsed');
		this.set('processing_message', 'Atualizando a Sacola');
		this.updateObservation(this.observation);

		if(this.item.id){
			this.put();
		} else {
			this.post();
		}

	}

	public post(){
		console.log(this.item);
		axios.post(settings.getString("api")+'/items/'+this.item.order_id, this.item,{auth:{username:settings.getString("username"), password: settings.getString("password")}}).then(
			(result) => {
				settings.setString('order', JSON.stringify(result.data));
				Frame.getFrameById('products-frame').goBack();
				var tab_view = <TabView>Frame.getFrameById('root-frame').getViewById('tab-view'); 
				tab_view.selectedIndex = 1;
			},
			(error) => {
				console.log(error);
				console.log(error.response);
				this.set('visibility_processing', 'collapsed');
				this.set('visibility_page', 'visible');
				this.set('visibility_edit_item', 'visible');
				if(error.response.status == 401 || error.response.status == 404)
				{
					Frame.getFrameById("root-frame").navigate({moduleName: "views/login/login-page", clearHistory: true});
				} else if(error.response.status == 422) {
					var errors = Object.keys(error.response.data.errors);
					alert(error.response.data.errors[errors[0]][0]);
				} else if(error.response.status == 403){
					alert(error.response.data);					
				} else {
					alert(error.response.data.message);
				}
			});
	}

	public put(){
		axios.put(settings.getString("api")+'/items/'+this.item.id, this.item,{auth:{username:settings.getString("username"), password: settings.getString("password")}}).then(
			(result) => {
				settings.setString('order', JSON.stringify(result.data));
				Frame.getFrameById('products-frame').goBack();
				var tab_view = <TabView>Frame.getFrameById('root-frame').getViewById('tab-view'); 
				tab_view.selectedIndex = 1;
			},
			(error) => {
				this.set('visibility_processing', 'collapsed');
				this.set('visibility_page', 'visible');
				this.set('visibility_edit_item', 'visible');
				if(error.response.status == 401 || error.response.status == 404)
				{
					Frame.getFrameById("root-frame").navigate({moduleName: "views/login/login-page", clearHistory: true});
				} else if(error.response.status == 422) {
					var errors = Object.keys(error.response.data.errors);
					alert(error.response.data.errors[errors[0]][0]);
				} else if(error.response.status == 403){
					alert(error.response.data);					
				}else {
					alert(error.response.data.message);
				}
			});
	}	

}
