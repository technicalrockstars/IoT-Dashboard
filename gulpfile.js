var gulp         = require('gulp');
var connect      = require('gulp-connect');
var mocha        = require('gulp-mocha');
var plumber      = require('gulp-plumber');
var browserify   = require('browserify');
var source       = require('vinyl-source-stream');
var buffer       = require('vinyl-buffer');
var uglify       = require('gulp-uglify');

var postcss      = require('gulp-postcss');
var nestedcss    = require('postcss-nested');
var atImport     = require('postcss-import');
var cssnano      = require('cssnano');
var simplevars   = require('postcss-simple-vars');
var autoprefixer = require('autoprefixer');
var sourcemaps   = require('gulp-sourcemaps');

var imagemin     = require('gulp-imagemin');
var pngquant     = require('imagemin-pngquant');


/* mixins */
var mixins       = require('postcss-mixins')({
    mixins: {
        card: function (mixin, depth) {
            switch(depth){
              case '1':
                return { 'box-shadow': '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)' };
                break;
              case '2':
                return { 'box-shadow': '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)' };
                break;
              case '3':
                return { 'box-shadow': '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)' };
                break;
              case '4':
                return { 'box-shadow': '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)' };
                break;
              case '5':
                return { 'box-shadow': '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)' };
                break;
              default:
                return { 'box-shadow': '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)' };
            }
        },
        tov: function (mixin) {
          return {
            'overflow': 'hidden',
            'white-space': 'nowrap',
            'text-overflow': 'ellipsis'
          };
        }

    }
});


gulp.task('css', function () {
    var processors = [
        atImport,
        mixins,
        simplevars,
        nestedcss,
        autoprefixer({browsers: ['last 3 version', 'ie 10']}),
        cssnano
    ];
    return gulp.src('./src/css/style.css')
        .pipe( plumber() )
        .pipe( sourcemaps.init() )
        .pipe( postcss(processors) )
        .pipe( sourcemaps.write('.') )
        .pipe( gulp.dest('dist/css') );
});


gulp.task('serve', function() {
  return connect.server({
    root: 'dist',
    port : 5222,
    livereload: true
  });
});

gulp.task("move-html", function(){
  return gulp.src("./src/index.html")
    .pipe(plumber())
    .pipe(gulp.dest("dist"));
});

gulp.task("move-fonts", function(){
  return gulp.src("./src/fonts/*")
    .pipe(plumber())
    .pipe(gulp.dest("dist/fonts"));
});

gulp.task('move-img',function(){
  return gulp.src('./src/css/images/*')
        .pipe(imagemin({
            progressive: true,
            use: [pngquant()]
        }))
        .pipe( gulp.dest('dist/css/images') );
});

gulp.task('script', function() {
	browserify({
		entries: ['./src/js/main.js']
	})
	.bundle()
	.pipe(source('main.js'))
	.pipe(buffer())
 //  .pipe( sourcemaps.init() )
	// .pipe(uglify())
 //  .pipe( sourcemaps.write('.') )
	.pipe(gulp.dest("./dist/"))
});

gulp.task('watch',function(){
  gulp.watch(["src/**/*.js"],["script"]);
  gulp.watch(["src/**/*.css"],["css"]);
  gulp.watch(["src/**/*.html"],["move-html"]);
});

var tasks = [
  'move-html',
  'move-img',
  'css',
  'script',
  'serve',
  'watch'
];

gulp.task('build', ['move-html', 'css', 'script']);
gulp.task('default', tasks);
gulp.task('first', tasks.concat(['move-img', 'move-fonts']));
