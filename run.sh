#!/usr/bin/env bash
bun build.ts

fnm use 22 --install-if-missing
bun index.ts node

fnm use 23 --install-if-missing
bun index.ts node

fnm use 24 --install-if-missing
bun index.ts node

bun upgrade
bun index.ts bun

deno upgrade
bun index.ts deno

bun jsvu --engines=v8,javascriptcore
bun index.ts v8
bun index.ts jsc
