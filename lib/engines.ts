import { $, spawnSync } from 'bun';
import { rmSync, mkdirSync, writeFileSync } from 'node:fs';
import { fmt } from './format';
import { dirname } from 'node:path';

export const CONFIG = {
  bun: {
    run: (file, env) => spawnSync(
      ['bun', 'run', file],
      { env, stderr: 'inherit' }
    ),
    id: async () => 'bun-' + (await $`bun -v`.text()).trim(),
    env: {}
  },
  deno: {
    run: (file, env) => spawnSync(
      ['deno', '--v8-flags=--allow-natives-syntax,--expose-gc', '--allow-env', file],
      { env, stderr: 'inherit' }
    ),
    id: async () => 'deno-' + (await $`deno -v`.text()).split(' ').at(-1)!.trim(),
    env: {}
  },
  node: {
    run: (file, env) => spawnSync(
      ['node', '--allow-natives-syntax', '--expose-gc', file],
      { env, stderr: 'inherit' }
    ),
    id: async () => 'node-' + (await $`node -v`.text()).slice(1).trim(),
    env: {}
  },
  v8: {
    run: (file, env) => spawnSync(
      ['v8', '--allow-natives-syntax', '--expose-gc', file],
      { env, stderr: 'inherit' }
    ),
    id: async () => 'v8',
    env: {}
  },
  spidermonkey: {
    run: (file, env) => spawnSync(
      ['spidermonkey', '-m', file],
      { env, stderr: 'inherit' }
    ),
    id: async () => 'spidermonkey',
    env: {}
  }
} satisfies Record<string, {
  run: (file: string, env: Record<string, string>) =>  Bun.SyncSubprocess<'pipe', 'inherit'>,
  id: () => Promise<string>,
  env: Record<string, string>
}>;
export type EngineId = `${keyof typeof CONFIG}${string}`;

export const env: Record<string, Record<string, string>> = {};

// Select runtime
const RUNTIME = process.argv[2];
if (RUNTIME == null) {
  console.error('Usage: bun start [runtime]');
  process.exit(1);
}

// @ts-ignore
const selectedRuntime = CONFIG[RUNTIME];
if (selectedRuntime == null) {
  console.error('Unknown runtime: ' + RUNTIME);
  console.info('Recognized runtimes:', Object.keys(CONFIG));
  process.exit(1);
}

export const id = await selectedRuntime.id();
console.log('Runtime:', fmt.h1(id));

// Recreate result directory
const RESULTS_DIR = `${import.meta.dir}/../results/${id}/`;

try {
  rmSync(RESULTS_DIR, { recursive: true });
} catch {}
mkdirSync(RESULTS_DIR, { recursive: true });

export const run = (path: string, name: string) => {
  const resultFile = RESULTS_DIR + name + '.txt';
  console.log('Running', fmt.h1(name));

  Bun.gc(true);
  try {
    mkdirSync(dirname(resultFile), { recursive: true });
  } catch { };
  writeFileSync(
    resultFile,
    selectedRuntime.run(path, {
      ...process.env,
      ...selectedRuntime.env,
      NO_COLOR: '1'
    }).stdout.toString()
  );

  console.log('Saved results to', fmt.relativePath(resultFile));
}
