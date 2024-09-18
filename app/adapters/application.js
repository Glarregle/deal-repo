import JSONAPIAdapter from '@ember-data/adapter/json-api';

export default class ApplicationAdapter extends JSONAPIAdapter {
  namespace = 'https://api.github.com';
  headers = {};

  // Set the token in the headers
  setToken(token) {
    this.headers['Authorization'] = `token ${token}`;
  }

  async getRepositories(orgName) {
    const url = `${this.namespace}/orgs/${orgName}/repos`;
    const response = await fetch(url, {
      method: 'GET',
      headers: this.headers,
    });
    return response.json();
  }
}
