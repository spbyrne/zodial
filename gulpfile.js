var gulp = require('gulp');
var clean = require('gulp-rimraf');
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
var realFavicon = require('gulp-real-favicon');
var fs = require('fs');

var date = new Date();
var siteData = JSON.parse(fs.readFileSync('site.json', 'utf8'));
siteData.year = date.getFullYear();

var sassOptions = {
  outputStyle: 'expanded'
};

var prefixerOptions = {
  browsers: ['last 4 versions']
};

var cssImportOptions = {
  filter: /^https:\/\//gi // process only https imports
};

var FAVICON_DATA_FILE = 'source/img/favicon/settings.json';

function globalData() {
  return {
    site_title: siteData.site_title,
    site_color: siteData.site_color,
    site_description: siteData.site_description,
    year: date.getFullYear()
  };
}

gulp.task('clean', function () {
  return gulp.src("public/*", {
    read: false
  }).pipe(clean());
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

gulp.task('pages', function () {
  return gulp
    .src('source/pages/*.njk')
    .pipe(data(globalData))
    .pipe(
      nunjucksRender({
        path: ['source/pages/']
      })
    )
    .pipe(realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code))
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest('public'));
});

gulp.task('favicon', function (done) {
  realFavicon.generateFavicon({
    masterPicture: 'source/img/favicon/favicon.png',
    dest: 'public',
    iconsPath: '/',
    design: {
      ios: {
        pictureAspect: 'noChange',
        assets: {
          ios6AndPriorIcons: false,
          ios7AndLaterIcons: false,
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
        themeColor: siteData.site_color,
        manifest: {
          display: 'standalone',
          orientation: 'notSet',
          onConflict: 'override',
          declared: true
        },
        assets: {
          legacyIcon: false,
          lowResolutionIcons: false
        }
      },
      safariPinnedTab: {
        pictureAspect: 'blackAndWhite',
        threshold: 99.21875,
        themeColor: siteData.site_color
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

gulp.task('watch', function () {
  gulp.watch('source/scss/**/*.scss', gulp.series('styles'));
  gulp.watch('source/js/**/*.js', gulp.series('scripts', 'styles'));
  gulp.watch('source/pages/**/*.njk', gulp.series('pages', 'styles'));
  gulp.watch('source/img/*', gulp.series('images'));
  gulp.watch('source/img/favicon/*', gulp.series('favicon'));
});

gulp.task(
  'default',
  gulp.series(gulp.series('clean', 'scripts', 'favicon', 'pages', 'styles', 'images'), 'watch')
);

gulp.task('build', gulp.series('clean', 'scripts', 'favicon', 'pages', 'styles', 'images'));