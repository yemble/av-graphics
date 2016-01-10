var gulp   = require('gulp'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint');
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    del = require('del');

gulp.task('dist', function() {
    gulp.src('./src/*.js')
      .pipe(jshint())
      .pipe(jshint.reporter())
      .pipe(concat('avgraphics.js'))
      .pipe(gulp.dest('./dist/'))
      .pipe(rename({suffix: '.min'}))
      .pipe(uglify())
      .pipe(gulp.dest('./dist/'));
});

gulp.task('default', [], function() {
    gulp.start('dist');
});
