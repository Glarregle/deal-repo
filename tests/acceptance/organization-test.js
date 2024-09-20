import { module, test } from 'qunit';
import { visit, currentURL, fillIn, click, waitFor } from '@ember/test-helpers';
import { setupApplicationTest } from 'tiny-repos/tests/helpers';
import { clickTrigger } from 'ember-basic-dropdown/test-support/helpers';

async function goToOrganization() {
  // Visit the index page
  await visit('/');

  // Fill in the organization name and token
  await fillIn('[data-test-org-input]', 'valinor');
  await fillIn('[data-test-token-input]', 'valid-token');

  // Submit the form
  await click('[data-test-submit]');
}

module('Acceptance | organization', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    // Mock `fetch` for each test
    this.originalFetch = window.fetch;

    window.fetch = (url, options) => {
      console.log('url', url);

      // Mock organization response
      if (url === 'https://api.github.com/orgs/valinor') {
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              login: 'valinor',
              id: 1,
            }),
        });
      }

      // Mock respos response
      if (url.includes('/search/repositories')) {
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              items: [
                {
                  id: 1,
                  name: 'repo-1',
                  html_url: 'https://github.com/valinor/repo-1',
                  language: 'JavaScript',
                  private: false,
                },
                {
                  id: 2,
                  name: 'repo-2',
                  html_url: 'https://github.com/valinor/repo-2',
                  language: 'Python',
                  private: true,
                },
              ],
            }),
        });
      }

      // Mock branches response
      if (url.includes('/branches')) {
        return Promise.resolve({
          json: () =>
            Promise.resolve([
              {
                id: 1,
                name: 'main',
              },
              {
                id: 2,
                name: 'develop',
              },
              {
                id: 3,
                name: 'feature',
              },
            ]),
        });
      }

      return this.originalFetch(url, options);
    };
  });

  hooks.afterEach(function () {
    // Restore original `fetch` after each test
    window.fetch = this.originalFetch;
  });

  test('it searches for an organization and transitions to organization route', async function (assert) {
    await goToOrganization();
    // Assert that the page transitions to the repositories page
    assert.equal(
      currentURL(),
      '/organization?name=valinor',
      'Transitioned to organization route',
    );
  });

  test('it lists repositories in organization page', async function (assert) {
    await goToOrganization();

    // assert repos are present
    assert
      .dom('[data-test-repository]')
      .exists({ count: 2 }, 'Two repositories are rendered');
    assert
      .dom('[data-test-repo-name]')
      .hasText('repo-1', 'Repository name is rendered');
  });

  test('it can list repository branches at opening dropdown', async function (assert) {
    await goToOrganization();

    // assert repos are present
    assert
      .dom('[data-test-repository]')
      .exists({ count: 2 }, 'Two repositories are rendered');

    await waitFor('[data-test-branches-qty]');
    assert
      .dom('[data-test-branches-qty]')
      .hasText('3', 'Branches qty is shown');

    await waitFor('[data-test-branches-dropdown]');
    // dropdown is present
    assert
      .dom('[data-test-branches-dropdown]')
      .exists(
        { count: 2 },
        'A branch dropdown is shown for each repository with branches',
      );

    await clickTrigger('[data-test-branches-dropdown]');
    assert
      .dom('[data-test-branch-item]')
      .exists(
        { count: 3 },
        'Three branch items are rendered after opening dropdown',
      );
    assert
      .dom('[data-test-branch-item]')
      .hasText('main', 'Branch item shows correct name');
  });

  test('it can go back to index route', async function (assert) {
    await goToOrganization();

    // assert repos are present
    assert
      .dom('[data-test-repository]')
      .exists({ count: 2 }, 'Two repositories are rendered');

    await click('[data-test-go-back]');
    assert.equal(currentURL(), '/', 'Transitioned back to index route');
  });
});
