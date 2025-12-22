#!/usr/bin/env bash
bun prep

fnm use 22 --install-if-missing
bun start node file

fnm use 23 --install-if-missing
bun start node file

fnm use 24 --install-if-missing
bun start node file

bun upgrade
bun start bun file

deno upgrade
bun start deno file
