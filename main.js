const path = require('path');
const webpack = require('webpack');
const webpackConfig = require('./webpack.conf');

const compiler = webpack(webpackConfig);
const fs = compiler.inputFileSystem;
const originalReadFile = fs.readFile;
fs.readFile = function (name, optionalArgs, callback) {
  if (name === path.resolve(__dirname, 'src', 'app', 'app.component.ts')) {
    if (!callback) {
      callback = optionalArgs;
    }
    callback(null, `alert('hello world!')`);
  } else {
    originalReadFile.apply(fs, [name, optionalArgs, callback]);
  }
}

compiler.run(() => {
  console.log('Done');
});
