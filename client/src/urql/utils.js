import { stringifyVariables } from '@urql/core';

export const offsetPagination = () => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;
    const allFields = cache.inspectFields(entityKey);
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }

    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    const isItInTheCache = cache.resolve(
      cache.resolveFieldByKey(entityKey, fieldKey),
      'nodes'
    );
    info.partial = !isItInTheCache;
    let hasMore = true;
    const results = [];
    fieldInfos.forEach((fi) => {
      const key = cache.resolveFieldByKey(entityKey, fi.fieldKey);
      const data = cache.resolve(key, 'nodes');
      const _hasMore = cache.resolve(key, 'hasMore');
      if (!_hasMore) {
        hasMore = _hasMore;
      }
      results.push(...data);
    });

    return {
      __typename: 'PaginatedMessages',
      hasMore,
      nodes: results,
    };
  };
};
