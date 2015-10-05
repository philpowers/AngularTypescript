'use strict';

var GulpConfig = function(environment) {
    this.tsSourceRoot = './ts';
    this.tsOutputPath = './scripts';
    this.typings = this.tsSourceRoot + './typings/';
    this.typeScriptProjectFile = this.tsSourceRoot + '/tsconfig.json';

    this.inputTypeScript = [this.tsSourceRoot + '/**/*.ts'];
    this.outputJavaScript = [this.tsOutputPath + '/**/*.js'];
    this.libraryTypeScriptDefinitions = './typings/**/*.ts';

    switch(environment) {
        case 'test':
		    this.tsOutputCombinedName = 'app-tests';
            this.typeScriptProjectFile = this.tsSourceRoot + '/tsconfig-withtests.json';
            break;
        default:
        	this.inputTypeScript.push('!' + this.tsSourceRoot + '/tests/**/*.ts')
		    this.tsOutputCombinedName = 'app';
            this.typeScriptProjectFile = this.tsSourceRoot + '/tsconfig-notests.json';
            break;
    }

    this.tsOutputCombinedFilePath = this.tsOutputPath + '/' + this.tsOutputCombinedName + '.js';
};

module.exports = GulpConfig;
