import { Observable } from "tns-core-modules/data/observable";
import * as settings from "tns-core-modules/application-settings";
import axios from "axios";
import { Frame } from "tns-core-modules/ui/frame";
import { BarcodeScanner } from "nativescript-barcodescanner";
import { TabView } from "tns-core-modules/ui/tab-view";
import * as dialogs from "tns-core-modules/ui/dialogs";


export class BagModel extends Observable {

	public visibility_processing;
	public visibility_page;
	public processing_message;
	public url;

	public items: Array<object>;


	constructor() {
		super();
		this.set('url', settings.getString('url')+'/');
		this.visibility_processing = 'collapsed';
		this.visibility_page = 'visible';
	}

	public loaded(args = null) {
		var order = JSON.parse(settings.getString('order', null));
		if(order){
			order.items.sort(function(item1, item2){
				if(item1.item_product.description > item2.item_product.description){
					return 1;
				}
				if(item1.item_product.description < item2.item_product.description){
					return -1;
				}
				return 0;
			}); 
			this.set('items', order.items);

		} else {
			this.set('items', null);
		}
	}

	public onItemTapItem(args){
		dialogs.action("", "Cancelar", ["Remover Item", "Editar Item"]).then(result => {
			if(result == "Remover Item"){
				this.remove(args.view.bindingContext.id);
			}else if(result == "Editar Item"){
				this.update(args.view.bindingContext);
			}
		});
	}

	public update(item){

		var products = JSON.parse(settings.getString('products', '[]'));

		let product = products.filter(function(product){
			return (product.id == item.product_id);
		})[0];

		//if(product.variation_mins){
		//	if(product.variation_mins.length > 0){
		//		Frame.getFrameById('products-frame').navigate({moduleName: "views/tab/products/product-variations-min/product-variations-min-page", context: product.id, backstackVisible: false});
		//	} else {
		//		Frame.getFrameById('products-frame').navigate({moduleName: "views/tab/products/product-compact/product-compact-page", context: product.id, backstackVisible: false});	
		//	}
		//}else {
			Frame.getFrameById('products-frame').navigate({moduleName: "views/tab/products/product-compact/product-compact-page", context: product.id, backstackVisible: false});	
		//}

		var tab_view = <TabView>Frame.getFrameById('root-frame').getViewById('tab-view'); 
		tab_view.selectedIndex = 2;
	}

	public remove(id){
		this.set('visibility_processing', 'visible');
		this.set('visibility_page', 'collapsed');
		this.set('processing_message', 'Removendo Item');
		axios.delete(settings.getString("api")+'/items/'+id, {auth:{username:settings.getString("username"), password: settings.getString("password")}}).then(
			(result) => {
				settings.setString('order', JSON.stringify(result.data));
				this.loaded();
				//this.set('items', result.data.items);
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
				} else if(error.response.status == 403){
					alert(error.response.data);					
				} else {
					console.log(error.response);
					alert(error.response.data.message);
				}
				this.set('visibility_processing', 'collapsed');
				this.set('visibility_page', 'visible');
			});
		
	}

	public camera(args){
		let barcodescanner = new BarcodeScanner();

		barcodescanner.scan({
			formats: "QR_CODE, EAN_13,CODE_128",
			showFlipCameraButton: true,
			preferFrontCamera: false,
			showTorchButton: true,
			beepOnScan: true,
			torchOn: false,
			resultDisplayDuration: 0,
			openSettingsIfPermissionWasPreviouslyDenied: true
		}).then((result) => {
			var that = this;
			setTimeout(function(){ that.search(result.text); }, 100);
		}, (errorMessage) => {
			alert('Erro scanning');
		});
	}

	public search(search){
		//console.log('Opa');
		//console.log(search);
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

			//if(product.variation_mins.length > 0){
			//	Frame.getFrameById('products-frame').navigate({moduleName: "views/tab/products/product-variations-min/product-variations-min-page", context: product.id, backstackVisible: false});
			//} else {
				Frame.getFrameById('products-frame').navigate({moduleName: "views/tab/products/product-compact/product-compact-page", context: product.id, backstackVisible: false});	
			//}


			//Frame.getFrameById('products-frame').navigate({moduleName: "views/tab/products/product/product-page", context: product.id,  backstackVisible: false});
			var tab_view = <TabView>Frame.getFrameById('root-frame').getViewById('tab-view'); 
			tab_view.selectedIndex = 2;

		} else {
			alert('Produto não encontrado, sincronize os dados clicando no botão superior direito, na barra de títulos.');
		}
	}		


}
