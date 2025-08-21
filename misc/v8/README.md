### Resources
- Native functions (enable with `--allow-natives-syntax`): https://github.com/v8/v8/blob/main/src/runtime/runtime.h#L582
- Deopt reasons: https://github.com/v8/v8/blob/main/src/deoptimizer/deoptimize-reason.h

### Scripts
```sh
bun view:opt [target] # View optimization status of exported functions of a target
bun view:deopt [target] # Create deoptimization log of a target
```
- `[target]`: file name without `.js` extension in [src](./src).

Deopt logs are in `./.deopt-logs` can be viewed with [deoptexplorer-vscode](https://github.com/microsoft/deoptexplorer-vscode) or [Indicium](https://v8.github.io/tools/head/system-analyzer/index.html).