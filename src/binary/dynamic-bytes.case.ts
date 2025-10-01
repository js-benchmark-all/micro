import { bench, summary, do_not_optimize } from 'mitata';
import { start } from '@utils';

summary(() => {
  const register = (label: string, fn: (l: number[]) => any) => {
    bench(label, function* () {
      yield {
        [0]: () => [12, 129, 65538, 100000, 567, 34],
        bench: fn,
      };
    });
  };

  register('2 pass - length & construct', (numbers) => {
    let bufLen = 0;
    for (let i = 0; i < numbers.length; i++) {
      let num = numbers[i];
      while (num > 255) {
        bufLen += 8;
        num >>= 8;
      }
    }

    const buf = new Uint8Array(bufLen);
    let bufIndex = 0;
    for (let i = 0; i < numbers.length; i++) {
      let num = numbers[i];
      while (num > 255) {
        buf[bufIndex++] = num;
        num >>= 8;
      }
    }

    do_not_optimize(buf);
  });

  register('1 pass - naive buffer resizing', (numbers) => {
    let bufLen = 0;
    const buf = new ArrayBuffer();
    const view = new DataView(buf);

    for (let i = 0; i < numbers.length; i++) {
      let num = numbers[i];
      while (num > 255) {
        buf.resize(bufLen << 3 + 8);
        view.setUint8(bufLen++, num);
        num >>= 8;
      }
    }

    do_not_optimize(view);
  });

  register('1 pass - buffer resizing', (numbers) => {
    let bufLen = 0, bufCap = 8;
    const buf = new ArrayBuffer(8);
    const view = new DataView(buf);

    for (let i = 0; i < numbers.length; i++) {
      let num = numbers[i];
      while (num > 255) {
        if (bufLen << 3 + 8 > bufCap)
          buf.resize(bufCap <<= 1);

        view.setUint8(bufLen++, num);
        num >>= 8;
      }
    }

    do_not_optimize(view);
  });
});

start();
