import { EventData } from "tns-core-modules/data/observable";
import { Page } from "tns-core-modules/ui/page";
import { ProductVariationMinModel } from "./product-variations-min-view-model";

export function navigatingTo(args: EventData) {
    const page = <Page>args.object;
    page.bindingContext = new ProductVariationMinModel(page.navigationContext);
}
