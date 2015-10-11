'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var path = require('path');
var del = require('del');
var connect = require('gulp-connect');
var livereload = require('gulp-livereload');
var react = require('gulp-react');

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
    del(['./build/*'], callback);
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
        .pipe(gulp.dest('./build'));
});

gulp.task('copy-index', function() {
    gulp.src('./src/**/*.html')
        .pipe(gulp.dest('./index'));
});

gulp.task('copy-assets', ['copy-index'], function() {
    var js = './src/**/*.js';
    var dre = './node_modules/document-register-element/build/document-register-element.js';
    var ra = './node_modules/reactive-elements/dist/reactive-elements.js';
    var jq = './node_modules/jquery/dist/jquery.js';
    var react = './node_modules/react/dist/react.js';
    var jsxt = './node_modules/react/dist/JSXTransformer.js';
    var files = [].concat(js, ra, dre, jq, react, jsxt);
    gulp.src(files)
    .pipe(gulp.dest('./build'));
});

gulp.task('transpile-js', function() {
    return gulp.src('./src/**/*.jsx')
    .pipe(react({harmony: true}))
    .pipe(gulp.dest('./build'))
})


gulp.task('recompile', ['css', 'copy-assets', 'transpile-js']);

gulp.task('watch', ['css', 'copy-assets', 'transpile-js', 'connect'], function () {
    gulp.watch(['./src/**/*.js', './src/**/*.jsx'],['clean', 'recompile']).on('change', livereload.changed);
});

gulp.task('default', ['clean', 'watch']);

