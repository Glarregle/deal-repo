import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';

export default class RepositoriesComponent extends Component {
  @service search;

  @tracked isError = false;
  @tracked isLoading = false;
  @tracked repositories = [];

  get fns() {
    return {
      search: this.searchRepos,
      loadMore: this.loadMore,
    };
  }

  get data() {
    return {
      isError: this.isError,
      isLoading: this.isLoading,
      repositories: this.results,
      hasLoadMore: this.hasLoadMore,
      hasRepositories: this.hasRepositories,
    };
  }

  get hasLoadMore() {
    return false;
  }

  get hasRepositories() {
    return this.results.length > 0;
  }

  get results() {
    return this.repositories;
  }

  @action
  async searchRepos() {
    this.isLoading = true;
    this.isError = false;

    const { name } = this.args.params;
    const query = { name };
    try {
      this.repositories = await this.search.fetchRepositories(query);
    } catch {
      this.isError = true;
    } finally {
      this.isLoading = false;
    }
  }

  @action
  loadMore() {}
}
