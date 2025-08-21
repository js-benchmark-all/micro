const VERSION = process.versions.v8.split('-', 1)[0];

// http://git.nfp.is/TheThing/flaska/src/branch/master/benchmark/compiler/utils.mjs
// To find status codes, navigate to https://github.com/v8/v8/blob/<VERSION-COMMIT>/test/mjsunit/mjsunit.js
const STATUS_MAP = {
  '13.6.233.10': [
    'is function',
    'never optimized',
    'always optimized',
    'maybe deopted',
    'optimized',
    'maglevved',
    'turbofanned',
    'interpreted',
    'marked for optimization',
    'marked for concurrent optimization',
    'optimizing concurrently',
    'executing',
    'topmost frame is turbofanned',
    'lite mode',
    'marked for deoptimization',
    'baseline',
    'topmost frame is interpreted',
    'topmost frame is baseline',
    'lazy',
    'topmost frame is maglev',
    'optimize on next call optimizes to maglev',
    'optimize maglev optimizes to turbofan',
    'marked for maglev optimization',
    'marked for concurrent maglev optimization'
  ]
};
const STATUS = STATUS_MAP[VERSION];

if (STATUS == null) {
  console.error('Unsupported V8 version:', VERSION);
  console.error('Supported versions are:', Object.keys(STATUS_MAP));
  process.exit(1);
}

const printOptimizationStatus = (name, fn) => {
  console.log(name + ':');
  for (let pos = 0, opt = %GetOptimizationStatus(fn); opt > 0; pos++) {
    if (opt & 1)
      console.log('- ' + STATUS[pos]);
    opt >>= 1;
    pos++;
  }
}

const file = process.argv[2];
if (file == null) {
  console.log(`Usage: bun view:opt [file]`);
  process.exit(1);
}

(async () => {
  console.log('v8:', VERSION);

  const { main, viewOptimizations } = await import('./src/' + file + '.js');
  if (main == null) {
    console.error('Entry', file, 'must exports a main function!');
    process.exit(1);
  }
  if (viewOptimizations == null) {
    console.error('Entry', file, 'must list functions to view optimizations!');
    process.exit(1);
  }

  // Feed type info
  for (let i = 0; i < 1e3; i++) main();

  // Optimize all
  for (const name in viewOptimizations)
    %OptimizeFunctionOnNextCall(viewOptimizations[name]);
  %OptimizeFunctionOnNextCall(main);

  // Run again to view optimizations status
  main();

  for (const name in viewOptimizations)
    printOptimizationStatus(name, viewOptimizations[name]);
})();