'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var serve = require('gulp-serve');

var del = require('del');
var mainBowerFiles = require('main-bower-files');
var karma = require('karma').server;
var stylus = require('gulp-stylus');
var nib = require('nib');

gulp.task('lint', function () {
  return gulp.src(['src/scripts/**/*.js'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('test', ['default'], function (done) {
  del(['./coverage']);
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    browsers: ['PhantomJS'],
    reporters: ['progress', 'coverage'],
    coverageReporter: {
      type: 'lcov',
      dir: 'coverage/',
      subdir: '.'
    },
    preprocessors: {
      'build/scripts/**/*.js': ['coverage']
    },
    singleRun: true
  }, done);
});

gulp.task('tdd', function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js'
  }, done);
});

gulp.task('clean', function (cb) {
  del(['build'], cb);
});

gulp.task('serve', serve('build'));

gulp.task('bowerfiles', function () {
  return gulp.src(mainBowerFiles())
    .pipe(gulp.dest('./build/lib'));
});

gulp.task('scripts', ['lint'], function () {
  gulp.src('./src/scripts/**/*.js')
    .pipe(gulp.dest('./build/scripts'));
});

gulp.task('views', function () {
  gulp.src('./src/views/**/*.html')
    .pipe(gulp.dest('./build/views'));

  gulp.src('./src/index.html')
    .pipe(gulp.dest('./build'));
});

gulp.task('styles', function () {
  gulp.src('./src/styles/**/*.styl')
    .pipe(stylus({ use: [nib()] }))
    .pipe(gulp.dest('./build/styles'));
});

gulp.task('watch', function () {
  gulp.watch('./src/styles/**/*.styl', ['styles']);
  gulp.watch('./src/scripts/**/*.js', ['scripts']);
  gulp.watch(['./src/views/**/*.html', './src/index.html'], ['views']);
});

gulp.task('copyFiles', ['bowerfiles', 'scripts', 'styles', 'views']);

gulp.task('developClient', ['copyFiles', 'watch', 'serve']);

gulp.task('develop', ['developClient', 'tdd']);

gulp.task('default', ['copyFiles']);
