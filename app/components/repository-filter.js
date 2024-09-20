import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class RepoFilterComponent extends Component {
  @tracked visibility = 'all';
  @tracked language = 'all';

  get fns() {
    return {
      setVisibility: this.setVisibility,
      setLanguage: this.setLanguage,
      resetVisibility: this.resetVisibilityFilter,
      resetLanguage: this.resetLanguageFilter,
    };
  }

  get data() {
    return {
      filteredRepos: this.filteredRepositories,
      languageOptions: this.languageOptions,
      visibilityOptions: this.visibilityOptions,
      visibility: this.visibility,
      language: this.language,
    };
  }

  get visibilityOptions() {
    return ['all', 'public', 'private'];
  }

  get languageOptions() {
    return this.args.repos?.reduce(
      (arr, repo) => {
        const { language } = repo;
        if (!arr.includes(language)) {
          arr.push(language);
        }
        return arr;
      },
      ['all'],
    );
  }

  get filteredRepositories() {
    let repos = [...this.args.repos];

    if (this._isValue(this.visibility)) {
      repos = repos.filter((r) =>
        this.visibility === 'private' ? r.private : !r.private,
      );
    }

    if (this._isValue(this.language))
      repos = repos.filter((r) => r.language === this.language);

    return repos;
  }

  @action
  setVisibility(value) {
    this.visibility = value;
  }

  @action
  setLanguage(value) {
    this.language = value;
  }

  @action
  resetVisibilityFilter() {
    this.visibility = 'all';
  }

  @action
  resetLanguageFilter() {
    this.language = 'all';
  }

  _isValue(value) {
    return value !== 'all';
  }
}
