import { module, test } from 'qunit';
import { setupRenderingTest } from 'tiny-repos/tests/helpers';
import Repositories from 'tiny-repos/components/repositories';
import { render, click, settled, waitFor } from '@ember/test-helpers';
import Service from '@ember/service';
import { later } from '@ember/runloop';
import { on } from '@ember/modifier';

module('Integration | Component | repositories', function (hooks) {
  setupRenderingTest(hooks);

  // Mock Search service
  class MockSearchService extends Service {
    // Mock repos fetch
    async fetchRepositories(query) {
      return new Promise((resolve, reject) => {
        later(() => {
          if (query.name === 'error') {
            reject(new Error('Error fetching repositories'));
          } else {
            resolve([
              { id: 1, name: 'Repo 1' },
              { id: 2, name: 'Repo 2' },
            ]);
          }
        }, 500);
      });
    }
  }

  hooks.beforeEach(function () {
    this.owner.register('service:search', MockSearchService);
  });

  test('it can trigger fetch repositories and retrieve results', async function (assert) {
    const params = { name: 'rails' };

    await render(
      <template>
        <Repositories @params={{params}} as |repos|>
          <div data-test-repositories>
            {{#if repos.data.hasRepositories}}
              <ul data-test-repo-list>
                {{#each repos.data.repositories as |repo|}}
                  <li data-test-repo-item>{{repo.name}}</li>
                {{/each}}
              </ul>
            {{/if}}
            <button data-test-search-button type="button" {{on "click" repos.fns.search}}>Search</button>
          </div>
        </Repositories>
      </template>);

    // Trigger the search action
    await click('[data-test-search-button]');

    // Verify that repositories are displayed
    assert
      .dom('[data-test-repo-item]')
      .exists({ count: 2 }, 'Two repositories are rendered');
    assert
      .dom('[data-test-repo-item]')
      .includesText('Repo 1', 'First repository is displayed');
  });

  test('it can handle loading state', async function (assert) {
    const params = { name: 'test' };


    await render(
      <template>
        <Repositories @params={{params}} as |repos|>
          <div data-test-repositories>
            <button data-test-search-button type="button" {{on "click" repos.fns.search}}>Search</button>
            
            {{#if repos.data.hasRepositories}}
              <ul data-test-repo-list>
                {{#each repos.data.repositories as |repo|}}
                  <li data-test-repo-item>{{repo.name}}</li>
                {{/each}}
              </ul>
            {{/if}}

            {{#if repos.data.isLoading}}
              <p data-test-loading>Loading...</p>
            {{/if}}
            {{#if repos.data.isError}}
              <p data-test-error>Error fetching repositories.</p>
            {{/if}}

          </div>
        </Repositories>
      </template>
    );


    // Initially, no loading or error message will be shown
    assert
      .dom('[data-test-loading]')
      .doesNotExist('No loading state shown yet');

    // Trigger the search action
    click('[data-test-search-button]');

    await waitFor('[data-test-loading]');

    assert
      .dom('[data-test-loading]')
      .exists('Loading message is shown while promise is pending');
    // Make sure there are no pending runloops
    await settled();

    // Verify that the repositories are displayed
    assert
      .dom('[data-test-repo-item]')
      .exists({ count: 2 }, 'Two repositories are rendered');
    assert
      .dom('[data-test-repo-item]')
      .includesText('Repo 1', 'First repository is displayed');
  });

  test('it can handle error state', async function (assert) {
    const params = { name: 'error' };

    await render(      
      <template>
        <Repositories @params={{params}} as |repos|>
          <div data-test-repositories>
            {{#if repos.data.isLoading}}
              <p data-test-loading>Loading...</p>
            {{/if}}
            {{#if repos.data.isError}}
              <p data-test-error>Error fetching repositories.</p>
            {{/if}}
             {{#if repos.data.hasRepositories}}
              <ul data-test-repo-list></ul>
            {{/if}}
            <button data-test-search-button type="button" {{on "click" repos.fns.search}}>Search</button>
          </div>
        </Repositories>      
      </template>
    );


    // Initially, no loading or error message will be shown
    assert
      .dom('[data-test-loading]')
      .doesNotExist('No loading state shown yet');
    assert.dom('[data-test-error]').doesNotExist('No error shown yet');
    assert.dom('[data-test-repo-list]').doesNotExist('No present repos yet');

    // Trigger the search action
    click('[data-test-search-button]');

    await waitFor('[data-test-loading]');

    assert
      .dom('[data-test-loading]')
      .exists('Loading message is shown while promise is pending');

    // Make sure there are no pending runloops
    await settled();

    assert
      .dom('[data-test-error]')
      .exists('Error message is displayed after failing');
    assert
      .dom('[data-test-repo-item]')
      .doesNotExist('Repo', 'No repositories are rendered');
  });
});
