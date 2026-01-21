import pc from "picocolors";

const VERSION = process.versions.v8.split("-", 1)[0];

// http://git.nfp.is/TheThing/flaska/src/branch/master/benchmark/compiler/utils.mjs
// To find status codes, navigate to https://github.com/v8/v8/blob/<VERSION-COMMIT>/test/mjsunit/mjsunit.js
const STATUS_MAP = {
  "13.6.233.10": [
    "is function",
    "never optimized (--no-turbofan)",
    "always optimized (--always-turbofan)",
    "maybe deopted",
    "optimized",
    "maglevved",
    "turbofanned",
    "interpreted",
    "marked for optimization",
    "marked for concurrent optimization",
    "optimizing concurrently",
    "is executing",
    "topmost frame is turbofanned",
    "cannot optimize (--lite-mode)",
    "marked for deoptimization",
    "in baseline",
    "topmost frame is interpreted",
    "topmost frame is baseline",
    "is lazily compiled",
    "topmost frame is maglevved",
    "optimize on next call optimizes to maglev",
    "optimize maglev optimizes to turbofan",
    "marked for maglev optimization",
    "marked for concurrent maglev optimization",
  ],
  "13.7.152.14": "13.6.233.10",
};

let STATUS = STATUS_MAP[VERSION];
typeof STATUS === "string" && (STATUS = STATUS_MAP[STATUS]);

if (STATUS == null) {
  console.error("unsupported V8 version:", VERSION);
  console.error("supported versions are:", Object.keys(STATUS_MAP));
  process.exit(1);
}

const printOptimizationStatus = (name, fn) => {
  console.log(
    pc.bold(name),
    "(" +
      (%ActiveTierIsIgnition(fn)
        ? "ignition"
        : %ActiveTierIsSparkplug(fn)
          ? "sparkplug"
          : %ActiveTierIsMaglev(fn)
            ? "maglev"
            : %ActiveTierIsTurbofan(fn)
              ? "turbofan"
              : "unknown") +
      ")",
  );
  for (let pos = 0, opt = %GetOptimizationStatus(fn); opt > 0; pos++) {
    if (opt & 1) console.log("- " + STATUS[pos]);
    opt >>= 1;
    pos++;
  }
};

const file = process.argv[2];
if (file == null) {
  console.log(`Usage: bun view:opt:[runtime] [file]`);
  process.exit(1);
}

(async () => {
  console.log("v8:", VERSION);

  const { main, viewOptimizations } = await import("./src/" + file + ".js");
  if (main == null) {
    console.error("Entry", file, "must exports a main function!");
    process.exit(1);
  }
  if (viewOptimizations == null) {
    console.error("Entry", file, "must list functions to view optimizations!");
    process.exit(1);
  }

  // Warmup runs
  for (let i = 0; i < 1e3; i++) main();

  // Optimize all
  for (const name in viewOptimizations)
    %OptimizeFunctionOnNextCall(viewOptimizations[name]);

  // Run again to view optimizations status
  for (let i = 0; i < 1e3; i++) main();

  for (const name in viewOptimizations)
    printOptimizationStatus(name, viewOptimizations[name]);
})();
