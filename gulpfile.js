'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var path = require('path');
var del = require('del');
var connect = require('gulp-connect');
var livereload = require('gulp-livereload');
var react = require('gulp-react');
var eslint = require('gulp-eslint');

// From tutorial: http://tylermcginnis.com/reactjs-tutorial-pt-2-building-react-applications-with-gulp-and-browserify/
var uglify = require('gulp-uglify');
var htmlreplace = require('gulp-html-replace');
var source = require('vinyl-source-stream');

var watchify = require('watchify');
var browserify = require('browserify');

var reactify = require('reactify');

var streamify = require('gulp-streamify');

var babel = require('gulp-babel');
var babelify = require('babelify');

var stylus = require('gulp-stylus');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');

var size = require('gulp-size');


// NOTE: 
// - livereload is about triggering a browser refresh over websockets.
// - nodemon is about watching and retriggering node.  In our setup, it watches
//   the build directory for changes (and cascades the change event to 
//   livereload).
// - watchify is about scanning js files, tracing the (static) require 
//   statements, and detecting changes.
// - gulp.watch just simply watches pathes in roughly the way you might naively 
//   expect

// SEE https://github.com/PixelsCommander/ReactiveElements/blob/master/demo/index.html

gulp.task('clean', [], function(callback) {
    del(['./build/*', '../USSC_CartWS/USSC_CartWS/cart-widget/*'], callback);
});

gulp.task('connect', function() {
  connect.server({
    port:           8080,
    root:           './index',
    livereload:     true
  });
  connect.server({
    port:           8081,
    root:           './build',
    livereload:     true
  });
});

gulp.task('reload', function () {
  connect.reload();
});

gulp.task('css', function() {
    return gulp.src('src/**/*.styl')
        .pipe(sourcemaps.init())
        .pipe(stylus())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build'))
        .pipe(gulp.dest('../USSC_CartWS/USSC_CartWS/cart-widget'))
        .pipe(gulp.dest('../USSC_Registration_Encrypted/USSC/cartwidget'));
});

gulp.task('copy-index', function() {
    gulp.src('./src/**/*.html').pipe(gulp.dest('../USSC_Registration_Encrypted/USSC/cartwidget'));
    gulp.src('./src/**/*.html').pipe(gulp.dest('./index'));
    gulp.src('./src/optisite.css').pipe(gulp.dest('./index'));
});

gulp.task('copy-assets', ['copy-index'], function() {
    var files = [
        './src/**/*.js',
        './node_modules/jquery/dist/jquery.js',
        './node_modules/react/dist/react.js',
        './node_modules/js-cookie/src/js.cookie.js',
    ];
    gulp.src(files)
    .pipe(gulp.dest('build'))
    .pipe(gulp.dest('../USSC_CartWS/USSC_CartWS/cart-widget'))
    .pipe(gulp.dest('../USSC_Registration_Encrypted/USSC/cartwidget'));
});

gulp.task('transpile-js', function() {
    return gulp.src('./src/**/*.jsx')
    .pipe(react({harmony: true}))
    .pipe(gulp.dest('build'))
    .pipe(gulp.dest('../USSC_CartWS/USSC_CartWS/cart-widget'))
    .pipe(gulp.dest('../USSC_Registration_Encrypted/USSC/cartwidget'));
})

gulp.task('lint', function () {
    return gulp.src(['./build/**/*.js'])
        // eslint() attaches the lint output to the eslint property 
        // of the file object so it can be used by other modules. 
        .pipe(eslint())
        // eslint.format() outputs the lint results to the console. 
        // Alternatively use eslint.formatEach() (see Docs). 
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on 
        // lint error, return the stream and pipe to failOnError last. 
        .pipe(eslint.failOnError());
});

gulp.task('recompile', ['css', 'copy-assets', 'transpile-js'], function () {

});

gulp.task('watch', ['css', 'copy-assets', 'transpile-js', 'connect'], function () {
    gulp.watch(['./src/**/*.html', './src/**/*.js', './src/**/*.jsx', './src/**/*.styl'],['clean', 'recompile']).on('change', livereload.changed);
});

gulp.task('default', ['clean', 'watch']);

