import { EventData } from "tns-core-modules/data/observable";
import { Page } from "tns-core-modules/ui/page";
import { ProductVariationRulesModel } from "./product-variations-rules-view-model";



export function onShownModally(args) {
	const page = <Page>args.object;
	page.bindingContext = new ProductVariationRulesModel(args.context);
}