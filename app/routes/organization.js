import Route from '@ember/routing/route';

export default class OrganizationRoute extends Route {
  queryParams = {
    name: {
      refreshModel: true,
    },
  };
}
