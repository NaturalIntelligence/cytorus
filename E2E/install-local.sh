#!/bin/bash

cd ..
npm pack .
cd E2E
npm install ../cytorus-0.1.4.tgz