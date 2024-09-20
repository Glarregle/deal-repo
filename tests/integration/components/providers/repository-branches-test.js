import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, waitFor, settled } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { later } from '@ember/runloop';
import Service from '@ember/service';

module('Integration | Component | repository-branches', function (hooks) {
  setupRenderingTest(hooks);

  class MockSearchService extends Service {
    // Mock branches fetch
    fetchBranches(query) {
      return new Promise((resolve, reject) => {
        later(() => {
          if (query === 'error') {
            reject(new Error('Error fetching repositories'));
          }
          resolve([
            { name: 'main' },
            { name: 'develop' },
            { name: 'feature/tiny-feature' },
          ]);
        }, 500);
      });
    }
  }

  hooks.beforeEach(function () {
    this.owner.register('service:search', MockSearchService);
  });

  test('it can trigger fetch branches and retrieve results', async function (assert) {
    await render(hbs`
      <RepositoryBranches as |branches|>
        <button
          type="button"
          {{on "click" (fn branches.fns.search "test")}}
          data-test-search-btn
        >
          Search Branches
        </button>
        
        {{#if branches.data.hasBranches}}
          <ul data-test-branches-list>
            {{#each branches.data.results as |branch|}}
              <li data-test-branch-item>{{branch.name}}</li>
            {{/each}}
          </ul>
        {{/if}}

      </RepositoryBranches>
    `);

    assert
      .dom('[data-test-branches-list]')
      .doesNotExist('No branches are rendered initially');

    await click('[data-test-search-btn]');

    // Verify that branches are displayed
    assert
      .dom('[data-test-branch-item]')
      .exists({ count: 3 }, 'Three branches are rendered');
    assert
      .dom('[data-test-branch-item]')
      .includesText('main', 'Main branch is displayed');
  });

  test('it can handle loading state', async function (assert) {
    await render(hbs`
      <RepositoryBranches as |branches|>
        <button
          type="button"
          {{on "click" (fn branches.fns.search "test")}}
          data-test-search-btn
        >
          Search Branches
        </button>

        {{#if branches.data.isLoading}}
          <p data-test-loading>Loading...</p>
        {{/if}}

        {{#if branches.data.hasBranches}}
          <ul data-test-branches-list>
            {{#each branches.data.results as |branch|}}
              <li data-test-branch-item>{{branch.name}}</li>
            {{/each}}
          </ul>
        {{/if}}
      </RepositoryBranches>
    `);

    assert
      .dom('[data-test-loading]')
      .doesNotExist('No loading message is rendered initially');
    assert
      .dom('[data-test-branches-list]')
      .doesNotExist('No branches are rendered initially');

    click('[data-test-search-btn]');

    await waitFor('[data-test-loading]');

    // Check loading state
    assert
      .dom('[data-test-loading]')
      .exists('Loading message is shown while fetching branches');

    await settled();

    // Verify that branches are displayed
    assert
      .dom('[data-test-branch-item]')
      .exists({ count: 3 }, 'Three branches are rendered once settled');
  });

  test('it can handle error state', async function (assert) {
    await render(hbs`
      <RepositoryBranches as |branches|>
        <button
          type="button"
          {{on "click" (fn branches.fns.search "error")}}
          data-test-search-btn
        >
          Search Branches
        </button>

        {{#if branches.data.isLoading}}
          <p data-test-loading>Loading...</p>
        {{/if}}

        {{#if branches.data.isError}}
          <p data-test-error>Error fetching branches.</p>
        {{/if}}

        {{#if branches.data.hasBranches}}
          <ul data-test-branches-list>
            {{#each branches.data.results as |branch|}}
              <li data-test-branch-item>{{branch.name}}</li>
            {{/each}}
          </ul>
        {{/if}}
      </RepositoryBranches>
    `);

    assert
      .dom('[data-test-loading]')
      .doesNotExist('No loading message is rendered initially');
    assert
      .dom('[data-test-error]')
      .doesNotExist('No error message is rendered initially');
    assert
      .dom('[data-test-branches-list]')
      .doesNotExist('No branches are rendered initially');

    click('[data-test-search-btn]');
    await waitFor('[data-test-loading]');

    // Check loading state
    assert
      .dom('[data-test-loading]')
      .exists('Loading message is shown while fetching branches');

    await settled();

    assert
      .dom('[data-test-error]')
      .exists('Error message is displayed after failing');

    // Verify that no branches are displayed after an error
    assert
      .dom('[data-test-branch-item]')
      .doesNotExist('No branches are rendered after error');
  });
});
