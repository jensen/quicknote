import { useEffect, useState, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

import Cache from "services/cache";

if (!import.meta.env.VITE_SUPABASE_URL)
  throw new Error("Missing environment variable: VITE_SUPABASE_URL");

if (!import.meta.env.VITE_SUPABASE_ANON_KEY)
  throw new Error("Missing environment variable: VITE_SUPABASE_ANON_KEY");

const supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey: string = import.meta.env.VITE_SUPABASE_ANON_KEY;

type IListener = () => void;

const listeners: {
  registered: Set<IListener>;
} = { registered: new Set<IListener>() };

const emit = () => {
  listeners.registered.forEach((listener) => listener());
};

const addListener = (listener: IListener) => {
  listeners.registered.add(listener);
};

const removeListener = (listener: IListener) =>
  listeners.registered.delete(listener);

const cache = Cache();

export interface IResourceLoader<T> {
  load: (id?: string) => void;
  read: (id?: string) => T[];
  update: (data: T) => void;
  move: (from: number, to: number) => void;
  remove: (id: string) => void;
}

/*
  It may be a few days before I get to commenting this properly.
  
  It is a prototype after all.
*/
export const preload = <T>(
  key: string,
  promise: any,
  { update, fragments, store }: { update: any; fragments: any; store: any }
): IResourceLoader<T> => {
  const request: {
    pending: boolean;
    error: null;
  } = {
    pending: true,
    error: null,
  };

  const preload = {
    pending: false,
    promise: null,
  };

  const suspendOn = promise.then(({ data, error }: { data: T; error: any }) => {
    if (error) {
      request.error = error;
    }

    if (data) {
      cache.apply(key, data);
    }

    request.pending = false;
  });

  return {
    load(id?: string) {
      const cached = cache.lookup(key);

      if (cached) {
        if (id) {
          const fragment = fragments(cached, id);

          if (fragment && preload.pending === false) {
            preload.pending = true;
            preload.promise = fragment;

            fragment.then((data: any) => {
              cache.apply(key, data);

              emit();

              preload.promise = null;
              preload.pending = false;
            });
          }
        }
      }
    },
    read(id?: string) {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [_, refresh] = useState(0);

      // eslint-disable-next-line react-hooks/rules-of-hooks
      const force = useCallback(() => refresh((prev) => prev + 1), []);

      // eslint-disable-next-line react-hooks/rules-of-hooks
      useEffect(() => {
        addListener(force);

        return () => {
          removeListener(force);
        };
      }, [force]);

      if (request.pending) {
        throw suspendOn;
      }

      if (request.error) {
        throw request.error;
      }

      const cached = cache.lookup(key);

      if (cached) {
        if (id) {
          if (preload.pending) {
            throw preload.promise;
          } else {
            const fragment = fragments(cached, id);

            if (fragment) {
              throw fragment.then((data: any) => {
                cache.apply(key, data);

                emit();
              });
            }
          }
        }

        return cached;
      }
    },
    update(data: T) {
      const updated = update(cache.lookup(key), data);

      cache.apply(key, updated);

      store(updated);

      emit();
    },
    move(from: number, to: number) {
      const items = cache.lookup(key);

      const swap = [...items];

      swap[from] = items[to];
      swap[to] = items[from];

      cache.apply(key, swap);

      store(swap);

      emit();
    },
    remove(id: string) {
      const items: T = cache.lookup(key);

      if (Array.isArray(items)) {
        const filtered = items.filter((item) => item.id !== id);

        cache.apply(key, filtered);

        store(filtered);
      }

      cache.remove(`${key}:${id}`);

      emit();
    },
  };
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
