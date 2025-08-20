import { shuffleList } from '@utils';
import { bench, summary, do_not_optimize } from 'mitata';

summary(() => {
  const CASES = 10;
  const KEYS = 7;
  const SELECTED_KEYS = 4;
  const UNKNOWN_KEYS: string[] = [];

  const cases = new Array(CASES)
    .fill(0)
    .map(() => {
      const keys = new Array(KEYS).fill('').map(() => Math.random() + '');

      const obj: Record<string, any> = {};
      for (let i = 0; i < keys.length; i++)
        obj[keys[i]!] = Math.random();

      return {
        keys: shuffleList(keys).slice(0, SELECTED_KEYS).concat(UNKNOWN_KEYS),
        obj
      };
    })

  const register = (label: string, f: (originalObj: Record<string, any>, keys: string[]) => any) => {
    bench('pick object keys - ' + label, function* () {
      let i = -1;

      yield {
        [0]: () => {
          i = (i + 1) % cases.length;
          return cases[i]!.obj;
        },
        [1]: () => cases[i]!.keys,
        bench: f
      }
    });
  }

  register('for in & assign', (originalObj, keys) => {
    const obj: Record<string, any> = {};

    for (const key in originalObj)
      keys.includes(key) && (obj[key] = originalObj[key]);

    return obj;
  });

  register('assign with in', (originalObj, keys) => {
    const obj: Record<string, any> = {};

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]!;
      key in originalObj && (obj[key] = originalObj[key]);
    }

    return obj;
  });

  register('assign with Object.hasOwn', (originalObj, keys) => {
    const obj: Record<string, any> = {};

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]!;
      Object.hasOwn(originalObj, key) && (obj[key] = originalObj[key]);
    }

    return obj;
  });

  register('Object.keys() & assign', (originalObj, keys) => {
    const obj: Record<string, any> = {};

    for (let i = 0, l = Object.keys(originalObj); i < l.length; i++) {
      const key = l[i]!;
      keys.includes(key) && (obj[key] = originalObj[key]);
    }

    return obj;
  });

  register('filter() & reduce() with assign', (originalObj, keys) =>
    Object.keys(originalObj)
      .filter((k) => keys.includes(k))
      .reduce((obj, key) => {
        obj[key] = originalObj[key];
        return obj;
      }, {} as Record<string, any>)
  );

  register('Object.fromEntries() & filter()', (originalObj, keys) =>
    Object.fromEntries(
      Object.entries(originalObj).filter((o) => keys.includes(o[0])),
    )
  );
});