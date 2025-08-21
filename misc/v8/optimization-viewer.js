// http://git.nfp.is/TheThing/flaska/src/branch/master/benchmark/compiler/utils.mjs
export const printOptimizationStatus = (name, fn) => {
  console.log('----------------------------------------------');
  console.log(name + ':');

  let opt = %GetOptimizationStatus(fn);
  console.log(`${opt.toString(2).padStart(17, '0').split('').join(' ')} (${opt})`);
  console.log(`┬ ┬ ┬ ┬ ┬ ┬ ┬ ┬ ┬ ┬ ┬ ┬ ┬ ┬ ┬ ┬ ┬
│ │ │ │ │ │ │ │ │ │ │ │ │ │ │ │ └─╸ is function
│ │ │ │ │ │ │ │ │ │ │ │ │ │ │ └───╸ is never optimized
│ │ │ │ │ │ │ │ │ │ │ │ │ │ └─────╸ is always optimized
│ │ │ │ │ │ │ │ │ │ │ │ │ └───────╸ is maybe deoptimized
│ │ │ │ │ │ │ │ │ │ │ │ └─────────╸ is optimized
│ │ │ │ │ │ │ │ │ │ │ └───────────╸ is optimized by TurboFan
│ │ │ │ │ │ │ │ │ │ └─────────────╸ is interpreted
│ │ │ │ │ │ │ │ │ └───────────────╸ is marked for optimization
│ │ │ │ │ │ │ │ └─────────────────╸ is marked for concurrent optimization
│ │ │ │ │ │ │ └───────────────────╸ is optimizing concurrently
│ │ │ │ │ │ └─────────────────────╸ is executing
│ │ │ │ │ └───────────────────────╸ topmost frame is turbo fanned
│ │ │ │ └─────────────────────────╸ lite mode
│ │ │ └───────────────────────────╸ marked for deoptimization
│ │ └─────────────────────────────╸ baseline
│ └───────────────────────────────╸ topmost frame is interpreted
└─────────────────────────────────╸ topmost frame is baseline`);
}

const file = process.argv[2];
if (file == null) {
  console.log(`Usage: bun view:opt [file]`);
  process.exit(1);
}

(async () => {
  const { main, viewOptimizations } = await import('./src/' + file + '.js');
  if (main == null) {
    console.error('Entry', file, 'must exports a main function!');
    process.exit(1);
  }
  if (viewOptimizations == null) {
    console.error('Entry', file, 'must list functions to view optimizations!');
    process.exit(1);
  }

  main();
  for (const name in viewOptimizations)
    printOptimizationStatus(name, viewOptimizations[name]);
})();