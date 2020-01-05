import { EventData } from "tns-core-modules/data/observable";
import { Page } from "tns-core-modules/ui/page";
import { HistoricModel } from "./historic-view-model";

export function navigatingTo(args: EventData) {
    const page = <Page>args.object;
    page.bindingContext = new HistoricModel();
}
