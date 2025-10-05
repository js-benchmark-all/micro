import { bench, summary, do_not_optimize } from 'mitata';
import { start } from '@utils';

summary(() => {
  const register = (label: string, fn: (l: number[]) => any) => {
    bench(label, function* () {
      yield {
        [0]: () => [999, 78, 12, 45, 3809438, 8289],
        bench: fn,
      };
    });
  };

  interface Writer {
    buf: Uint8Array;
    index: number;
  }

  const pack = (i: number, writer: Writer) => {
    let t = i & 255;
    while (t !== 0) {
      i >>= 8;
      writer.buf[writer.index++] = t;
      t = i & 255;
    }
  }

  const packInList = (i: number, arr: number[]) => {
    let t = i & 255;
    while (t !== 0) {
      i >>= 8;
      arr.push(t);
      t = i & 255;
    }
  }

  const countLen = (i: number) => {
    let t = i & 255;
    let len = 0;
    while (t !== 0) {
      i >>= 8;
      len++;
      t = i & 255;
    }
    return len;
  }

  register('2 pass', (arr) => {
    let len = 0;
    for (let i = 0; i < arr.length; i++)
      len += countLen(arr[i]);

    const writer: Writer = {
      buf: new Uint8Array(len),
      index: 0,
    };

    for (let i = 0; i < arr.length; i++)
      pack(arr[i], writer);

    do_not_optimize(writer);
  });

  register('1 pass', (arr) => {
    const list: number[] = [];
    for (let i = 0; i < arr.length; i++)
      packInList(arr[i], list);
    do_not_optimize(Uint8Array.from(list));
  })
});

start();
