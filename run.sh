#!/usr/bin/env bash
bun prep

fnm use 22 --install-if-missing
bun start node

fnm use 23 --install-if-missing
bun start node

fnm use 24 --install-if-missing
bun start node

bun upgrade
bun start bun

deno upgrade
bun start deno
