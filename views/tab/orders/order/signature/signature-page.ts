import { EventData } from "tns-core-modules/data/observable";
import { Page } from "tns-core-modules/ui/page";
import { SignatureModel } from "./signature-view-model";
import * as orientation from "nativescript-orientation";


export function navigatingTo(args: EventData) {
	const page = <Page>args.object;
	page.bindingContext = new SignatureModel();

	orientation.setOrientation("landscape");  
	orientation.disableRotation();
}

export function navigatingFrom(args: EventData) {
	 orientation.enableRotation();
}


