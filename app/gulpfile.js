'use strict';

var gulp = require('gulp'),
    debug = require('gulp-debug'),
    inject = require('gulp-inject'),
    ts = require('gulp-typescript'),
    tslint = require('gulp-tslint'),
    tsd = require('gulp-tsd'),
    sourcemaps = require('gulp-sourcemaps'),
    del = require('del'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    gutil = require('gulp-util'),
    karmaServer = require('karma').Server,
    Config = require('./gulpfile.config');

var testBuildTasks = ['ts-lint', 'compile-ts', 'run-tests'];
var debugBuildTasks = ['ts-lint', 'compile-ts'];
var prodBuildTasks = ['ts-lint', 'compile-ts' ];

// Supported environments:  'test', 'debug', 'production'
var environment = function() {
  if (process.argv.length < 3) {
    return 'test';
  }

  switch(process.argv[2]) {
    case 'test':
    case 'debug':
    case 'production':
      return process.argv[2];

    default:
      gutil.log('ERROR: unrecognized build type specified: ' + process.argv[2]);
      return null;
  }
}();

if (!environment) {
  process.exit();
}

var config = null;
var buildTasks = null;     // tasks to perform on each build cycle
var buildTasksRet = null;  // tasks to return back to system when Gulp is first initiated

configureBuild();

function configureBuild() {
  config = new Config(environment);

  switch(environment) {
    case 'test':
      buildTasks = testBuildTasks;
      buildTasksRet = ['check-tsd'].concat(buildTasks).concat(['watch']);
      break;

    case 'debug':
      buildTasks = debugBuildTasks;
      buildTasksRet = ['check-tsd'].concat(buildTasks);
      break;

    default:
      buildTasks = prodBuildTasks;
      buildTasksRet = ['check-tsd'].concat(buildTasks);
      break;
  }
  return buildTasksRet;
}



/**
 * Verifies that we have all the external typing files (*.tsd)
 */
var tsdChecked = false;
gulp.task('check-tsd', function (callback) {

    if (tsdChecked) {
      gutil.log('TSD files aleady checked for this session.');
      callback();
      return;
    }

    tsd({
        command: 'reinstall',
        config: './tsd.json'
    }, callback);

    tsdChecked = true;
});


/**
 * Lint all custom TypeScript files.
 */
gulp.task('ts-lint', ['check-tsd'], function () {
    return gulp.src(config.inputTypeScript)
      .pipe(tslint())
      .pipe(tslint.report('prose'));
});

/**
 * Compile TypeScript into single, combined JavaScript file and create minified version
 */
gulp.task('compile-ts', ['check-tsd'], function () {
    var tsProject = ts.createProject(config.typeScriptProjectFile);

    var tsResult = tsProject.src()
      .pipe(sourcemaps.init())
      .pipe(ts(tsProject));

    tsResult.dts
      .pipe(gulp.dest('./scripts/'));

    return tsResult.js
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('./scripts/'));
});

/**
 * Minify post-transpiled Javascript file
 */
gulp.task('minify-js', ['compile-ts'], function () {
    return gulp.src(config.tsOutputCombinedFilePath)
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .pipe(rename(config.tsOutputCombinedName + '.min.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.tsOutputPath));
});

/**
 * Run unit tests from post-transpiled Javascript file
 */
gulp.task('run-tests', ['compile-ts'], function (done) {
  new karmaServer({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

/**
 * Remove all generated JavaScript files from TypeScript compilation
 */
gulp.task('clean-ts', function (cb) {
  var typeScriptGenFiles = [config.tsOutputPath,             // path to generated JS files
                            config.outputJavaScript,         // path to all JS files auto gen'd by editor
                            config.outputJavaScript +'.map'  // path to all sourcemap files auto gen'd by editor
                           ];

  // delete the files
  del(typeScriptGenFiles, cb);
});

/**
 * Watch TypeScript files for modification, re-run build tasks when detected
 */
gulp.task('watch', function() {
    gulp.watch(config.inputTypeScript, buildTasks);
});


/**
 * External wrapper tasks
 */

gulp.task('default', buildTasksRet);
gulp.task('test', buildTasksRet);
gulp.task('debug', buildTasksRet);
gulp.task('production', buildTasksRet);

