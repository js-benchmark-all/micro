import { bench, summary } from 'mitata';
import { start } from '@utils';

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
  it('clone array - concat', (arr) => arr.concat());
  it('clone array - from', (arr) => Array.from(arr));

  const empty: any[] = [];
  it('clone array - concat empty array', (arr) => arr.concat(empty));
});

summary(() => {
  const ARRAY_SIZE = 10;

  const ARR = new Array(ARRAY_SIZE).fill(0);
  const it = (name: string, fn: (arr1: any[], arr2: any[]) => any) => bench(name, function* () {
    yield {
      [0]: () => ARR.map(() => Math.random() + ''),
      [1]: () => ARR.map(() => Math.random() + ''),
      bench: fn
    }
  }).gc('inner');

  it('clone 2 array - spread', (arr1, arr2) => [...arr1, ...arr2]);
  it('clone 2 array - concat', (arr1, arr2) => arr1.concat(arr2));
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

start();
