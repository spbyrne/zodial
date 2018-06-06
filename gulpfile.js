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
var realFavicon = require('gulp-real-favicon'); // Auto generates favicon images and markup
var fs = require('fs'); // File system access
var image = require('gulp-image'); // Optimize PNG, JPEG, GIF, SVG images with gulp task

var data = JSON.parse(fs.readFileSync('zodiac.json', 'utf8'));
var FAVICON_DATA_FILE = 'source/favicon/favicon-settings.json';

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
  pipe(babel({
    presets: ['env']
  })).
  pipe(include()).
  pipe(webmake()).
  pipe(uglify()).
  pipe(rename('site.js')).
  pipe(gulp.dest('public/js'));
});

gulp.task('images', function () {
  return gulp.
  src('source/img/*').
  pipe(
    image({
      jpegRecompress: false,
      mozjpeg: false,
      quiet: true
    })
  ).
  pipe(gulp.dest('public/img'));
});

gulp.task('favicon', function (done) {
  realFavicon.generateFavicon({
    masterPicture: 'source/favicon/favicon.png',
    dest: 'public',
    iconsPath: '/',
    design: {
      ios: {
        pictureAspect: 'noChange',
        assets: {
          ios6AndPriorIcons: false,
          ios7AndLaterIcons: true,
          precomposedIcons: false,
          declareOnlyDefaultIcon: true
        }
      },
      desktopBrowser: {},
      windows: {
        pictureAspect: 'noChange',
        backgroundColor: '#2d89ef',
        onConflict: 'override',
        assets: {
          windows80Ie10Tile: false,
          windows10Ie11EdgeTiles: {
            small: false,
            medium: true,
            big: false,
            rectangle: false
          }
        }
      },
      androidChrome: {
        pictureAspect: 'shadow',
        themeColor: data.site.color,
        manifest: {
          display: 'standalone',
          orientation: 'notSet',
          onConflict: 'override',
          declared: true
        },
        assets: {
          legacyIcon: true,
          lowResolutionIcons: true
        }
      },
      safariPinnedTab: {
        pictureAspect: 'blackAndWhite',
        threshold: 99.21875,
        themeColor: data.site.color
      }
    },
    settings: {
      scalingAlgorithm: 'Mitchell',
      errorOnImageTooSmall: false,
      readmeFile: false,
      htmlCodeFile: false,
      usePathAsIs: false
    },
    markupFile: FAVICON_DATA_FILE
  }, function () {
    done();
  });
});

gulp.task('favicon-html', function () { // Only run manually; the existing favicon.html file will suffice unless removed. Please go to the file and clean out extra HTML elements after generation
  return gulp
    .src('./views/partials/favicon.html', {
      base: './'
    })
    .pipe(realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code))
    .pipe(gulp.dest('./'));
});

gulp.task('watch', function () {
  gulp.watch('source/scss/**/*.scss', gulp.series('styles'));
  gulp.watch('source/js/**/*.js', gulp.series('javascript'));
  gulp.watch('source/img/*', gulp.series('images'));
});

gulp.task('default', gulp.series('javascript', 'styles', 'watch', 'images'));

gulp.task('build', gulp.series('favicon', 'javascript', 'styles', 'images'));