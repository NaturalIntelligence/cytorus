#!/bin/bash

cd ..
version=$(node -e 'console.log(require("./package.json").version)')
npm pack .
cd test-repository
npm install ../cytorus-$version.tgz