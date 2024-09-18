import Controller from '@ember/controller';

export default class OrganizationController extends Controller {
  queryParams = ['name'];

  name = '';
}
