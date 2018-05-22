var gulp = require('gulp');
var rename = require('gulp-rename'); // Gulp-rename is a gulp plugin to rename files easily.
var sass = require('gulp-sass'); // Sass plugin for Gulp.
var csso = require('gulp-csso'); // Minify CSS with CSSO.
var prefixer = require('gulp-autoprefixer'); // Prefix CSS with Autoprefixer
var plumber = require('gulp-plumber');

gulp.task('styles', function () {
  var sassOptions = {
    outputStyle: 'expanded'
  };
  var prefixerOptions = {
    browsers: ['last 2 versions']
  };
  return gulp.
  src('source/scss/site.scss').
  pipe(plumber()).
  pipe(sass(sassOptions)).
  pipe(prefixer(prefixerOptions)).
  pipe(csso()).
  pipe(rename('quote.css')).
  pipe(gulp.dest('public/css'));
});

gulp.task('javascript', function () {
  return gulp.
  src('source/js/site.js').
  pipe(plumber()).
  pipe(rename('site.js')).
  pipe(gulp.dest('public/js'));
});

gulp.task('watch', function () {
  gulp.watch('source/scss/**/*.scss', gulp.series('styles'));
  gulp.watch('source/js/**/*.js', gulp.series('javascript'));
});

gulp.task('default', gulp.series('javascript', 'styles', 'watch'));

gulp.task('build', gulp.series('javascript', 'styles'));