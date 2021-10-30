export default () => {
  const cache: { [key: string]: any } = {};

  const lookup = (key: any) => {
    if (Array.isArray(cache[key])) {
      return cache[key].map((id: any) => cache[`${key}:${id}`]);
    } else {
      return cache[key];
    }
  };

  const apply = (key: any, data: any) => {
    if (Array.isArray(data)) {
      cache[key] = data.map((item) => item.id);
      for (const item of data) {
        cache[`${key}:${item.id}`] = item;
      }
    } else {
      cache[`${key}:${data.id}`] = data;
    }
  };

  const remove = (key: any) => {
    delete cache[key];
  };

  (window as any).cacheDebug = cache;

  return {
    lookup,
    apply,
    remove,
  };
};
