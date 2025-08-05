import tests from './.out/_.json';
import { run } from './lib/engines.ts';
import pc from 'picocolors';

const RESULTS_DIR = import.meta.dir + '/results/';

const RUNTIME = process.argv[2];
if (RUNTIME == null) throw new Error('Usage: bun start [runtime]');

const OUTPUT: "stdout" | "file" = process.argv[3] as any ?? 'stdout';

for (const name in tests) {
  console.log('---------------------------------');
  console.log('Running:', pc.bold(name));

  if (OUTPUT === 'stdout')
    await run(RUNTIME, tests[name as keyof typeof tests]);
  else if (OUTPUT === 'file')
    await run(RUNTIME, tests[name as keyof typeof tests], {
      outputFile: RESULTS_DIR + name + '.' + RUNTIME + '.txt'
    });
  else
    throw new Error('Unrecognized output mode: ' + OUTPUT);
}
