Micro benchmarks for all runtimes & engines:
- [pick keys from objects](./src/basics/object-pick.case.ts)
- [access objects vs arrays](./src/basics/access.case.ts)
- [object initialization](./src/basics/object-init.case.ts)
- [shallow clone objects & arrays](./src/basics/shallow-clone.case.ts)

Setup:
```sh
# Install all dependencies
bun i

# Build all benchmark files
bun prep

# Run included benchmarks in node and output to stdout
bun start node
bun start node file
```

To add a benchmark create a file with extension `.case.ts` in [src](./src).

Configs:
- Filter out benchmarks: [./lib/filters.ts](./lib/filters.ts).
- Change engine arguments & env input: [./lib/engines.ts](./lib/engines.ts).

To setup JS engines, add `jsvu` binary directory to `PATH`:
```sh
# Add jsvu to PATH
export PATH=$HOME/.jsvu/bin:$PATH

# Install engines
bun jsvu
```
