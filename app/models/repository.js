import Model, { attr } from '@ember-data/model';

export default class RepositoryModel extends Model {
  @attr name;
  @attr htmlUrl;
  @attr language;
  @attr private;
}
