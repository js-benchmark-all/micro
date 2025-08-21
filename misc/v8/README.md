### Resources
- Native functions (enable with `--allow-natives-syntax`): https://github.com/v8/v8/blob/main/src/runtime/runtime.h#L582
- Deopt reasons: https://github.com/v8/v8/blob/main/src/deoptimizer/deoptimize-reason.h

### Scripts
```sh
bun view:opt:node [target] # View optimization status of exported functions of a target using node
bun view:opt:deno [target] # View optimization status of exported functions of a target using deno

bun view:deopt [target] # Create deoptimization log of a target
```
- `[target]`: file name without `.js` extension in [src](./src).

Deopt logs are in `./.deopt-logs` can be viewed with [deoptexplorer-vscode](https://github.com/microsoft/deoptexplorer-vscode) or [Indicium](https://v8.github.io/tools/head/system-analyzer/index.html).

### Utils
Utilities for retrieving tag trees are in [utils.ts](./utils.ts).
