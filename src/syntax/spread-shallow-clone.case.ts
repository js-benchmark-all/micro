import { run, bench, summary } from 'mitata';

summary(() => {
  const ARRAY_SIZE = 10;

  const ARR = new Array(ARRAY_SIZE).fill(0);
  const it = (name: string, fn: (arr: any[]) => any) => bench(name, function* () {
    yield {
      [0]: () => ARR.map(() => Math.random() + ''),
      bench: fn
    }
  }).gc('inner');

  it('clone array - spread', (arr) => [...arr]);
  it('clone array - slice', (arr) => arr.slice());
});

run();
