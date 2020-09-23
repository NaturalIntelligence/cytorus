#!/bin/bash

cd ..
npm pack .
cd E2E
npm install ../cytorus-0.0.1.tgz