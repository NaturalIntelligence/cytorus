#!/bin/bash

cd ..
npm pack .
cd test-repository
npm install ../cytorus-0.2.1.tgz