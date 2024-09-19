import Model, { attr } from '@ember-data/model';

export default class BranchModel extends Model {
  @attr name;
}
