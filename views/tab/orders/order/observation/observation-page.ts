import { EventData } from "tns-core-modules/data/observable";
import { Page } from "tns-core-modules/ui/page";
import { ObservationModel } from "./observation-view-model";

export function navigatingTo(args: EventData) {
    const page = <Page>args.object;
    page.bindingContext = new ObservationModel();
}
