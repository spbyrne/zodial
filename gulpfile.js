var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var nodemon = require('gulp-nodemon');
var rename = require('gulp-rename'); // Gulp-rename is a gulp plugin to rename files easily.
var sass = require('gulp-sass'); // Sass plugin for Gulp.
var uglify = require('gulp-uglify'); // Minify JavaScript with UglifyJS3.
var csso = require('gulp-csso'); // Minify CSS with CSSO.
var prefixer = require('gulp-autoprefixer'); // Prefix CSS with Autoprefixer
var nunjucksRender = require('gulp-nunjucks-render'); // Render Nunjucks templates
var htmlmin = require('gulp-htmlmin'); // gulp plugin to minify HTML.

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
    .pipe(csso())
    .pipe(gulp.dest('public/css'));
});

gulp.task('javascript', function() {
  return gulp
    .src('source/js/site.js')
    .pipe(uglify())
    .pipe(rename('site.js'))
    .pipe(gulp.dest('public/js'));
});

gulp.task('pages', function() {
  return gulp
    .src('source/pages/*.njk')
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
  gulp.watch('source/js/**/*.js', gulp.series('javascript'));
  gulp.watch('source/pages/**/*.njk', gulp.series('pages'));
});

gulp.task('default', gulp.series('watch'));

gulp.task('nodemon', function(cb) {
  var called = false;
  return nodemon({
    script: 'server.js',
    ignore: ['gulpfile.js', 'node_modules/']
  })
    .on('start', function() {
      if (!called) {
        called = true;
        cb();
      }
    })
    .on('restart', function() {
      setTimeout(function() {
        reload({ stream: false });
      }, 1000);
    });
});

gulp.task('browser-sync', gulp.series('nodemon'), function() {
  browserSync({
    proxy: 'localhost:3000', // local node app address
    port: 5000, // use *different* port than above
    notify: true
  });
});

gulp.task('serve', gulp.series('browser-sync'), function() {
  gulp.watch('public/*.html', reload);
});
