# AngularTypescript
Fully-functional, minimal seed project for Angular 1.x using TypeScript.

Features a Gulp-based build process that automates the development as much as possible.

## Features
1. [TypeScript](http://typescriptlang.org) for [Angular 1.x](https://angularjs.org/) development
2. Unit Tests using [Jasmine](http://jasmine.github.io/).
3. Support for building in Test, Debug or Production modes.
4. Support for minifying using [UglifyJS](https://github.com/mishoo/UglifyJS).
5. Support for retrieving type definitions using [DefinitelyTyped TSD](http://definitelytyped.org/tsd/)
6. Runs unit tests automatically using [Karma](http://karma-runner.github.io/).
7. Gulp-based build with support for multiple build configurations and rebuilding on file changes - based on [Dan Wahlin's TypeScript Workflow](http://weblogs.asp.net/dwahlin/creating-a-typescript-workflow-with-gulp)
8. [Angular UI Router](https://github.com/angular-ui/ui-router).
9. Support for bundling all CSS and JavaScript files into separate "dist" directory for running on production servers using [gulp-useref](https://github.com/jonkemp/gulp-useref)
10. Cache-busting support for bundled resources using [gulp-rev-all](https://github.com/smysnk/gulp-rev-all)


## Installation

1. Clone to your local machine.
2. Run following commands from cloned directory (assumes you already have npm/NodeJS and Bower installed globally):
  - cd app
  - npm install
  - bower install

## Building
  - gulp <"test" | "debug" | "production">
    - No arguments to put into "test" (development) mode (auto-watch + unit tests enabled)
    - "debug" to create build intended for debugging (no minification, etc)
    - "production" to create build intended for production.

