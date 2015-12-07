/*!
 *
 * $ npm install
 * $ gulp
 * $ gulp watch
 */

// Load pluginsconst
const gulp = require('gulp');
const babel = require('gulp-babel');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const minifycss = require('gulp-minify-css');
const eslint = require('gulp-eslint');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const cache = require('gulp-cache');
const scsslint = require('gulp-scss-lint');
const del = require('del');

const browserify = require('browserify');
const watchify = require('watchify');
const babelify = require('babelify');
const rimraf = require('rimraf');
const source = require('vinyl-source-stream');
const _ = require('lodash');
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const buffer = require('vinyl-buffer');
const debowerify = require('debowerify');

var config = {
  entryFile: './js/app.js',
  outputDir: './../dist/scripts/',
  outputFile: 'app.js',
  watchJsFilesMask: ['js/*.js', 'js/*/*.js'],
};

var bundler;
function getBundler() {
  if (!bundler) {
    bundler = watchify(browserify(config.entryFile, _.extend({ debug: true }, watchify.args)));
  }
  return bundler;
}
function bundle() {
  return getBundler()
    .transform(babelify)
    .transform(debowerify)
    .bundle()
    .on('error', function(err) {
      console.log('Error: ' + err.message, err);
    })
    .pipe(source(config.outputFile))
    .pipe(gulp.dest(config.outputDir))
    .pipe(reload({ stream: true }))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.outputDir+'min/'))
    .pipe(reload({ stream: true }));
}


// clean the scripts output directory
gulp.task('clean-scripts', function(cb) {
  rimraf(config.outputDir, cb);
});
gulp.task('build-persistent', ['clean-scripts'], function() {
  return bundle();
});

gulp.task('build', ['build-persistent'], function() {
  process.exit(0);
});

gulp.task('watch', ['build-persistent'], function() {

  browserSync({
    open: false,
    server: {
      baseDir: './'
    },
    socket: {
      domain: 'localhost:3000'//,
      //port: 3000,
      //namespace: function (namespace) {
      //  return "localhost:3000" + namespace;
      //}
    },
    port: 3000
  });
  gulp.watch('sass/*.scss', ['styles']);
  gulp.watch(config.watchJsFilesMask, ['libs-scripts']);
  gulp.watch('libs/*.css', ['libs-styles']);
  gulp.watch('images/*', ['images']);

  getBundler().on('update', function() {
    console.log('update event');
    gulp.start('build-persistent');
    gulp.start('scripts-lint');
  });
});

// Styles
gulp.task('styles', function () {


    return gulp.src('sass/*.scss')
      .pipe(scsslint())
      .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(autoprefixer('last 2 version'))
      .pipe(gulp.dest('../dist/styles'))
      .pipe(rename({suffix: '.min'}))
      .pipe(minifycss())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('../dist/styles'))
      .pipe(browserSync.stream());

});

gulp.task('scripts-lint', function() {
    return gulp.src(config.watchJsFilesMask)
        // eslint() attaches the lint output to the eslint property
        // of the file object so it can be used by other modules.
        .pipe(eslint())
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format());
});


// Libraries - scripts
gulp.task('libs-scripts', function() {
    return gulp.src('libs/*.js')
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(concat('libs.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('../dist/scripts'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest(config.outputDir+'min/'))
        .pipe(browserSync.stream());
});

gulp.task('libs-styles', function() {
    return gulp.src('libs/*.css')
        .pipe(concat('libs.css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss())
        .pipe(gulp.dest('../dist/styles'))
        .pipe(browserSync.stream());
});

// Images
gulp.task('images', function() {
    return gulp.src('images/*')
        .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(gulp.dest('../dist/images'))
        .pipe(browserSync.stream());
});

// Clean
gulp.task('clean', function(cb) {
  rimraf('../dist/styles', function() {
    rimraf('../dist/images', function() {
      rimraf('../dist/scripts', cb);
    });
  });
});

// Default task
gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'build', 'images', 'libs-styles', 'libs-scripts');
});

