import { EventData } from "tns-core-modules/data/observable";
import { Page } from "tns-core-modules/ui/page";
import { ClientShowModel } from "./client-show-view-model";

export function navigatingTo(args: EventData) {
    const page = <Page>args.object;
    page.bindingContext = new ClientShowModel(page.navigationContext.id, page.navigationContext.buyer, page.navigationContext.phone, page.navigationContext.email);
}
