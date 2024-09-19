import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class OrganizationRoute extends Route {
  @service store;

  queryParams = {
    name: {
      refreshModel: true,
    },
  };

  async model(params) {
    const { name } = params;
    const response = await this._fetchRepositories(name);
    return this._handleResponse(response);
  }

  _fetchRepositories(orgName) {
    console.log('will fetch', ...arguments);
    let adapter = this.store.adapterFor('application');

    // get token from service
    return adapter.getRepositories(orgName);
  }

  _handleResponse(response) {
    const { store } = this;
    const serializer = this.store.serializerFor('application');
    const jsonAPIDocument = serializer.normalizeResponse(
      store,
      store.modelFor('repository'),
      response,
      null,
      'findAll',
    );
    return store.push(jsonAPIDocument);
  }
}
