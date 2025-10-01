import { bench, summary, do_not_optimize } from 'mitata';
import { start } from '@utils';

summary(() => {
  const register = (label: string, fn: (l: any) => any) => {
    bench(label, function* () {
      yield {
        [0]: () => Math.random() + '0',
        bench: fn,
      };
    });
  };

  register('string[const_index] comparison', (str) => {
    do_not_optimize(str[0] === '0');
  });

  register('string.charCodeAt(const_index) comparison', (str) => {
    do_not_optimize(str.charCodeAt(0) === 48);
  });

  register('string.charAt(const_index) comparison', (str) => {
    do_not_optimize(str.charAt(0) === '0');
  });
});

start();
