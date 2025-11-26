#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, '..', 'dist');

function removeDir(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach((file) => {
      const curPath = path.join(dirPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        removeDir(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(dirPath);
  }
}

console.log('Cleaning dist directory...');
removeDir(distPath);
console.log('Clean complete.');
