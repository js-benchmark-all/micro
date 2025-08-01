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

summary(() => {
  const ARRAY_SIZE = 5;

  const ARR = new Array(ARRAY_SIZE).fill(0);
  const it = (name: string, fn: (arr: Record<string, number>) => any) => bench(name, function* () {
    yield {
      [0]: () => Object.fromEntries(
        ARR.map((_, i) => ['d' + i, Math.random().toFixed(3)])
      ),
      bench: fn
    }
  }).gc('inner');

  it('clone object - spread', (rec) => ({ ...rec }));
  it('clone object - Object.assign()', (rec) => Object.assign({}, rec));
  it('clone object - Object.create()', (rec) => Object.create(rec));
});

run();
