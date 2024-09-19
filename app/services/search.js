import Service from '@ember/service';
import { service } from '@ember/service';

export default class SearchService extends Service {
  @service store;

  async fetchRepositories(params) {
  	// params can be q with sort
  	// also filters and pagination
    console.log('will fetch', ...arguments);
    let adapter = this.store.adapterFor('application');

    // get token from service

    const query = this._buildGithubQuery(params);
    const response = await adapter.getRepositories(query);
    return this._handleResponse(response, 'repository');
  }

  async fetchBranches({ orgName, repo }) {
    let adapter = this.store.adapterFor('application');

    // get token from service

    const response = await adapter.getBranches({ orgName, repo });
    return this._handleResponse(response, 'branch');
  }

  _buildGithubQuery(params) {
  	const { name } = params;
    let query = `org:${name}`;
    // if visibility or language add to query;
    return query;
  }

  _handleResponse(response, modelName) {
    const { store } = this;
    const serializer = store.serializerFor('application');
    const jsonAPIDocument = serializer.normalizeResponse(
      store,
      store.modelFor(modelName),
      response,
      null,
      'findAll',
    );
    return store.push(jsonAPIDocument);
  }
}
