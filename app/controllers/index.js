import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class IndexController extends Controller {
  @service router;

	@tracked orgName = '';
  @tracked orgName = '';
  @tracked orgMissing = false;
  @tracked badKey = false;
  @tracked error = false;

  @action
  async handleSubmit(event) {
    event.preventDefault();

    // try catch
    this._resetErrors();
    const res = await this._fetchOrganization();

    if (res.id) {
      this.router.transitionTo('organization', {
        queryParams: { name: res.login },
      });
    } else if (res.status === '404') {
      this.orgMissing = true;
    } else if (res.status === '401') {
      this.badKey = true;
    } else {
      this.error = true;
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
    this.badKey = false;
    this.error = false;
  }

  @action handleTokenInput(event) {
    this.token = event.target.value;
  }

  @action handleNameInput(event) {
    this.orgName = event.target.value;
  }
}
