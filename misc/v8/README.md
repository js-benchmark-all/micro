V8 specific resources.

Scripts:
```sh
bun view:opt [target] # View optimizations of exported functions of a target
bun view:deopt [target] # Create deoptimization logs of a target
```
- `[target]`: file name without extensions in [src](./src).

Deoptimizations log can be viewed with [deoptexplorer-vscode](https://github.com/microsoft/deoptexplorer-vscode) or [Indicium](https://v8.github.io/tools/head/system-analyzer/index.html).