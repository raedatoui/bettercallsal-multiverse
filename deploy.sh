#!/bin/bash

# art
yarn clean
TS_NODE_COMPILER_OPTIONS='{"module":"commonjs"}' ts-node scripts/config.ts art
yarn static
rm -rf ../firebase/art/out
mv out ../firebase/art/
cd ../firebase/art
#firebase deploy

# games
cd ../../multiverse
yarn clean
TS_NODE_COMPILER_OPTIONS='{"module":"commonjs"}' ts-node scripts/config.ts games
yarn static
rm -rf ../firebase/games/out
mv out ../firebase/games/
cd ../firebase/games
firebase deploy

# rocks
cd ../../multiverse
yarn clean
TS_NODE_COMPILER_OPTIONS='{"module":"commonjs"}' ts-node scripts/config.ts rocks
yarn static
rm -rf ../firebase/rocks/out
mv out ../firebase/rocks/
cd ../firebase/rocks
firebase deploy

# construction
cd ../../multiverse
yarn clean
TS_NODE_COMPILER_OPTIONS='{"module":"commonjs"}' ts-node scripts/config.ts construction
yarn static
rm -rf ../firebase/construction/out
mv out ../firebase/construction/
cd ../firebase/construction
firebase deploy
