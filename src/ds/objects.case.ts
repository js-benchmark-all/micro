import { bench, summary, do_not_optimize } from 'mitata';
import { shuffleList, start } from '@utils';

summary(() => {
  bench('access monomorphic object', function* () {
    yield {
      [0]: () => ({
				a: Math.random(),
				b: Math.random(),
			}),
      bench: (o: any) => o.a
    }
  }).gc('inner');

  bench('access polymorphic object', function* () {
    let i = 0;
    yield {
      [0]: () => i++ & 1 
        ? {
				  c: Math.random(),
				  d: Math.random(),
			  } 
        : { c: Math.random() },
      bench: (o: any) => o.c
    }
  }).gc('inner');

  bench('access array', function* () {
    yield {
      [0]: () => [
				Math.random(),
				Math.random()
			],
      bench: (o: any) => o[0]
    }
  }).gc('inner');
});

summary(() => {
  bench('create & access monomorphic object', () => {
    const o = {
      a: Math.random(),
      c: Math.random(),
    };
    do_not_optimize(o);
    do_not_optimize(o.a);
  });

  bench('create & access array', () => {
    const o = [
      Math.random(),
      Math.random()
    ];
    do_not_optimize(o);
    do_not_optimize(o[0]);
  });
});

summary(() => {
  const CASES = 100;
  const KEYS = 7;
  const SELECTED_KEYS = 4;

  const cases = new Array(CASES)
    .fill(0)
    .map(() => {
      const keys = new Array(KEYS).fill('').map(() => Math.random() + '');

      const obj: Record<string, any> = {};
      for (let i = 0; i < keys.length; i++)
        obj[keys[i]!] = Math.random();

      return {
        keys: shuffleList(keys).slice(0, SELECTED_KEYS),
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

  register('Object.keys() & assign', (originalObj, keys) => {
    const obj: Record<string, unknown> = {};

    for (let i = 0, l = Object.keys(originalObj); i < l.length; i++) {
      const key = l[i]!;
      keys.includes(key) && (obj[key] = originalObj[key]);
    }

    return obj;
  });

  register('Object.keys() & Object.fromEntries()', (originalObj, keys) => 
    Object.fromEntries(keys.map((k) => [k, originalObj[k]]))
  );

  register('filter() & reduce() no assign', (originalObj, keys) =>
    Object.keys(originalObj)
      .filter((k) => keys.includes(k))
      .reduce((obj, key) => ({ ...obj, [key]: originalObj[key] }), {})
  );

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

start();
