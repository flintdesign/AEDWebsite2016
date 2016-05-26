'use strict';

// include the required packages.
var gulp = require('gulp');
var stylus = require('gulp-stylus');
var sourcemaps = require('gulp-sourcemaps');

var paths = {
  stylusMain: ["source/css/main.styl"]
};

gulp.task('stylus', function () {
  gulp.src('source/css/main.styl')
    .pipe(sourcemaps.init())
    .pipe(stylus({
      compress: true
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/css'));
});

gulp.task('watch', function() {
  gulp.watch(paths.stylusMain, ['stylus']);
});


// Default gulp task to run
gulp.task('default', ['watch']);
