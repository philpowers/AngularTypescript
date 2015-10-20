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
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    minifyCss = require('gulp-minify-css'),
    gutil = require('gulp-util'),
    karmaServer = require('karma').Server,
    Config = require('./gulpfile.config');

var devBuildTasks = ['ts-lint', 'compile-tests', 'run-tests', 'compile-app'];
var testBuildTasks = ['ts-lint', 'compile-tests', 'run-tests'];
var debugBuildTasks = ['ts-lint', 'compile-app'];
var prodBuildTasks = ['ts-lint', 'compile-app', 'minify-app', 'package-app' ];

// Supported environments:  'dev', 'test', 'debug', 'production'
var environment = function() {
  if (process.argv.length < 3) {
    return 'dev';
  }

  switch(process.argv[2]) {
    case 'dev':
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

    case 'dev':
      buildTasks = devBuildTasks;
      buildTasksRet = ['check-tsd'].concat(buildTasks).concat(['watch']);
      break;

    case 'test':
      buildTasks = testBuildTasks;
      buildTasksRet = ['check-tsd'].concat(buildTasks);
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
 * Verifies that we have all the external typing files (*.d.ts)
 */
var tsdChecked = false;
gulp.task('check-tsd', function (callback) {

    if (tsdChecked) {
      //gutil.log('TSD files aleady checked for this session.');
      callback();
      return;
    }

    gutil.log('Reinstalling external TypeScript definitions.');

    tsd({
        command: 'reinstall',
        config: './ts/tsd.json'
    }, callback);

    tsdChecked = true;
});


/**
 * Lint all custom TypeScript files.
 */
gulp.task('ts-lint', ['check-tsd'], function () {
    return gulp.src(config.testsBuildInfo.tsInputFiles)
      .pipe(tslint())
      .pipe(tslint.report('prose'));
});

/**
 * Compile TypeScript app into single, combined JavaScript
 */
gulp.task('compile-app', ['check-tsd'], function () {
    var tsProject = ts.createProject(config.appBuildInfo.tsProjectFile);

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
gulp.task('minify-app', ['compile-app'], function () {

    var outputCombinedFilePath = config.tsOutputPath + '/' + config.appBuildInfo.outputCombinedName + '.js';
    var minifyFileName = config.appBuildInfo.outputCombinedName + '.min.js';

    return gulp.src(outputCombinedFilePath)
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .pipe(rename(minifyFileName))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.tsOutputPath));
});

gulp.task('clean-dist', function (cb) {
  gutil.log('clean-dist: enter');
  var distFiles = [ './dist/**/*' ];

  // delete the files
  return del(distFiles, cb);
});

gulp.task('bundle-app', ['clean-dist', 'compile-app'], function() {
    var assets = useref.assets();

    return gulp.src('./*.html')
        .pipe(assets)
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest('dist'));
});

/* - this is necessary for distributing/packaging Bootstrap
gulp.task('copyfonts-app', ['clean-dist'], function() {
    return gulp.src('./bower_components/bootstrap/dist/fonts/**.*') 
        .pipe(gulp.dest('./dist/fonts'));
 });
*/

gulp.task('copydeps-app', ['clean-dist'], function() {
    var filesToCopy = [
      './views/**/*'
    ]

    return gulp.src(filesToCopy, { base: './' })
      .pipe(gulp.dest('dist'));
});

gulp.task('package-app', ['bundle-app', 'copydeps-app' /*, 'copyfonts-app' */], function() {
  return gutil.noop();
});

/**
 * Compile TypeScript tests into single, combined JavaScript
 */
gulp.task('compile-tests', ['check-tsd'], function () {
    var tsProject = ts.createProject(config.testsBuildInfo.tsProjectFile);

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
 * Run unit tests from post-transpiled Javascript file
 */
gulp.task('run-tests', ['compile-tests'], function (done) {
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
    gulp.watch(config.testsBuildInfo.tsInputFiles, buildTasks);
});


/**
 * External wrapper tasks
 */

gulp.task('default', buildTasksRet);
gulp.task('dev', buildTasksRet);
gulp.task('test', buildTasksRet);
gulp.task('debug', buildTasksRet);
gulp.task('production', buildTasksRet);

