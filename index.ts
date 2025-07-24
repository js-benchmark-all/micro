import tests from './.out/_.json';
import { run } from './lib/engines.ts';
import pc from 'picocolors';

const RUNTIME = process.argv[2];
if (RUNTIME == null) throw new Error('Usage: bun exec [runtime]');

for (const name in tests) {
  console.log('---------------------------------');
  console.log('RUNNING:', pc.bold(name));

  await run(RUNTIME, tests[name as keyof typeof tests]);
}
