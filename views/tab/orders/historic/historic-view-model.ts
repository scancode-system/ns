import { Observable } from "tns-core-modules/data/observable";

export class HistoricModel extends Observable {

	public orders: Array<object>;
	public total: number;

	constructor() {
		super();
		this.orders = [];
	}

	public loaded(args) {
		this.set('orders', [
			{id: 1, order_client: {corporate_name: 'Cila Ltda', cpf_cnpj: '00342349893'}, status_id: 1},
			{id: 1, order_client: {corporate_name: 'Cila Ltda', cpf_cnpj: '00342349893'}, status_id: 2},
			{id: 1, order_client: {corporate_name: 'Cila Ltda', cpf_cnpj: '00342349893'}, status_id: 3},
			{id: 1, order_client: {corporate_name: 'Cila Ltda', cpf_cnpj: '00342349893'}, status_id: 1},
			{id: 1, order_client: {corporate_name: 'Cila Ltda', cpf_cnpj: '00342349893'}, status_id: 1},
			{id: 1, order_client: {corporate_name: 'Cila Ltda', cpf_cnpj: '00342349893'}, status_id: 2},
			{id: 1, order_client: {corporate_name: 'Cila Ltda', cpf_cnpj: '00342349893'}, status_id: 3},
			{id: 1, order_client: {corporate_name: 'Cila Ltda', cpf_cnpj: '00342349893'}, status_id: 1},
			{id: 1, order_client: {corporate_name: 'Cila Ltda', cpf_cnpj: '00342349893'}, status_id: 1},
			{id: 1, order_client: {corporate_name: 'Cila Ltda', cpf_cnpj: '00342349893'}, status_id: 2},
			{id: 1, order_client: {corporate_name: 'Cila Ltda', cpf_cnpj: '00342349893'}, status_id: 3},
			{id: 1, order_client: {corporate_name: 'Cila Ltda', cpf_cnpj: '00342349893'}, status_id: 1},
			{id: 1, order_client: {corporate_name: 'Cila Ltda', cpf_cnpj: '00342349893'}, status_id: 1},
			{id: 1, order_client: {corporate_name: 'Cila Ltda', cpf_cnpj: '00342349893'}, status_id: 2},
			{id: 1, order_client: {corporate_name: 'Cila Ltda', cpf_cnpj: '00342349893'}, status_id: 3},
			{id: 1, order_client: {corporate_name: 'Cila Ltda', cpf_cnpj: '00342349893'}, status_id: 1}
			]);
		this.set('total', 45435);
	}

}
