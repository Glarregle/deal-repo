import { module, test } from 'qunit';
import { setupTest } from 'tiny-repos/tests/helpers';

module('Unit | Service | search', function (hooks) {
  setupTest(hooks);

  test('it saves and retrieves the GitHub token', function (assert) {
    let service = this.owner.lookup('service:search');
    const token = 'test-token';

    // Test saveToken
    service.saveToken(token);
    assert.equal(
      window.localStorage.getItem('github-token'),
      token,
      'Token is saved in localStorage',
    );

    // Test getToken
    const retrievedToken = service.getToken();
    assert.equal(retrievedToken, token, 'Token is retrieved from localStorage');
  });

  test('it builds a GitHub query correctly', function (assert) {
    let service = this.owner.lookup('service:search');
    const params = { name: 'emberjs' };

    const query = service._buildGithubQuery(params);
    assert.equal(
      query,
      'org:emberjs',
      'Query is built correctly with org name',
    );
  });
});
