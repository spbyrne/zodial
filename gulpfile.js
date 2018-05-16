var gulp = require('gulp');
var data = require('gulp-data');
var rename = require('gulp-rename'); // Gulp-rename is a gulp plugin to rename files easily
var sass = require('gulp-sass'); // Sass plugin for Gulp
var uglify = require('gulp-uglify'); // Minify JavaScript with UglifyJS3
var csso = require('gulp-csso'); // Minify CSS with CSSO
var prefixer = require('gulp-autoprefixer'); // Prefix CSS with Autoprefixer
var nunjucksRender = require('gulp-nunjucks-render'); // Render Nunjucks templates
var htmlmin = require('gulp-htmlmin'); // gulp plugin to minify HTML
var imagemin = require('gulp-imagemin'); // Minify PNG, JPEG, GIF and SVG images with imagemin
var image = require('gulp-image'); // Optimize PNG, JPEG, GIF, SVG images with gulp task
var purify = require('gulp-purifycss'); // Remove unused CSS with PurifyCSS
var size = require('gulp-size'); // Logs out the total size of files in the stream and optionally the individual file-sizes.

var date = new Date();

var sassOptions = {
  outputStyle: 'expanded'
};

var prefixerOptions = {
  browsers: ['last 4 versions']
};

gulp.task('styles', function() {
  return gulp
    .src('source/scss/site.scss')
    .pipe(sass(sassOptions))
    .pipe(prefixer(prefixerOptions))
    .pipe(rename('site.css'))
    .pipe(purify(['./public/js/**/*.js', './public/**/*.html']))
    .pipe(csso())
    .pipe(size())
    .pipe(gulp.dest('public/css'));
});

gulp.task('scripts', function() {
  return gulp
    .src('source/js/site.js')
    .pipe(uglify())
    .pipe(rename('site.js'))
    .pipe(size())
    .pipe(gulp.dest('public/js'));
});

gulp.task('images', function() {
  return gulp
    .src('source/img/*')
    .pipe(imagemin())
    .pipe(size())
    .pipe(
      image({
        quiet: true
      })
    )
    .pipe(size())
    .pipe(gulp.dest('public/img'));
});

function globalData() {
  return {
    site_title: 'Bones',
    meta_description: 'Simple static website generator boilerplate',
    year: date.getFullYear()
  };
}

gulp.task('pages', function() {
  return gulp
    .src('source/pages/*.njk')
    .pipe(data(globalData))
    .pipe(
      nunjucksRender({
        path: ['source/pages/'] // String or Array
      })
    )
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('public'));
});

gulp.task('watch', function() {
  gulp.watch('source/scss/**/*.scss', gulp.series('styles'));
  gulp.watch('source/js/**/*.js', gulp.series('scripts', 'styles'));
  gulp.watch('source/pages/**/*.njk', gulp.series('pages', 'styles'));
  gulp.watch('source/img/**/*', gulp.series('images'));
});

gulp.task(
  'default',
  gulp.series(gulp.series('scripts', 'pages', 'styles', 'images'), 'watch')
);

gulp.task('build', gulp.series('scripts', 'pages', 'styles', 'images'));
