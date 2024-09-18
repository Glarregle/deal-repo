import Route from '@ember/routing/route';

export default class OrganizationRoute extends Route {
	model(params) {
		return { name: params.name };
	}

	afterModel(organization) {
		console.log('will fetch with', organization.name);
		// fetch repos
	}
}
