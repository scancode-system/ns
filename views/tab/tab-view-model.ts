import { Observable, PropertyChangeData } from "tns-core-modules/data/observable";
import axios from "axios";
import * as settings from "tns-core-modules/application-settings";
import { Frame } from "tns-core-modules/ui/frame";
import { TabView } from "tns-core-modules/ui/tab-view";
import {TextView} from "tns-core-modules/ui/text-view";


export class TabModel extends Observable {

	public search;
	public scan;

	public visibility_processing_tab;
	public visibility_tab;
	public visibility_products;
	public processing_message_tab;

	constructor() {
		super();
		this.visibility_processing_tab = 'collapsed';
		this.visibility_tab = 'visible';
		this.visibility_products = 'collapsed';

		this.on(Observable.propertyChangeEvent, (propertyChangeData: PropertyChangeData) => {
			if (propertyChangeData.propertyName === "search") {
				this.filter();
			}
		}, this);

		this.on(Observable.propertyChangeEvent, (propertyChangeData: PropertyChangeData) => {
			if (propertyChangeData.propertyName === "scan") {
				this.changeColetor();
			}
		}, this);
	}

	public loaded(args){
		var thisModel = this;
		setTimeout(function(){
			thisModel.focusColetor();
		}, 50);
	}

	/*public scan(){
		alert('tentando dar scan');
		this.set('search', '');
	}*/


	public changeColetor(){
		var txt = <TextView>Frame.getFrameById('root-frame').getViewById('scan');
		if((this.scan.match(/\n/g)||[]).length == 1){
			txt.dismissSoftInput();

			var search = txt.text;
			txt.text = '';
			search = search.replace(/(\r\n\t|\n|\r\t)/gm,"");
			console.log(search);
			alert(search);
			//this.searchProduto(search);
		}
	}

	/*public focusColetor(){
		console.log(Frame.getFrameById('root-frame'));
		//var search_bar = <SearchBar> Frame.getFrameById('root-frame').getViewById('search_bar');
		//console.log(search_bar); 
		//search_bar.dismissSoftInput();
		//console.log(search_bar);
        //var txt = <TextView>this.page.getViewById('scan');
        setTimeout(function(){ 
        	var search_bar = <SearchBar> Frame.getFrameById('root-frame').getViewById('search_bar');
        	console.log(search_bar);
        	//search_bar.focus();
        	search_bar.dismissSoftInput();
            //search_bar.focus();
            //search_bar.dismissSoftInput();
        }, 200);
    }*/

    public focusColetor(){
    		var txt = <TextView>Frame.getFrameById('root-frame').getViewById('scan'); 
    		if(txt){
    			txt.focus();
    			txt.dismissSoftInput();
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
    	this.set('visibility_processing_tab', 'visibl');
    	this.set('visibility_tab', 'collapsed');
    	this.set('visibility_products', 'collapsed');
    	this.updateProducts();
    }

    public updateProducts(){
    	this.set('visibility_processing_tab', 'visible');
    	this.set('visibility_tab', 'collapsed');
    	this.set('processing_message_tab', 'Atualizando Produtos');
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
    	this.set('processing_message_tab', 'Atualizando Transportadoras');
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
    	this.set('processing_message_tab', 'Atualizando Clientes');
    	axios.get(settings.getString("api")+'/clients/load', {auth:{username:settings.getString("username"), password: settings.getString("password")}}).then(
    		(result) => {
    			settings.setString('clients', JSON.stringify(result.data));

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
    }


}
