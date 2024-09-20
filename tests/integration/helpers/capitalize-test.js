import { module, test } from 'qunit';
import { setupRenderingTest } from 'tiny-repos/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Helper | capitalize', function (hooks) {
  setupRenderingTest(hooks);

  test('it capitalizes the first letter of a string', async function (assert) {
    this.set('inputValue', 'tiny repos');
    await render(hbs`{{capitalize this.inputValue}}`);
    assert.dom().hasText('Tiny repos', 'The first letter is capitalized');
  });

  test('it handles empty strings', async function (assert) {
    this.set('inputValue', '');
    await render(hbs`{{capitalize this.inputValue}}`);
    assert.dom().hasText('', 'An empty string returns an empty string');
  });
});
