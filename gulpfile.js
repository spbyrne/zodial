var gulp = require('gulp');
var clean = require('gulp-clean'); // Removes files and folders.
var data = require('gulp-data'); // Pipe data to gulp plugins
var rename = require('gulp-rename'); // Gulp-rename is a gulp plugin to rename files easily
var cssimport = require("gulp-cssimport"); // Import several css files into a single file
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
var favicons = require("favicons").stream; // A Node.js module for generating favicons and their associated files.
var gutil = require("gulp-util");

var date = new Date();

var siteData = {
  site_title: 'Bones',
  site_color: '#FFF',
  site_description: 'Simple static website generator boilerplate',
  year: date.getFullYear()
}

var sassOptions = {
  outputStyle: 'expanded'
};

var prefixerOptions = {
  browsers: ['last 4 versions']
};

var cssImportOptions = {
  filter: /^https:\/\//gi // process only https imports
};

var faviconConfig = {
  appName: siteData.site_title,
  appDescription: siteData.site_description,
  background: siteData.site_color,
  path: "public/",
  url: "http://scottbyrne.ca/",
  display: "standalone",
  orientation: "portrait",
  start_url: "/",
  version: 1.0,
  logging: false,
  pipeHTML: false,
  replace: true
}

function globalData() {
  return {
    site_title: siteData.site_title,
    site_color: siteData.site_color,
    site_description: siteData.site_description,
    year: date.getFullYear()
  };
}

gulp.task('clean', function () {
  return gulp.src('./public/**/*', {
      read: false
    })
    .pipe(clean());
});

gulp.task('styles', function () {
  return gulp
    .src('source/scss/site.scss')
    .pipe(cssimport(cssImportOptions))
    .pipe(sass(sassOptions))
    .pipe(prefixer(prefixerOptions))
    .pipe(rename('site.css'))
    .pipe(purify(['./public/js/**/*.js', './public/**/*.html']))
    .pipe(csso())
    .pipe(size())
    .pipe(gulp.dest('public/css'));
});

gulp.task('scripts', function () {
  return gulp
    .src('source/js/site.js')
    .pipe(uglify())
    .pipe(rename('site.js'))
    .pipe(size())
    .pipe(gulp.dest('public/js'));
});

gulp.task('images', function () {
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

gulp.task('favicon', function () {
  return gulp.src("source/img/favicon/favicon.png")
    .pipe(favicons(faviconConfig))
    .on("error", gutil.log)
    .pipe(gulp.dest("./public/"));
});

gulp.task('pages', function () {
  return gulp
    .src('source/pages/*.njk')
    .pipe(data(globalData))
    .pipe(
      nunjucksRender({
        path: ['source/pages/']
      })
    )
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest('public'));
});

gulp.task('watch', function () {
  gulp.watch('source/scss/**/*.scss', gulp.series('styles'));
  gulp.watch('source/js/**/*.js', gulp.series('scripts', 'styles'));
  gulp.watch('source/pages/**/*.njk', gulp.series('pages', 'styles'));
  gulp.watch('source/img/*', gulp.series('images'));
  gulp.watch('source/img/favicon/*', gulp.series('favicon'));
});

gulp.task(
  'default',
  gulp.series(gulp.series('clean', 'scripts', 'pages', 'styles', 'images', 'favicon'), 'watch')
);

gulp.task('build', gulp.series('clean', 'scripts', 'pages', 'styles', 'images', 'favicon'));