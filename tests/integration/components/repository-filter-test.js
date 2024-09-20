import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, settled } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | repository-filter', function (hooks) {
  setupRenderingTest(hooks);

  const repos = [
    { id: 1, name: 'Repo 1', private: false, language: 'JavaScript' },
    { id: 2, name: 'Repo 2', private: true, language: 'Ruby' },
    { id: 3, name: 'Repo 3', private: false, language: 'Python' },
  ];

  test('it renders and filters repositories by visibility', async function (assert) {
    this.set('repos', repos);

    await render(hbs`
      <RepositoryFilter @repos={{this.repos}} as |filter|>
        <button data-test-visibility-filter="all" {{on "click" (fn filter.fns.setVisibility "all")}}>All</button>
        <button data-test-visibility-filter="private" {{on "click" (fn filter.fns.setVisibility "private")}}>Private</button>
              
        <ul data-test-repo-list>
          {{#each filter.data.filteredRepos as |repo|}}
            <li data-test-repo-item>{{repo.name}} - {{repo.language}} - {{if repo.private "Private" "Public"}}</li>
          {{/each}}
        </ul>
      </RepositoryFilter>
    `);

    // Ensure all repos are shown initially
    assert
      .dom('[data-test-repo-item]')
      .exists({ count: 3 }, 'All repositories are displayed initially');

    // Select the "private" visibility filter
    await click('[data-test-visibility-filter="private"]');
    await settled();

    // Ensure only private repos are shown
    assert
      .dom('[data-test-repo-item]')
      .exists({ count: 1 }, 'Only private repositories are displayed');
    assert
      .dom('[data-test-repo-item]')
      .includesText('Repo 2', 'Repo 2 is displayed as a private repo');

    // Select "all" visibility again
    await click('[data-test-visibility-filter="all"]');
    await settled();

    // Ensure all repos are shown again
    assert
      .dom('[data-test-repo-item]')
      .exists(
        { count: 3 },
        'All repositories are displayed after resetting filter',
      );
  });

  test('it filters repositories by language', async function (assert) {
    this.set('repos', repos);

    await render(hbs`
      <RepositoryFilter @repos={{this.repos}} as |filter|>
        <button data-test-language-filter="all" {{on "click" (fn filter.fns.setLanguage "all")}}>All</button>
        <button data-test-language-filter="JavaScript" {{on "click" (fn filter.fns.setLanguage "JavaScript")}}>JavaScript</button>
        <button data-test-language-filter="Ruby" {{on "click" (fn filter.fns.setLanguage "Ruby")}}>Ruby</button>
        
        <ul data-test-repo-list>
          {{#each filter.data.filteredRepos as |repo|}}
            <li data-test-repo-item>{{repo.name}} - {{repo.language}} - {{if repo.private "Private" "Public"}}</li>
          {{/each}}
        </ul>
      </RepositoryFilter>
    `);

    // Ensure all repos are shown initially
    assert
      .dom('[data-test-repo-item]')
      .exists({ count: 3 }, 'All repositories are displayed initially');

    // Select "JavaScript" language filter
    await click('[data-test-language-filter="JavaScript"]');
    await settled();

    // Ensure only JavaScript repos are shown
    assert
      .dom('[data-test-repo-item]')
      .exists({ count: 1 }, 'Only JavaScript repositories are displayed');
    assert
      .dom('[data-test-repo-item]')
      .includesText('Repo 1', 'Repo 1 is displayed as a JavaScript repo');

    // Select "all" language filter again
    await click('[data-test-language-filter="all"]');
    await settled();

    // Ensure all repos are shown again
    assert
      .dom('[data-test-repo-item]')
      .exists(
        { count: 3 },
        'All repositories are displayed after resetting filter',
      );
  });
});
