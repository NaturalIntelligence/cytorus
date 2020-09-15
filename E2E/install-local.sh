#!/bin/bash

cd ..
npm pack .
cd E2E
npm install ../cypress-cucumon-runner-1.0.0.tgz