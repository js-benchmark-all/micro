import { do_not_optimize } from 'mitata';

const f1 = (c) => {
  c.headers.push(['Cookie', 'foo=bar']);
  return performance.now();
}

const f2 = (c) => {
  c.status = c.id < 5e3 ? 200 : 201;
}

const loop = () => {
  const c = {
    status: 200,
    headers: []
  };
  do_not_optimize(c);
  c.id = f1(c);
  f2(c);
  do_not_optimize(c);
}

// Optimization viewer exports
export const main = () => {
  for (let i = 0; i < 1e6; i++)
    loop();
}

export const viewOptimizations = {
  'first middleware': f1,
  'second middleware': f2
};