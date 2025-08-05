import { $ } from 'bun';

export const args: Record<string, string[]> = {
  deno: ['--v8-flags=--allow-natives-syntax,--expose-gc', '--allow-env'],
  node: ['--allow-natives-syntax', '--expose-gc'],
  v8: ['--allow-natives-syntax', '--expose-gc'],
};

export const env: Record<string, Record<string, string>> = {};

export const run = (runtime: string, path: string, opts?: {
  noColor?: boolean,
  outputFile?: string
}) => {
  $.env(
    Object.assign({}, env[runtime] ?? {}, opts?.noColor || opts?.outputFile ? { NO_COLOR: '1' } : {})
  );
  return opts?.outputFile
    ? $`${runtime} ${args[runtime] ?? []} ${path} > ${opts.outputFile}`
    : $`${runtime} ${args[runtime] ?? []} ${path}`;
}
