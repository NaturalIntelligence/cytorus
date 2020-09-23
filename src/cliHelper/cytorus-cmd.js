#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

let cmd = path.join(__dirname, "../.bin/cypress");

try {
    execFileSync(
      cmd,
      [...process.argv.slice(2)],
      {
        stdio: [process.stdin, process.stdout, process.stderr]
      }
    );
} catch (e) {
  console.log("Not able to run cypress", e);
  process.exit(1);
}
