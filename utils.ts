// @ts-nocheck
import { run } from "mitata";

const runtime = (): string | null => {
  if (globalThis.d8) return 'v8';
  if (globalThis.tjs) return 'txiki.js';
  if (globalThis.Graal) return 'graaljs';
  if (globalThis.process?.versions?.llrt) return 'llrt';
  if (globalThis.process?.versions?.webcontainer) return 'webcontainer';
  if (globalThis.inIon && globalThis.performance?.mozMemory) return 'spidermonkey';
  if (globalThis.window && globalThis.netscape && globalThis.InternalError) return 'firefox';
  if (globalThis.window && globalThis.navigator && Error.prepareStackTrace) return 'chromium';
  if (globalThis.navigator?.userAgent?.toLowerCase?.()?.includes?.('quickjs-ng')) return 'quickjs-ng';
  if (globalThis.$262 && globalThis.lockdown && globalThis.AsyncDisposableStack) return 'XS Moddable';
  if (globalThis.$ && 'IsHTMLDDA' in globalThis.$ && (new Error().stack).includes('runtime@')) return 'jsc';
  if (globalThis.window && globalThis.navigator && (new Error().stack).includes('runtime@')) return 'webkit';
  
  if (globalThis.os && globalThis.std) return 'quickjs';
  if (globalThis.Bun) return 'bun'; if (globalThis.Deno) return 'deno'; if (globalThis.HermesInternal) return 'hermes';
  if (globalThis.window && globalThis.navigator) return 'browser'; if (globalThis.process) return 'node'; else return null;
}

const colors = () => {
  return globalThis.tjs?.env?.FORCE_COLOR || globalThis.process?.env?.FORCE_COLOR
    || (
      !globalThis.Deno?.noColor
      && !globalThis.tjs?.env?.NO_COLOR
      && !globalThis.process?.env?.NO_COLOR
      && !globalThis.process?.env?.NODE_DISABLE_COLORS
    );
}

export const start = () => {
  run({
    colors: ['node', 'bun', 'deno'].includes(runtime()!) && colors()
  });
}

export const shuffleList = <T>(arr: T[]): T[] => arr.toSorted(() => 0.5 - Math.random());