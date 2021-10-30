/*
  This is the custom in memory cache. It provides limited normalization support.

  {
    "notes": ["3c679ece-e35c-4ba2-bb5b-06937865bbaa"],
    "notes:3c679ece-e35c-4ba2-bb5b-06937865bbaa": {
      created_at: "2021-10-30T03:36:50.285008+00:00"
      id: "3c679ece-e35c-4ba2-bb5b-06937865bbaa"
      summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed aliquam nisl et nisi vulputate condimentum. Curabitur id euismod turpis. Integer blandit diam at blandit vehicula. Integer vulputate mattis augue cursus commodo. Fusce eleifend tempor tristique. Fusce nunc urna, euismod vel rutrum ut, dictum eget metus. Sed sollicitudin convallis purus, eget pellentesque libero pharetra ut. Sed facilisis posuere bibendum. Vivamus hendrerit quis ligula a vehicula."
      title: "Long Note"
    }
  }

  When an array of notes is provided, the cache will convert this to a list of note ids. Each note
  is included in the cache using the id as an index.

  When we lookup the exisitng notes, we will get back a list of full note objects from the cache.
*/
export default () => {
  const cache: { [key: string]: any } = {};

  const lookup = (key: any) => {
    if (Array.isArray(cache[key])) {
      /* When we are retriving a value from the cache we need to convert
         our list of note ids into a list of note objects. */
      return cache[key].map((id: any) => cache[`${key}:${id}`]);
    } else {
      return cache[key];
    }
  };

  const apply = (key: any, data: any) => {
    if (Array.isArray(data)) {
      /* When we are caching an array, we want to store the 
         list of ids and each note separately. */
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

  /* This makes it easier to look at the cached values
     in the browser Console. */
  (window as any).cacheDebug = cache;

  return {
    lookup,
    apply,
    remove,
  };
};
