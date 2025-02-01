#!/usr/bin/env sh
set -e
git checkout --orphan gh-pages
git --work-tree dist add --all
git --work-tree dist commit -m 'Deploy'
git push origin HEAD:gh-pages --force
git checkout -f main
rm -r dist