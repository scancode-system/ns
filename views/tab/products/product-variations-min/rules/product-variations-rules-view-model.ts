import { Observable } from "tns-core-modules/data/observable";
import { ObservableArray, ChangedData } from "tns-core-modules/data/observable-array";

export class ProductVariationRulesModel extends Observable {

	public variation_mins;
	public groups;
	public rules;
	public final;
	public mySecondItems;

	constructor(variation_mins) {
		super();

		let secondColorsArray = new ObservableArray([{"title": "red"}, {"title": "red"}, {"title": "red"}]);
		let secondColorsArray2 = [
		{"id": "1",
		"data": [{'value': 'P', 'min_qty': 2},{'value': 'MM', 'min_qty': 4},{'value': 'Vermelho', 'min_qty': 5}]}, 
		{"id": "2",
		"data": [{'value': 'P', 'min_qty': 2},{'value': 'MM', 'min_qty': 4},{'value': 'G', 'min_qty': 5}]}
		];

		let final = [];
		variation_mins.forEach(variation_min => {
			
			console.log('====================');
			console.log(final);

			let index = final.findIndex(finalGroup => {
				return finalGroup.group == variation_min.group;
			});

			console.log(index);

			if(index == -1){
				final.push({'id': (final.length+1), 'group': variation_min.group, 'data': [{'value': variation_min.value, 'min_qty': variation_min.min_qty}]});
			} else {
				final[index].data.push({'value': variation_min.value, 'min_qty': variation_min.min_qty});
			}

		});

		console.log(final);
		//this.mySecondItems = secondColorsArray;
//		this.mySecondItems = secondColorsArray2;
		this.mySecondItems = final;

/*		let myItems = new ObservableArray({title: "Core Concepts"}, {title: "User Interface"}, {title: "Plugins"}, {title: "Cookbook"}, {title: "Tutorials"});
		this.final = myItems;

/*		this.final = [
			{'id': 1,
			'data': [
				{'value': 'PP', 'min_qty': 3},
				{'value': 'Vermelho', 'min_qty': 2}
			]},
			{'id': 2,
			'data': [
				{'value': 'M', 'min_qty': 5}
			]}
			]; */
/*





		let groups;
		let rules = {};

		let final = [];
		//console.log(variation_mins.variation_mins);

		variation_mins.forEach(variation_min => {
			rules[variation_min.group] = [];
		});

		this.groups = Object.keys(rules)

		variation_mins.forEach(variation_min => {
			rules[variation_min.group].push({'value': variation_min.value, 'min_qty' :variation_min.min_qty});
		});		


		let index = 0;


		rules.forEach(rule => {
			let item = {'id': index, 'data' : []};

			rule.forEach(rule => {
				item.data.push = rule;
			});

			final.push(item);

			index++;
		});
		
		console.log(final);





		//console.log(Object.keys(groups));
		//console.log('opa');
//		console.log(variation_mins);
*/

}

public onShownModally(args) {


}


}
