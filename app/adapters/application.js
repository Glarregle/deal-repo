import JSONAPIAdapter from '@ember-data/adapter/json-api';

export default class ApplicationAdapter extends JSONAPIAdapter {
  namespace = 'https://api.github.com';
  headers = {};

  // Set the token in the headers
  setToken(token) {
    this.headers['Authorization'] = `token ${token}`;
  }

  async getRepositories(queryString) {
    const q = encodeURIComponent(queryString)
    const url = `${this.namespace}/search/repositories?q=${q}&sort=interactions&per_page=30`;
    const response = await fetch(url, {
      method: 'GET',
      headers: this.headers,
    });
    return response.json();
  }

  async getBranches({ orgName, repo }) {
    const url = `${this.namespace}/repos/${orgName}/${repo}/branches`;
    const response = await fetch(url, {
      method: 'GET',
      headers: this.headers,
    });
    return response.json();
  }
}
