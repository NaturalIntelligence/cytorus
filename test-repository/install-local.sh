#!/bin/bash

cd ..
npm pack .
cd test-repository
npm install ../cytorus-0.2.6.tgz