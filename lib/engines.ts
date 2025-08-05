import { $ } from 'bun';
import { dirname, resolve } from 'node:path';
import fs from 'node:fs';

export const args: Record<string, string[]> = {
  deno: ['--v8-flags=--allow-natives-syntax,--expose-gc', '--allow-env'],
  node: ['--allow-natives-syntax', '--expose-gc'],
  v8: ['--allow-natives-syntax', '--expose-gc'],
};

export const env: Record<string, Record<string, string>> = {};

const createFile =(path: string) => {
  path = resolve(path);
  try {
    fs.mkdirSync(dirname(path), { recursive: true });
  } catch {}
  try {
    fs.writeFileSync(resolve(path), '');
  } catch {}
}

export const run = (runtime: string, path: string, opts?: {
  noColor?: boolean,
  outputFile?: string
}) => {
  $.env(
    Object.assign({}, env[runtime] ?? {}, opts?.noColor || opts?.outputFile ? { NO_COLOR: '1' } : {})
  );
  
  if (opts?.outputFile) {
    createFile(opts.outputFile);
    return $`${runtime} ${args[runtime] ?? []} ${path} > ${Bun.file(opts.outputFile)}`;
  }

  return $`${runtime} ${args[runtime] ?? []} ${path}`;
}
