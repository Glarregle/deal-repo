import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class IndexController extends Controller {
	@tracked token = '';
	@tracked orgName = '';

	@action
	async fetchOrganization() {
		const { orgName, token } = this;
		if (orgName && token) {
			const url = `https://api.github.com/orgs/${this.orgName}`;
			const response = await fetch(url, {
				headers: {
					Authorization: `token ${this.token}`,
				},
			});
			return response.json();
		}
	}

	@action handleTokenInput(event) {
		this.token = event.target.value;
	}

	@action handleNameInput(event) {
		this.orgName = event.target.value;
	}
}
