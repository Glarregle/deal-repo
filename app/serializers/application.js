import JSONAPISerializer from '@ember-data/serializer/json-api';

export default class ApplicationSerializer extends JSONAPISerializer {
  normalizeResponse(_store, _primaryModelClass, payload) {
    if (_primaryModelClass.modelName === 'repository') {
      const repositories = payload.items.map((repo) => {
        const { id, name, language } = repo;
        return {
          id,
          type: 'repository',
          attributes: {
            name,
            htmlUrl: repo.html_url,
            language,
            private: repo.private,
          },
        };
      });
      return { data: repositories };
    }

    if (_primaryModelClass.modelName === 'branch') {
      const branches = payload.map((branch) => {
        const { name } = branch;
        return {
          id: name,
          type: 'branch',
          attributes: {
            name,
          },
        };
      });
      return { data: branches };
    }

    return super.normalizeResponse(...arguments);
  }
}
