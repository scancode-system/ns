import { Observable, PropertyChangeData } from "tns-core-modules/data/observable";
import axios from "axios";
import * as settings from "tns-core-modules/application-settings";
import { Frame } from "tns-core-modules/ui/frame";
import { TabView } from "tns-core-modules/ui/tab-view";
import {TextView} from "tns-core-modules/ui/text-view";
import * as dialogs from "tns-core-modules/ui/dialogs";


export class TabModel extends Observable {

	public search;
	public scan;

	public visibility_processing_tab;
	public visibility_tab;
	public visibility_products;
	public processing_message_tab;

	public orders_frame;

	public icon_orders: string;
	public icon_sacola: string;
	public icon_loja: string;

	constructor() {
		super();
		this.visibility_processing_tab = 'collapsed';
		this.visibility_tab = 'visible';
		this.visibility_products = 'collapsed';

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
				this.scannig();
			}
		}, this);

		this.selectedTab(0);
	}

	public loaded(args){

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
		//this.focusColetor();     
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
		}
	}

	public scannig(){
		var txt = <TextView>Frame.getFrameById('root-frame').getViewById('text-view-scan');
		if((this.scan.match(/\n/g)||[]).length == 1){
			txt.dismissSoftInput();
			var search = txt.text;
			txt.text = '';
			search = search.replace(/(\r\n\t|\n|\r\t)/gm,"");
			this.searchProduct(search);
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
			Frame.getFrameById('products-frame').navigate({moduleName: "views/tab/products/product/product-page", context: product.id,  backstackVisible: false});
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
		products = products.slice(-10);
		this.set('products', products);
	}

	public gotoProduct(args){
		this.action_back_tab();
		Frame.getFrameById('products-frame').navigate({moduleName: "views/tab/products/product/product-page", context: args.view.bindingContext.id, backstackVisible: false});
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
				Frame.getFrameById('root-frame').navigate({moduleName: "views/login/login-page", clearHistory: true});
			}
		});
	}

	public action_back_tab(){
		this.set('visibility_processing_tab', 'collapsed');
		this.set('visibility_tab', 'visible');
		this.set('visibility_products', 'collapsed');		
	}

	public action_search(){
		this.set('visibility_processing_tab', 'collapsed');
		this.set('visibility_tab', 'collapsed');
		this.set('visibility_products', 'visible');
	}

	public action_refresh(){
		this.set('visibility_processing_tab', 'visible');
		this.set('visibility_tab', 'collapsed');
		this.set('visibility_products', 'collapsed');
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
