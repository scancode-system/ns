import { Observable, PropertyChangeData } from "tns-core-modules/data/observable";
import axios from "axios";
import * as settings from "tns-core-modules/application-settings";
import { Frame } from "tns-core-modules/ui/frame";
import { TabView } from "tns-core-modules/ui/tab-view";
import {TextView} from "tns-core-modules/ui/text-view";
import * as dialogs from "tns-core-modules/ui/dialogs";
import * as utils from "tns-core-modules/utils/utils";
import { isIOS, isAndroid } from "tns-core-modules/platform";
const Semaphore = require('ts-semaphore');

export class TabModel extends Observable {

	public search;
	public scan;

	public visibility_processing_tab;
	public visibility_tab;
	public visibility_products;
	public visibility_scanning;

	public processing_message_tab;

	public orders_frame;

	public icon_orders: string;
	public icon_sacola: string;
	public icon_loja: string;

	public limit;

	constructor() {
		super();
//settings.remove('order');
		this.visibility_processing_tab = 'collapsed';
		this.visibility_tab = 'visible';
		this.visibility_products = 'collapsed';
		this.visibility_scanning = 'collapsed';


		//let order = JSON.parse(settings.getString('order'));
		if(JSON.parse(settings.getString('order', null))){
			this.orders_frame = 'views/tab/orders/order/order-page';
		} else {
			this.orders_frame = 'views/tab/orders/orders-page';
		}

		this.on(Observable.propertyChangeEvent, (propertyChangeData: PropertyChangeData) => {
			if (propertyChangeData.propertyName === "search") {
				this.filter();
			}
		}, this);

		this.on(Observable.propertyChangeEvent, (propertyChangeData: PropertyChangeData) => {
			if (propertyChangeData.propertyName === "scan") {
				if (isIOS) {
					Frame.topmost().nativeView.endEditing(true);
				}
				if (isAndroid) {
					utils.ad.dismissSoftInput();
				}
				this.scannig();
			}
		}, this);

		this.selectedTab(0);
		this.limit = new Semaphore(1);
	}

	public loaded(args){
//		settings.remove('order');
/*
//		settings.setString('order', '{}');
		settings.remove('order');
		console.log('111111111111111111111111111111111111');
		if(settings.getString('order'))
		console.log(settings.getString('order'));
	console.log('222222222222222222222222222222222222');
	*/


		var thisModel = this;
		setTimeout(function(){
			thisModel.scanFocus();
		}, 500);
	}

	public selectedIndexChanged(args) {
		this.selectedTab(args.newIndex);
	}

	private selectedTab(index){
		this.refreshIcons();
		switch(index){
			case 0: this.set("icon_orders", "res://pedido2"); this.refreshOrderPage();  break;
			case 1: this.set("icon_bag", "res://sacola2");  this.refreshBagPage(); break;
			case 2: this.set("icon_products", "res://loja2"); break;
		}   
		this.scanFocus();     
	}  

	private refreshIcons() {
		this.set('icon_orders', 'res://pedido1');
		this.set('icon_bag', 'res://sacola1');
		this.set('icon_products', 'res://loja1');
		//this.set('icon_mais', 'res://mais1');
	}

	private refreshBagPage(){
		// tratar atualizar comente se old index estiver dentro dos padroes
		let bag_page = Frame.getFrameById('root-frame').getViewById('bag-page');
		bag_page.bindingContext.loaded();
	}

	private refreshOrderPage(){
		// tratar atualizar comente se old index estiver dentro dos padroes
		var order_page = Frame.getFrameById('root-frame').getViewById('order-page');
		if(typeof order_page !== 'undefined'){
			order_page.bindingContext.loaded();
		}
	}


	public scanFocus(){
		var txt = <TextView>Frame.getFrameById('root-frame').getViewById('text-view-scan'); 
		if(txt){
			txt.focus();
			txt.dismissSoftInput();
			//this.scanning = false;
			txt.text = '';
		}
	}

	public scannig(){
		this.set('visibility_processing_tab', 'collapsed');
		this.set('visibility_tab', 'collapsed');
		this.set('visibility_products', 'collapsed');
		this.set('visibility_scanning', 'visible');

		var scan_now =  this.scan.replace(/(\r\n\t|\n|\r\t)/gm,"");	
		setTimeout(function(model, length_before){
			model.limit.use(async () => {
				await model.criticaFunction(length_before);
			});
		}, 750, this, scan_now.length);

		/*if(!this.scanning){
			console.log('INICIOU SCAN');
			setTimeout(function(model){
				//var search = model.scan.replace(/(\r\n\t|\n|\r\t)/gm,"");
				var search = model.scan.replace(/[^\x20-\x7E]/gmi, "");

				console.log(search);
				
				var txt = <TextView>Frame.getFrameById('root-frame').getViewById('text-view-scan');
				txt.text = '';
				model.searchProduct(search);
				model.scanning = false;
				console.log('FINALIZOU SCAN');

			}, 1000, this);
		} 
		this.scanning = true;*/
		

		/*var txt = <TextView>Frame.getFrameById('root-frame').getViewById('text-view-scan');
		txt.dismissSoftInput();
		if((this.scan.match(/\n/g)||[]).length == 1){
			//var search = txt.text;
			
			var search = this.scan.replace(/(\r\n\t|\n|\r\t)/gm,"");
			txt.text = '';
			console.log(search);
			this.searchProduct(search);			

		}*/
	}

	public criticaFunction(length_before){
		var search = this.scan.replace(/(\r\n\t|\n|\r\t)/gm,"");
		if(length_before == search.length){
			this.set('scan', '');
			if(search.length > 0){
				console.log(search);
				this.searchProduct(search);
				this.set('visibility_processing_tab', 'collapsed');
				this.set('visibility_tab', 'visible');
				this.set('visibility_products', 'collapsed');
				this.set('visibility_scanning', 'collapsed');
			}
		} 
	}

	public searchProduct(search){
		var products = JSON.parse(settings.getString('products', '[]'));
		var product = products.find(
			(product) => {
				var located = false;
				if(product.barcode == search){
					located = true;
				}
				if(product.sku == search){
					located = true;
				}
				return located;
			});
		if(product) {
			if(product.variation_mins.length > 0){
				Frame.getFrameById('products-frame').navigate({moduleName: "views/tab/products/product-variations-min/product-variations-min-page", context: product.id, backstackVisible: false});
			} else {
				Frame.getFrameById('products-frame').navigate({moduleName: "views/tab/products/product-compact/product-compact-page", context: product.id, backstackVisible: false});	
			}

			var tab_view = <TabView>Frame.getFrameById('root-frame').getViewById('tab-view'); 
			tab_view.selectedIndex = 2;

		} else {
			alert('Produto não encontrado, sincronize os dados clicando no botão superior direito, na barra de títulos.');
		}
	}	


	public filter(){
		var products_all = JSON.parse(settings.getString('products', '[]'));
		var products = products_all.filter((product, index) => {
			if (this.search != "") {
				if (product.description.toLowerCase().indexOf(this.search.toLowerCase()) != -1) {
					return true;
				}
				if (product.sku.toLowerCase().indexOf(this.search.toLowerCase()) != -1) {
					return true;
				}   
				if (product.barcode.toLowerCase().indexOf(this.search.toLowerCase()) != -1) {
					return true;
				}      
			}
			return false;
		});
		products = products.slice(-50);
		this.set('products', products);
	}

	public gotoProduct(args){
		this.action_back_tab();
		
		if(args.view.bindingContext.variation_mins.length > 0){
			Frame.getFrameById('products-frame').navigate({moduleName: "views/tab/products/product-variations-min/product-variations-min-page", context: args.view.bindingContext.id, backstackVisible: false});
		} else {
			Frame.getFrameById('products-frame').navigate({moduleName: "views/tab/products/product-compact/product-compact-page", context: args.view.bindingContext.id, backstackVisible: false});	
		}
		//Frame.getFrameById('products-frame').navigate({moduleName: "views/tab/products/product/product-page", context: args.view.bindingContext.id, backstackVisible: false});
		

		var tab_view = <TabView>Frame.getFrameById('root-frame').getViewById('tab-view'); 
		tab_view.selectedIndex = 2;
		this.set('search', '');
	}

	public actionLogout(){
		dialogs.confirm({
			message: "Temcerteza que deseja fazer logout?",
			okButtonText: "Sim",
			cancelButtonText: "Não",
			neutralButtonText: "Cancelar"
		})
		.then((result) => {
			if(result){
				settings.remove('saller');
				settings.remove('products');
				settings.remove('clients');
				settings.remove('shipping_companies');
				settings.remove('password');
				settings.remove('order');
				Frame.getFrameById('root-frame').navigate({moduleName: "views/login/login-page", clearHistory: true});
			}
		});
	}

	public action_back_tab(){
		this.set('visibility_processing_tab', 'collapsed');
		this.set('visibility_tab', 'visible');
		this.set('visibility_products', 'collapsed');
		this.set('visibility_scanning', 'collapsed');		
	}

	public action_search(){
		this.set('visibility_processing_tab', 'collapsed');
		this.set('visibility_tab', 'collapsed');
		this.set('visibility_products', 'visible');
		this.set('visibility_scanning', 'collapsed');
	}

	public action_refresh(){
		this.set('visibility_processing_tab', 'visible');
		this.set('visibility_tab', 'collapsed');
		this.set('visibility_products', 'collapsed');
		this.set('visibility_scanning', 'collapsed');
		this.updateProducts();
	}

	public actionScanFocus(){
		alert('Leitor de código de Barras Focado.');
		this.scanFocus();
	}

	public updateProducts(){
		this.set('visibility_processing_tab', 'visible');
		this.set('visibility_tab', 'collapsed');
		this.set('processing_message_tab', 'Sincronizando Produtos');
		axios.get(settings.getString("api")+'/products', {auth:{username:settings.getString("username"), password: settings.getString("password")}}).then(
			(result) => {
				settings.setString('products', JSON.stringify(result.data));
				this.updateShippingCompanies();
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
				}
			});
	}

	public updateShippingCompanies(){
		this.set('processing_message_tab', 'Sincronizando Transportadoras');
		axios.get(settings.getString("api")+'/shipping_companies/load', {auth:{username:settings.getString("username"), password: settings.getString("password")}}).then(
			(result) => {
				settings.setString('shipping_companies', JSON.stringify(result.data));
				this.updateClients();
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
				}
			});
	}

	public updateClients(){
		this.set('processing_message_tab', 'Sincronizando Clientes');
		axios.get(settings.getString("api")+'/clients/load', {auth:{username:settings.getString("username"), password: settings.getString("password")}}).then(
			(result) => {
				settings.setString('clients', JSON.stringify(result.data));
				this.updateOrder();
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
				}
			});
	}

	public updateOrder(){
		var order = JSON.parse(settings.getString('order', null));

		if(order){



			this.set('processing_message_tab', 'Sincronizando Pedido');
			axios.get(settings.getString("api")+'/orders/'+order.id, {auth:{username:settings.getString("username"), password: settings.getString("password")}}).then(
				(result) => {
					settings.setString('order', JSON.stringify(result.data));
					this.refreshOrderPage();  
					this.refreshBagPage(); 

					this.set('visibility_processing_tab', 'collapsed');
					this.set('visibility_tab', 'visible');
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
					}
				});
		} else {
			this.set('visibility_processing_tab', 'collapsed');
			this.set('visibility_tab', 'visible');
		}
	}


}
