import Model, { attr } from '@ember-data/model';

export default class RepositoryModel extends Model {
  @attr name;
  @attr html_url;
  @attr language;
  @attr private;
}
