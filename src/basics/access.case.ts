import { bench, summary, do_not_optimize } from 'mitata';
import { start } from '@utils';

summary(() => {
  bench('access monomorphic object', function* () {
    yield {
      [0]: () => ({
        a: Math.random(),
        b: Math.random(),
      }),
      bench: (o: any) => {
        for (let i = 0; i < 500; i++)
          do_not_optimize(o.a);
      }
    }
  }).gc('inner');

  bench('access polymorphic object', function* () {
    let i = 0;
    yield {
      [0]: () => i++ & 1
        ? {
          a: Math.random(),
          b: Math.random(),
        }
        : {
          b: Math.random(),
          a: Math.random(),
          c: Math.random()
        },
      bench: (o: any) => {
        for (let i = 0; i < 500; i++)
          do_not_optimize(o.a);
      }
    }
  }).gc('inner');

  bench('access array', function* () {
    yield {
      [0]: () => [
        Math.random(),
        Math.random()
      ],
      bench: (o: any) => {
        for (let i = 0; i < 500; i++)
          do_not_optimize(o[0]);
      }
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

start();
