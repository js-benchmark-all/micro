import { shuffleList, start } from '@utils';
import { bench, summary } from 'mitata';

const it = (NAME: string, PROPS: {
  cases: number,
  keys: number, 
  selectedKeys: number,
  unknownKeys: string[]
}) => {
  summary(() => {
    const cases = new Array(PROPS.cases)
      .fill(0)
      .map(() => {
        const keys = new Array(PROPS.keys).fill('').map(() => Math.random() + '');
    
        const obj: Record<string, any> = {};
        for (let i = 0; i < keys.length; i++)
          obj[keys[i]!] = Math.random();
    
        return {
          keys: shuffleList(keys).slice(0, PROPS.selectedKeys).concat(PROPS.unknownKeys),
          obj
        };
      });

    const register = (label: string, f: (originalObj: Record<string, any>, keys: string[]) => any) => {
      bench(NAME + ' - ' + label, function* () {
        let i = -1;
  
        yield {
          [0]: () => {
            i = (i + 1) % cases.length;
            return cases[i]!.obj;
          },
          [1]: () => cases[i]!.keys,
          bench: f
        }
      }).gc('inner');
    };
  
    register('for in & assign', (originalObj, keys) => {
      const obj: Record<string, any> = {};
  
      for (const key in originalObj)
        keys.includes(key) && (obj[key] = originalObj[key]);
  
      return obj;
    });
  
    register('assign with in', (originalObj, keys) => {
      const obj: Record<string, any> = {};
  
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i]!;
        key in originalObj && (obj[key] = originalObj[key]);
      }
  
      return obj;
    });
  
    register('assign with Object.hasOwn', (originalObj, keys) => {
      const obj: Record<string, any> = {};
  
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i]!;
        Object.hasOwn(originalObj, key) && (obj[key] = originalObj[key]);
      }
  
      return obj;
    });
  
    register('Object.keys() & assign', (originalObj, keys) => {
      const obj: Record<string, any> = {};
  
      for (let i = 0, l = Object.keys(originalObj); i < l.length; i++) {
        const key = l[i]!;
        keys.includes(key) && (obj[key] = originalObj[key]);
      }
  
      return obj;
    });
  
    register('filter() & reduce() with assign', (originalObj, keys) =>
      Object.keys(originalObj)
        .filter((k) => keys.includes(k))
        .reduce((obj, key) => {
          obj[key] = originalObj[key];
          return obj;
        }, {} as Record<string, any>)
    );
  
    register('Object.fromEntries() & filter()', (originalObj, keys) =>
      Object.fromEntries(
        Object.entries(originalObj).filter((o) => keys.includes(o[0])),
      )
    );
  });
}

it('object pick no unknowns', {
  cases: 10,
  keys: 6,
  selectedKeys: 4,
  unknownKeys: []
});

it('object pick 2 unknowns', {
  cases: 10,
  keys: 6,
  selectedKeys: 4,
  unknownKeys: ['a', 'b']
});


it('object pick 6 unknowns', {
  cases: 10,
  keys: 15,
  selectedKeys: 5,
  unknownKeys: ['a', 'b', 'c', 'd', 'e', 'f']
});

start();