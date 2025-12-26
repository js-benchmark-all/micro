import { start } from '@utils';
import { bench, do_not_optimize, summary } from 'mitata';

summary(() => {
  const register = (label: string, fn: (value: number) => any) => {
    bench(label, function* () {
      yield {
        [0]: () => 123,
        bench: fn,
      };
    });
  };

  {
    // https://github.com/Kikobeats/null-prototype-object/blob/master/benchmark/index.js
    function Proto() { };
    Proto.prototype = Object.create(null);
    Object.freeze(Proto.prototype);

    register('constructor', (val) => {
      // @ts-ignore
      const o = new Proto();
      o.foo = val;
      do_not_optimize(o);
    });
  }

  {
    class Context {
      status: number;
      headers: any;

      constructor(headers: any) {
        this.status = 200;
        this.headers = headers;
      }
    }

    register('class - with constructor', (l) => {
      do_not_optimize(new Context(l));
    });
  }

  {
    class Context {
      status!: number;
      headers!: any;
    }

    register('class -  without constructor', (l) => {
      const c = new Context();
      c.status = 200;
      c.headers = l;
      do_not_optimize(c);
    });
  }

  {
    // https://github.com/Kikobeats/null-prototype-object/blob/master/benchmark/index.js
    function Proto() { };
    Proto.prototype = Object.create(null);

    register('constructor without freezed proto', (val) => {
      // @ts-ignore
      const o = new Proto();
      o.foo = val;
      do_not_optimize(o);
    });
  }

  register('no constructor', (val) => {
    // @ts-ignore
    const o = Object.create(null);
    o.foo = val;
    do_not_optimize(o);
  });

  register('__proto__ set to null', (val) => {
    // @ts-ignore
    const o = { __proto__: null };
    // @ts-ignore
    o.foo = val;
    do_not_optimize(o);
  });

  register('normal object', (val) => {
    const o = {};
    // @ts-ignore
    o.foo = val;
    do_not_optimize(o);
  });
});

start();
