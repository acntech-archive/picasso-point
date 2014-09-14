'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var serve = require('gulp-serve');
var coveralls = require('gulp-coveralls');

var del = require('del');
var mainBowerFiles = require('main-bower-files');
var karma = require('karma').server;
var stylus = require('gulp-stylus');
var nib = require('nib');

gulp.task('lint', function () {
  return gulp.src(['client/scripts/**/*.js'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('test', function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    browsers: ['PhantomJS'],
    reporters: ['progress', 'coverage'],
    coverageReporter: {
      type: 'lcov',
      dir: 'coverage/'
    },
    preprocessors: {
      'client/scripts/**/*.js': ['coverage']
    },
    singleRun: true
  }, done);
});

gulp.task('tdd', function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js'
  }, done);
});

gulp.task('coveralls', ['test'], function () {
  return gulp.src('coverage/**/lcov.info')
    .pipe(coveralls());
});

gulp.task('clean', function (cb) {
  del(['build'], cb);
});

gulp.task('serve', serve('client'));

gulp.task('bower-files', function () {
  return gulp.src(mainBowerFiles())
    .pipe(gulp.dest('client/lib'));
});

gulp.task('styles', function () {
  gulp.src('./client/styles/**/*.styl')
    .pipe(stylus({use: [nib()]}))
    .pipe(gulp.dest('./client/styles'));
});

gulp.task('watch', function () {
  gulp.watch('./client/styles/**/*.styl', ['styles']);
});

gulp.task('developClient', ['bower-files', 'watch', 'serve']);

gulp.task('develop', ['developClient', 'tdd']);

gulp.task('default', ['lint']);
