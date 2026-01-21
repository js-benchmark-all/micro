import tests from './.out/_.json';
import { id, run } from './lib/engines.ts';
import { includeName } from './lib/filters.ts';

for (const name in tests) {
  if (!includeName(name, id)) continue;
  run(tests[name as keyof typeof tests], name);
}
