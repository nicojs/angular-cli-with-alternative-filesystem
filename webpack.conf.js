const angularCliConfig = require('./.angular-cli');
const getAppFromConfig = require('@angular/cli/utilities/app-utils').getAppFromConfig;
const WebpackTestConfig = require('@angular/cli/models/webpack-test-config').WebpackTestConfig;

const appConfig = getAppFromConfig(undefined);

const testConfig = Object.assign({
  environment: 'dev',
  codeCoverage: false,
  sourcemaps: false,
  progress: true,
  preserveSymlinks: false,
});

const webpackConfig = new WebpackTestConfig(testConfig, appConfig).buildConfig();

// Delete global styles entry, we don't want to load them.
delete webpackConfig.entry.styles;
webpackConfig.devtool = false;
module.exports = webpackConfig;
