import { run, bench, summary, do_not_optimize } from 'mitata';

summary(() => {
  bench('access object', function* () {
    yield {
      [0]: () => ({
				a: Math.random(),
				b: Math.random(),
			}),
      bench: (o: any) => o.a
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
  bench('create & access object', () => {
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

run();
