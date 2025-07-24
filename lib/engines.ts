import { $ } from 'bun';

export const args: Record<string, string[]> = {
  node: ['--allow-natives-syntax', '--expose-gc'],
  v8: ['--allow-natives-syntax', '--expose-gc'],
};

export const env: Record<string, Record<string, string>> = {};

export const run = (runtime: string, path: string) => {
  $.env(env[runtime] ?? {});
  return $`${{ raw: runtime }} ${args[runtime] ?? []} ${path}`;
}
