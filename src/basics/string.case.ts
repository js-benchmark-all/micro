import { bench, summary, do_not_optimize } from 'mitata';
import { start } from '@utils';

summary(() => {
  const register = (label: string, fn: (l: any) => any) => {
    bench(label, function* () {
      yield {
        [0]: () => '0' + Math.random() + '0',
        bench: fn,
      };
    });
  };

  register('string[const_index]', (str) => {
    do_not_optimize(str[0]);
  });

  register('string.charCodeAt(const_index)', (str) => {
    do_not_optimize(str.charCodeAt(0));
  });

  register('string.charAt(const_index)', (str) => {
    do_not_optimize(str.charAt(0));
  });
});

start();
