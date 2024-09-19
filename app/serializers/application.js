import JSONAPISerializer from '@ember-data/serializer/json-api';

export default class ApplicationSerializer extends JSONAPISerializer {
  normalizeResponse(store, primaryModelClass, payload) {
    if (primaryModelClass.modelName === 'repository') {
      const repositories = payload.items.map((repo) => ({
        id: `${repo.id}`,
        type: 'repository',
        attributes: {
          name: repo.name,
          htmlUrl: repo.html_url,
          language: repo.language,
          private: repo.private,
        },
      }));
      return { data: repositories };
    }

    if (primaryModelClass.modelName === 'branch') {
      const branches = payload.map((branch) => ({
        id: branch.name,
        type: 'branch',
        attributes: {
          name: branch.name,
        },
      }));
      return { data: branches };
    }

    return super.normalizeResponse(...arguments);
  }
}
