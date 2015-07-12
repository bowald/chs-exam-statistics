'use strict';

var gulp         = require('gulp'),
    nodemon      = require('gulp-nodemon'),
    wiredep      = require('wiredep').stream,
    less         = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss    = require('gulp-minify-css'),
    rename       = require('gulp-rename'),
    notify       = require('gulp-notify'),
    browserSync  = require('browser-sync'),
    jshint       = require('gulp-jshint'),
    concat       = require('gulp-concat'),
    babel        = require('gulp-babel'),
    bower        = require('gulp-bower'),
    flatten      = require('gulp-flatten'),
    clean        = require('gulp-clean'),
    ngfilesort   = require('gulp-angular-filesort'),
    naturalsort  = require('gulp-natural-sort'),
    watch        = require('gulp-watch'),
    stripLine    = require('gulp-strip-line');


//main paths
var base = {
    backendSrc: './app/',
    frontendSrc: './src/',
    dist: './dist/'
};

//Change Gulpfile Configuration
var config = {
    less: base.frontendSrc + 'less/**/*.less',
    mainLess: base.frontendSrc + 'less/tentaStatestik.less',
    scripts: base.frontendSrc + 'js/**/*.js',
    html: [base.frontendSrc + 'index.html', base.frontendSrc + 'views/**/*.html', base.frontendSrc + 'js/**/*.html'],
    images: base.frontendSrc + 'img/**/*'  //.{png,jpg,svg}
};



//Javascript linting
gulp.task('lint', function(){
    gulp.src(config.scripts)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

//build JavaScripts
gulp.task('scripts', function () {
    return  gulp.src(config.scripts)
                .pipe(naturalsort())
                .pipe(ngfilesort())
                .pipe(concat('bundle.js'))
                .pipe(babel())
                .pipe(stripLine('use strict'))
                .pipe(gulp.dest(base.dist))
                .pipe(notify({ message: 'Scripts task complete' }));
});

//build less.
gulp.task('styles', function() {
    return  gulp.src(config.mainLess)
                .pipe(less({paths: config.less}))
                .pipe(autoprefixer('last 2 version'))
                .pipe(gulp.dest(base.dist))
                .pipe(rename({suffix: '.min'}))
                .pipe(minifycss())
                .pipe(gulp.dest(base.dist))
                .pipe(notify({ message: 'Styles task complete' }));
});

//Download bower components
gulp.task('bower', function(){
    return bower();
});

//Inject bower components in the build html file
// Prerequisits: Build HTML and download bower components
gulp.task('inject',['views','bower'], function() {
    gulp.src( base.dist + 'index.html')
        .pipe(wiredep({
            exclude: ['bootstrap.css']
        }))
        .pipe(gulp.dest(base.dist));
});

//Build HTML
gulp.task('views',['clean-views'], function() {
    gulp.src(config.html[0])
        .pipe(gulp.dest(base.dist));
    gulp.src([config.html[1],config.html[2]])
        .pipe(flatten())
        .pipe(gulp.dest( base.dist + 'views/'))
        .pipe(notify({ message: 'Views task complete' }));
});


//Main watch file
gulp.task('watch',['build'], function(){
    watch(config.images, function (){
        gulp.start('build-images');
    });

    watch(config.scripts, function (){
        gulp.start(['lint','scripts']);
    });

    watch(config.less, function (){
        gulp.start('styles');
    });

    watch(config.html, function (){
        gulp.start('inject');
    });
});

// Honestly stolen from QFL gulpfile
// gulp.task('dev-env', function() {
//   var devEnv = require('./env.json');
//   _.forEach(devEnv, function(value, key) {
//     process.env[key] = value;
//   });
// });

gulp.task('build-images',['clean-images'], function(){
    return gulp.src(config.images)
               .pipe(gulp.dest(base.dist + 'img/'));
});

//Download bower components, build html, build javscripts, build styles
gulp.task('build',['inject','scripts','build-images'], function(){
    return gulp.start('styles');
});

gulp.task('clean-views', function(){
    return gulp.src(base.dist + 'views')
               .pipe(clean({force:true}));
});

gulp.task('clean-images', function(){
    return gulp.src(base.dist + 'img')
               .pipe(clean({force:true}));
});

gulp.task('clean-scripts', function(){
    return gulp.src(base.dist + '*.js')
               .pipe(clean({force:true}));
});

gulp.task('clean-styles', function(){
    return gulp.src(base.dist + '*.css')
               .pipe(clean({force:true}));
});

gulp.task('clean-bower', function(){
    return gulp.src(base.dist + 'vendor')
               .pipe(clean({force:true}));
});

gulp.task('clean-dist', function(){
    return gulp.src(base.dist)
               .pipe(clean({force:true}));
});

gulp.task('nodemon', function(cb) {

  // We use this `called` variable to make sure the callback is only executed once
    var called = false;
    return nodemon({
        script: './bin/www',
        watch: ['server.js', 'app/**/*.*'],
        ext   : 'js',
        ignore: ['./src/', './node_modules/'],
        env   : { 'NODE_ENV': 'development' }
    })
    .on('start', function onStart() {
        if (!called) {
            cb();
        }
        called = true;
    })
    .on('restart', function onRestart() {

        // Also reload the browsers after a slight delay
        setTimeout(function reload() {
            browserSync.reload({
                stream: false
            });
        }, 500);
    });
});

// Make sure `nodemon` is started before running `browser-sync`.
gulp.task('browser-sync', ['build','nodemon'], function() {
    var port = process.env.PORT || 3000;
    browserSync.init({

        // All of the following files will be watched
        files: [base.dist + '*.*'],

        // Tells BrowserSync on where the express app is running
        proxy: 'http://localhost:' + port,

        // This port should be different from the express app port
        port: 4000,

        // Which browser should we launch?
        // browser: ['google chrome']
    });
}
);

//Cleans current dist, builds dist, watches for changes, launch browser-sync.
gulp.task('default', ['clean-dist'], function() {
    gulp.start('build');
    gulp.start('watch');
    gulp.start('browser-sync');
});