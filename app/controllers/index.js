import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class IndexController extends Controller {
  @service router;
  @service search;

  @tracked token = '';
  @tracked orgName = '';
  @tracked orgMissing = false;
  @tracked badKey = false;
  @tracked error = false;
  @tracked isLoading = false;

  @action
  async handleSubmit(event) {
    event.preventDefault();

    this.isLoading = true; // Set loading state

    this._resetErrors();

    try {
      const res = await this._fetchOrganization();
      if (res && res.login) {
        this.router.transitionTo('organization', {
          queryParams: { name: res.login },
        });
      } else {
        throw res;
      }
    } catch (error) {
      if (error?.status === '404') {
        this.orgMissing = true;
      } else if (error?.status === '401') {
        this.badKey = true;
      } else {
        this.error = true;
      }
    } finally {
      this.isLoading = false;
    }
  }

  @action
  async _fetchOrganization() {
    const { orgName, token } = this;

    // save token in storage
    this.search.saveToken(token);

    if (orgName && token) {
      const url = `https://api.github.com/orgs/${orgName}`;
      const response = await fetch(url, {
        headers: {
          Authorization: `token ${token}`,
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
