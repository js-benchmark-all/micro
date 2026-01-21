import { bench, do_not_optimize, summary } from 'mitata';
import { start } from '@utils';

bench('await Promise', function* () {
  yield {
    [0]: () => Promise.resolve(),
    bench: async (a: any) => {
      do_not_optimize(await a);
    },
  };
});

bench('await non-promise', function* () {
  yield {
    [0]: Math.random,
    bench: async (a: any) => {
      do_not_optimize(await a);
    },
  };
});

bench('for await', function* () {
  const p1 = Promise.resolve();

  const gen = async function* () {
    yield 1;
    yield p1;
    yield await p1;
  };

  yield {
    [0]: () => gen(),
    bench: async (it: ReturnType<typeof gen>) => {
      for await (const v of it)
        do_not_optimize(v);
    }
  };
});

start();
