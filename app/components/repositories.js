import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';

export default class RepositoriesComponent extends Component {
  @service search;

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
      isLoading: this.isLoading,
      repositories: this.results,
      hasLoadMore: this.hasLoadMore,
    };
  }

  get hasLoadMore() {
    return false;
  }

  get results() {
    return this.repositories;
  }

  @action
  async searchRepos() {
    this.isLoading = true;
    const { name } = this.args.params;
    const query = { name };
    try {
      this.repositories = await this.search.fetchRepositories(query);
    } finally {
      this.isLoading = false;
    }
  }

  @action
  loadMore() {}
}
