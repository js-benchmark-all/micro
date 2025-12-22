import tests from './.out/_.json';
import { run } from './lib/engines.ts';
import { includeName } from './lib/filters.ts';

for (const name in tests) {
  if (!includeName(name)) continue;
  run(tests[name as keyof typeof tests], name);
}
