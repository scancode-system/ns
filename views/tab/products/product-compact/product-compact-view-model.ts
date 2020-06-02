import { Observable } from "tns-core-modules/data/observable";
import axios from "axios";
import * as settings from "tns-core-modules/application-settings";
import { Frame } from "tns-core-modules/ui/frame";
import { TabView } from "tns-core-modules/ui/tab-view";
import * as dialogs from "tns-core-modules/ui/dialogs";
import * as utils from "tns-core-modules/utils/utils";
import { isIOS, isAndroid } from "tns-core-modules/platform";
import { Label } from "tns-core-modules/ui/label";
import { Button } from "tns-core-modules/ui/button";
import {FlexboxLayout} from "tns-core-modules/ui/layouts/flexbox-layout";

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

	public variations;

	public all;
	public available;

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
				console.log(result.data);
				this.set('product', result.data);

				this.set('all', this.product.product_variation.all);
				this.set('available', this.product.product_variation.available);

				
				this.loadItem(result.data.id);


				this.set('visibility_processing', 'collapsed');
				this.set('visibility_page', 'visible');
				if(this.item.order_id){
					this.set('visibility_edit_item', 'visible');
				}

				this.loadingVariations(args.object);
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

	private loadingVariations(page){
		let flexbox_variations = <FlexboxLayout>(page).getViewById('variations');
		flexbox_variations.removeChildren();

		let product = this.product;
		let available = this.available;
		let modelThis = this;

		this.all.forEach(function(variation, index){
			if(variation.items.length != 0){
				let product_variation_value = 'N/A';
				if(product[variation.table]){
					product_variation_value = product[variation.table][variation.column];
				} 

				const container_label = new FlexboxLayout();
				const container_btns = new FlexboxLayout();
				container_btns.id = variation.table;

				const myLabel = new Label();
				myLabel.text = variation.variation+': ';
				myLabel.className = 't-12';

				const myLabel2 = new Label();
				myLabel2.text = product_variation_value ;
				myLabel2.className = 't-12 font-weight-bold';

				container_label.addChild(myLabel);
				container_label.addChild(myLabel2);

				

				for (let i in variation.items) {
					let value = variation.items[i];

					const btn = new Button();
					btn.text = value;
					btn.className = "-outline-dark m-l-0 m-t-0 m-b-10";


					if(available[index].items.findIndex(element => element == value) == -1){
						btn.className = "-outline-secondary text-secondary m-l-0 m-t-0 m-b-10";
					}

					if(value == product_variation_value){
						btn.className = "-outline-dark bg-dark  m-l-0 m-t-0 m-b-10";
					}

					btn.on(Button.tapEvent, (data) => {
						let btn = <Button>data.object;

						let variation = btn.parent.id;
						let value = btn.text; 
						let product = modelThis.getProductByVariations(variation, value);
						//console.log(product);
						if(product){
							Frame.getFrameById('products-frame').navigate({moduleName: "views/tab/products/product-compact/product-compact-page", context: product.id, backstackVisible: false});
						} else {
							product = modelThis.getProductByChanged(variation, value);
							console.log(product);
							Frame.getFrameById('products-frame').navigate({moduleName: "views/tab/products/product-compact/product-compact-page", context: product.id, backstackVisible: false});
						}
					});

					container_btns.addChild(btn);
				}

				flexbox_variations.addChild(container_label);
				flexbox_variations.addChild(container_btns);
			}
		});		
	}

	private getProductByVariations(variantionChanged, newValue){
		console.log(variantionChanged);
		console.log(newValue);

		let products = this.product.family;
		let product = products.find(product => {

			let find = true;
			this.all.forEach(variation => {

				let value = newValue;
				if(variation.table != variantionChanged){
					if(this.product[variation.table]){
						value = this.product[variation.table][variation.column];
					} else {
						value = this.product[variation.table];
					}
				}


				if(product[variation.table] === null){
					if(product[variation.table] !== value){
						find = false;
					}
				} else if(product[variation.table][variation.column] != value){
					if(product[variation.table][variation.column] !== value){
						find = false;
					}
				}


				/*if(variation.table == variantionChanged){
					value = 
				} else {

				}



				if(product[variation.table] === null){

					if(this.product[variation.table] !== product[variation.table]){
						find= false;
					}
				} else if(variation.table == variantionChanged){
					if(product[variation.table][variation.column] != newValue) {
						find = false;
					}
				} else if(product[variation.table][variation.column] != this.product[variation.table][variation.column]) {
					find = false;
				}*/




				
			});
			return find;
		});

		return product;
	}


	private getProductByChanged(variantionChanged, newValue){
		let products = this.product.family;
		let product = products.find(product => {
			let find = false;
			this.all.forEach(variation => {
				if(variation.table == variantionChanged){
					if(product[variation.table] !== null){
						if(product[variation.table][variation.column] == newValue){
							find = true;
						}
					}
				}				
			});
			return find;
		});
		return product;
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
				console.log(this.qty_start());
				this.set('item', {id: null, order_id: order.id, product_id: this.id, qty: this.qty_start(), discount: 0, price: this.product.price, observation: ''});
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
		this.updateQty(1*this.product.multiple);
	}

	public remove(args){
		let new_qty = this.item.qty-this.product.multiple;
		if(this.qty_check(new_qty)){
			this.updateQty(-1*this.product.multiple);
		}
	}

	public changeQty(args){
		this.qtyPrompt();
	}

	public qtyPrompt(){
		dialogs.prompt({
			message: "Digite a Quantidade",
			okButtonText: "Confirmar",
			cancelButtonText: "Cancelar",
			defaultText: this.item.qty+'',
			inputType: dialogs.inputType.number
		}).then(
		(result) => {
			/* ATENÇÃO O TECLADO FICA LEVANTADO POR CAUSA DO TEXTVIWE PARA LEITURA DA BARRA DE CODIGO QUE VOLTA A FOCAR NELE */
			/*setTimeout(function(){
				if (isIOS) {
					Frame.topmost().nativeView.endEditing(true);
				}
				if (isAndroid) {
					utils.ad.dismissSoftInput();
				}
			}, 50);*/

			if(result.result){
				if(result.text != ''){
					if(this.qty_check(parseInt(result.text))){
						this.updateQtyPrompt(parseInt(result.text));
					} else {
						alert('Quantidade Inválida, verifique mínimo e múltiplo do produto.');
					}
				}
			}
		});
	}

	private updateQtyPrompt(qty){
		this.set('item', {id: this.item.id, order_id: this.item.order_id, product_id: this.item.product_id, qty: (qty), discount: this.item.discount, price: this.item.price, observation: this.item.observation});
	}

	private updateQty(qty){
		this.set('item', {id: this.item.id, order_id: this.item.order_id, product_id: this.item.product_id, qty: (this.item.qty+qty), discount: this.item.discount, price: this.item.price, observation: this.item.observation});
		console.log(this.item);
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


	public obsPrompt(){
		dialogs.prompt({
			message: 'Observação do Item',
			okButtonText: "Confirmar",
			cancelButtonText: "Cancelar",
			defaultText: this.item.observation+''
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
				this.updateObservation(result.text);
			}
		});
	}	


	public confirm(args){
		this.set('visibility_processing', 'visible');
		this.set('visibility_page', 'collapsed');
		this.set('visibility_edit_item', 'collapsed');
		this.set('processing_message', 'Atualizando a Sacola');
		//this.updateObservation(this.observation);

		if(this.item.id){
			this.put();
		} else {
			this.post();
		}

	}

	public post(){
		//console.log(this.item);
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
		console.log(this.item);
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

	// utils
	public qty_start(){
		for (let i = 0; i < 10000; i++) {
			if(this.qty_check(i)){
				return i;
			}
		}
		alert('Adiministrador: Verificar quantidade mínima e multiplo do produto.');
	}

	public qty_check(qty){
		return (this.product.min_qty <= qty && qty % this.product.multiple === 0);
	}

}
