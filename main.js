const path = require('path');
const webpack = require('webpack');
const webpackConfig = require('./webpack.conf');
const AngularCompilerPlugin = require('@ngtools/webpack/src/angular_compiler_plugin').AngularCompilerPlugin;
const ReplaceNodeOperation = require('@ngtools/webpack/src/transformers/interfaces').ReplaceNodeOperation;
const makeTransform = require('@ngtools/webpack/src/transformers/make_transform').makeTransform;
const ts = require('typescript');

const angularPlugin = webpackConfig.plugins.find(plugin => plugin instanceof AngularCompilerPlugin);

const appComponent = path.resolve(__dirname, 'src', 'app', 'app.component.ts');

function sourceFileTransformer(sourceFile) {
  const resolvedName = appComponent.replace(/\\/g, '/');
  if (sourceFile.fileName === resolvedName) {
    return [new ReplaceNodeOperation(sourceFile, sourceFile, ts.createSourceFile(sourceFile.fileName, `alert('hello world!')`, ts.ScriptKind.TS))];
  } else {
    return [];
  }
}

angularPlugin._transformers.unshift(makeTransform(sourceFileTransformer));

const compiler = webpack(webpackConfig);
const fs = compiler.inputFileSystem;
const originalReadFile = fs.readFile;
fs.readFile = function (name, optionalArgs, callback) {
  if (name === appComponent) {
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
