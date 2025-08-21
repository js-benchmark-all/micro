import { start } from '@utils';
import { bench, do_not_optimize, summary } from 'mitata';

summary(() => {
  const register = (label: string, fn: (l: any) => any) => {
    bench(label, function* () {
      yield {
        [0]: () => [],
        bench: fn,
      };
    });
  };

  register('object literal', (l) => {
    do_not_optimize({ status: 200, headers: l });
  });

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
    const proto = Object.create(null);
    proto.status = 200;
    proto.headers = undefined;

    register('proto - Object.create()', (l) => {
      const o = Object.create(proto);
      o.headers = l;
      do_not_optimize(o);
    });

    {
      function Context(this: any, headers: any) {
        this.headers = headers;
      };
      Context.prototype = proto;

      register('proto - function with constructor', (l) => {
        // @ts-ignore
        do_not_optimize(new Context(l));
      });
    }

    {
      function Context() {};
      Context.prototype = proto;

      // @ts-ignore
      register('proto - function without constructor', (l) => {
        // @ts-ignore
        const o = new Context();
        o.headers = l;
        do_not_optimize(o);
      });
    }
  }
});

start();