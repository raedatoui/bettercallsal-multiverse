#!/bin/bash

current_dir=$(pwd)

# Deploy function
deploy() {
  local project=$1
  cd "$current_dir"
  yarn clean
  TS_NODE_COMPILER_OPTIONS='{"module":"commonjs"}' yarn ts-node scripts/config.ts $project
  yarn static
  rm -rf "../firebase/$project/out"
  mv out "../firebase/$project/"
  cd "../firebase/$project"
  firebase deploy
  cd "$current_dir"
}

# Deploy each section
#deploy "biz"
#deploy "art"
#deploy "games"
#deploy "rocks"
#deploy "construction"
#deploy "fit"
#deploy "gallery"
deploy "world"
deploy "fans"
deploy "wtf"

yarn clean
TS_NODE_COMPILER_OPTIONS='{"module":"commonjs"}' yarn ts-node scripts/config.ts "biz"
