import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class IndexController extends Controller {
	@service router;

	@tracked orgName = '';
	@tracked orgMissing = false;

	@action
	async handleSubmit() {
		this._resetErrors();
		const res = await this._fetchOrganization();
		console.log({ res }, res.status);
		if (res.id) {
			this.router.transitionTo('organization', { name: res.login });
		} else if (res.status === '404') {
			this.orgMissing = true;
		}
	}

	@action
	async _fetchOrganization() {
		const { orgName, token } = this;
		// try catch
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

	@action
	_resetErrors() {
		this.orgMissing = false;
	}

	@action handleTokenInput(event) {
		this.token = event.target.value;
	}

	@action handleNameInput(event) {
		this.orgName = event.target.value;
	}
}
