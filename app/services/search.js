import Service from '@ember/service';
import { service } from '@ember/service';

const TOKEN_KEY = 'github-token';

export default class SearchService extends Service {
  @service store;

  async fetchRepositories(params) {
    let adapter = this.store.adapterFor('application');
    adapter.setToken(this.getToken());

    const query = this._buildGithubQuery(params);
    const response = await adapter.getRepositories(query);
    return this._handleResponse(response, 'repository');
  }

  async fetchBranches({ orgName, repo }) {
    let adapter = this.store.adapterFor('application');
    adapter.setToken(this.getToken());

    const response = await adapter.getBranches({ orgName, repo });
    return this._handleResponse(response, 'branch');
  }

  saveToken(token) {
    window.localStorage.setItem(TOKEN_KEY, token);
  }

  getToken() {
    return window.localStorage.getItem(TOKEN_KEY);
  }

  _buildGithubQuery(params) {
    // If the application were to send more server-side filters
    // here the query string could be built
    const { name } = params;
    let query = `org:${name}`;
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
