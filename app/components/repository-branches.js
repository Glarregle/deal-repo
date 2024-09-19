import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';

export default class RepositoryBranchesComponent extends Component {
  @service search;

  @tracked isLoading = false;
  @tracked results = [];

  get fns() {
    return {
      search: this.searchBranches,
      // loadMore: this.loadMore,
    };
  }

  get data() {
    return {
      isLoading: this.isLoading,
      results: this.results,
      hasBranches: this.hasBranches,
      // hasLoadMore: this.hasLoadMore,
    };
  }

  get hasBranches() {
    return this.results.length > 0;
  }

  get hasLoadMore() {}

  @action
  async searchBranches(query) {
    this.isLoading = true;
    try {
      this.results = await this.search.fetchBranches(query);
    } finally {
      this.isLoading = false;
    }
  }

  @action
  loadMore() {}
}
