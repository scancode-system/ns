import { Observable } from "tns-core-modules/data/observable";
import { Frame } from "tns-core-modules/ui/frame";
import * as settings from "tns-core-modules/application-settings";
import axios from "axios";

export class SignatureModel extends Observable {

	public visibility_processing;
	public visibility_page;
	public processing_message;

	constructor() {
		super();
		this.visibility_processing = 'collapsed';
		this.visibility_page = 'visible';
	}

	public loaded(args) {
	}

}
