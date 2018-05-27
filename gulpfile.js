var gulp = require('gulp');
var rename = require('gulp-rename'); // Gulp-rename is a gulp plugin to rename files easily.
var sass = require('gulp-sass'); // Sass plugin for Gulp.
var csso = require('gulp-csso'); // Minify CSS with CSSO.
var prefixer = require('gulp-autoprefixer'); // Prefix CSS with Autoprefixer
var plumber = require('gulp-plumber');
var webmake = require('gulp-webmake'); // Bundles CommonJS and Node.JS modules for web browsers using Gulp.
var include = require("gulp-include"); // Makes inclusion of files a breeze.
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');

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
    pipe(rename('site.css')).
    pipe(gulp.dest('public/css'));
});

gulp.task('javascript', function () {
  return gulp.
    src('source/js/site.js').
    pipe(plumber()).
    pipe(include()).
    pipe(babel({
      presets: ['env']
    })).
    pipe(webmake()).
    pipe(uglify()).
    pipe(rename('site.js')).
    pipe(gulp.dest('public/js'));
});

gulp.task('watch', function () {
  gulp.watch('source/scss/**/*.scss', gulp.series('styles'));
  gulp.watch('source/js/**/*.js', gulp.series('javascript'));
});

gulp.task('default', gulp.series('javascript', 'styles', 'watch'));

gulp.task('build', gulp.series('javascript', 'styles'));