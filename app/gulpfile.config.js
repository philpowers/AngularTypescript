'use strict';

var GulpConfig = function(environment) {
    this.tsSourceRoot = './ts';
    this.tsOutputPath = './scripts';
    this.typings = this.tsSourceRoot + './typings/';

    this.outputJavaScript = [this.tsOutputPath + '/**/*.js'];
    this.libraryTypeScriptDefinitions = './typings/**/*.ts';

    this.appBuildInfo = {
        tsInputFiles: [this.tsSourceRoot + '/**/*.ts', '!' + this.tsSourceRoot + '/tests/**/*.ts'],
        tsProjectFile: this.tsSourceRoot + '/tsconfig-notests.json',
        outputCombinedName: 'app'
    }

    this.testsBuildInfo = {
        tsInputFiles: [this.tsSourceRoot + '/**/*.ts'],
        tsProjectFile: this.tsSourceRoot + '/tsconfig-withtests.json',
        outputCombinedName: 'app-tests'
    }
};

module.exports = GulpConfig;
