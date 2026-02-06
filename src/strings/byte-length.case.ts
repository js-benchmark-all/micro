import { bench, summary, do_not_optimize } from 'mitata';
import { start } from '@utils';

summary(() => {
  const register = (label: string, fn: (l: string) => any) => {
    bench(label, function* () {
      yield {
        [0]: () => 'abcnajnbainbika',
        bench: fn,
      };
    });
  };

  if (globalThis.Blob) {
    register('blob size', (str) => {
      do_not_optimize(new Blob([str]).size);
    });
  }

  if (globalThis.TextEncoder) {
    const textEncoder = new TextEncoder();
    register('text encoder encode', (str) => {
      do_not_optimize(textEncoder.encode(str).length);
    });
  }

  if (globalThis.Buffer)
    register('node buffer', (str) => {
      do_not_optimize(Buffer.from(str).length);
    });
});

if (globalThis.Blob || globalThis.TextDecoder || globalThis.Buffer)
  start();
