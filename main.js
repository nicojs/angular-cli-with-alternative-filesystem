const path = require('path');
const webpack = require('webpack');
const webpackConfig = require('./webpack.conf');
const AngularCompilerPlugin = require('@ngtools/webpack/src/angular_compiler_plugin').AngularCompilerPlugin;
const ReplaceNodeOperation = require('@ngtools/webpack/src/transformers/interfaces').ReplaceNodeOperation;
const makeTransform = require('@ngtools/webpack/src/transformers/make_transform').makeTransform;
const ts = require('typescript');
const fs = require('fs');

const angularPlugin = webpackConfig.plugins.find(plugin => plugin instanceof AngularCompilerPlugin);

const appComponentFileName = path.resolve(__dirname, 'src', 'app', 'app.component.ts');
let appComponentContent = fs.readFileSync(appComponentFileName, 'utf8');

function sourceFileTransformer(sourceFile) {
  const resolvedName = appComponent.replace(/\\/g, '/');
  if (sourceFile.fileName === resolvedName) {
    return [new ReplaceNodeOperation(sourceFile, sourceFile, ts.createSourceFile(sourceFile.fileName, appComponentContent, ts.ScriptKind.TS))];
  } else {
    return [];
  }
}

// angularPlugin._transformers.unshift(makeTransform(sourceFileTransformer));

const compiler = webpack(webpackConfig);
const inputFS = compiler.inputFileSystem;
const originalReadFile = inputFS.readFile;
inputFS.readFile = function (name, optionalArgs, callback) {
  if (name === appComponentFileName) {
    if (!callback) {
      callback = optionalArgs;
    }
    callback(null, appComponentContent);
  } else {
    originalReadFile.apply(inputFS, [name, optionalArgs, callback]);
  }
}

compiler.run(() => {
  console.log('Done ... 1');

  setTimeout(() => {
    appComponentContent = 'alert("hello world")';
    compiler.run(() => {
      console.log('Done ... 2');
    });
  }, 1000);

});
