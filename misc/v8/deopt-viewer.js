import { existsSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const target = process.argv[2];
if (target == null || target === '--clean') {
  console.log(`Usage: bun view:deopt [file] [OPTIONS]
  Options:
    --clean    Remove old deopt logs
`);
  process.exit(1);
}

const LOGS_DIR = import.meta.dir + '/.deopt-logs';

if (process.argv.includes('--clean')) {
  try {
    rmSync(LOGS_DIR);
    console.log('Removed old deopt logs!');
  } catch {};
} else if (!existsSync(LOGS_DIR)) {
  try {
    mkdirSync(LOGS_DIR);
  } catch {};
}

Bun.$.cwd(import.meta.dir);
await Bun.$`bun dexnode --out ${LOGS_DIR + '/' + target + '.log'} --quiet --no-maps --no-profile ${join('./src/', target + '.js')}`;