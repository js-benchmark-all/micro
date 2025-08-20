import { start } from '@utils';
import { bench, summary } from 'mitata';

summary(() => {
  const register = (label: string, fn: (l: any) => any) => {
    bench(label, function* () {
      yield {
        [0]: () => [],
        bench: fn,
      };
    });
  };

  register('object literal', (l) => ({ status: 200, headers: l }));

  {
    class Context {
      status: number;
      headers: any;

      constructor(headers: any) {
        this.status = 200;
        this.headers = headers;
      }
    }
    
    register('class - with constructor', (l) => new Context(l));
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
      return c;
    });
  }

  {
    const proto = Object.create(null);
    proto.status = 200;
    proto.headers = undefined;

    register('proto - Object.create()', (l) => {
      const o = Object.create(proto);
      o.headers = l;
      return o;
    });

    {
      function Context(this: any, headers: any) {
        this.headers = headers;
      };
      Context.prototype = proto;

      // @ts-ignore
      register('proto - function with constructor', (l) => new Context(l));
    }

    {
      function Context() {};
      Context.prototype = proto;

      // @ts-ignore
      register('proto - function without constructor', (l) => {
        // @ts-ignore
        const o = new Context();
        o.headers = l;
        return o;
      });
    }
  }
});

start();