'use strict';

var gulp         = require('gulp'),
    nodemon      = require('gulp-nodemon'),
    _            = require('underscore'),
    wiredep      = require('wiredep').stream,
    less         = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss    = require('gulp-minify-css'),
    rename       = require('gulp-rename'),
    browserSync  = require('browser-sync'),
    concat       = require('gulp-concat'),
    bower        = require('gulp-bower'),
    flatten      = require('gulp-flatten'),
    clean        = require('gulp-clean'),
    ngfilesort   = require('gulp-angular-filesort'),
    naturalsort  = require('gulp-natural-sort'),
    watch        = require('gulp-watch');


//main paths
var dir = {
    backend: './app/',
    frontend: './src/',
    styles: 'styles/',
    dist: './dist/'
};

//Change Gulpfile Configuration
var src = {
    less: dir.frontend + 'less/**/*.less',
    mainLess: dir.frontend + 'less/tentaStatestik.less',
    scripts: dir.frontend + 'js/**/*.js',
    html: [dir.frontend + 'index.html', dir.frontend + 'views/**/*.html', dir.frontend + 'js/**/*.html'],
    images: dir.frontend + 'img/**/*'  //.{png,jpg,svg}
};


//build JavaScripts
gulp.task('scripts', function () {
    console.log('-------------------------------------------------- Bundle JavaScripts');
    return  gulp.src(src.scripts)
                .pipe(naturalsort())
                .pipe(ngfilesort())
                .pipe(concat('bundle.js'))
                .pipe(gulp.dest(dir.dist));
});

//build less.
gulp.task('styles', function() {
    console.log('-------------------------------------------------- Generate css');
    return  gulp.src(src.mainLess)
                .pipe(less({paths: src.less}))
                .pipe(autoprefixer('last 2 version'))
                .pipe(gulp.dest(dir.dist))
                .pipe(rename({suffix: '.min'}))
                .pipe(minifycss())
                .pipe(gulp.dest(dir.dist));
});

//Download bower components
gulp.task('bower', function(){
    return bower();
});

//Inject bower components in the build html file
// Prerequisits: Build HTML and download bower components
gulp.task('inject',['views','bower'], function() {
    console.log('-------------------------------------------------- Inject Bower Dependencies');
    gulp.src( dir.dist + 'index.html')
        .pipe(wiredep({
            exclude: ['bootstrap.css']
        }))
        .pipe(gulp.dest(dir.dist));
});

//Build HTML
gulp.task('views',['clean-views'], function() {
    console.log('-------------------------------------------------- Copy Markup files');
    gulp.src(src.html[0])
        .pipe(gulp.dest(dir.dist));
    gulp.src([src.html[1],src.html[2]])
        .pipe(flatten())
        .pipe(gulp.dest( dir.dist + 'views/'));
});


//Main watch file
gulp.task('watch',['build'], function(){
    console.log('-------------------------------------------------- Start Watchers');
    watch(src.images, function (){
        gulp.start('build-images');
    });

    watch(src.scripts, function (){
        gulp.start(['scripts']);
    });

    watch(src.less, function (){
        gulp.start('styles');
    });

    watch(src.html, function (){
        gulp.start('inject');
    });
});

gulp.task('dev-env', function() {
console.log('-------------------------------------------------- Load Environment');
  var devEnv = require('./env.json');
  _.forEach(devEnv, function(value, key) {
    process.env[key] = value;
  });
});

gulp.task('build-images',['clean-images'], function(){
    console.log('-------------------------------------------------- Copy Image Assets');
    return gulp.src(src.images)
               .pipe(gulp.dest(dir.dist + 'img/'));
});

//Download bower components, build html, build javscripts, build styles
gulp.task('build',['inject','scripts','build-images'], function(){
    return gulp.start('styles');
});

gulp.task('clean-views', function(){
    return gulp.src(dir.dist + 'views')
               .pipe(clean({force:true}));
});

gulp.task('clean-images', function(){
    return gulp.src(dir.dist + 'img')
               .pipe(clean({force:true}));
});

gulp.task('clean-scripts', function(){
    return gulp.src(dir.dist + '*.js')
               .pipe(clean({force:true}));
});

gulp.task('clean-styles', function(){
    return gulp.src(dir.dist + '*.css')
               .pipe(clean({force:true}));
});

gulp.task('clean-bower', function(){
    return gulp.src(dir.dist + 'vendor')
               .pipe(clean({force:true}));
});

gulp.task('clean-dist', function(){
    return gulp.src(dir.dist)
               .pipe(clean({force:true}));
});

gulp.task('nodemon', function(cb) {

  // We use this `called` variable to make sure the callback is only executed once
    var called = false;
    return nodemon({
        script: './bin/www',
        watch: ['server.js', 'app/**/*.*'],
        ext   : 'js',
        ignore: ['./src/', 'statistik.xlsx','./node_modules/'],
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
gulp.task('browser-sync', ['build','dev-env','nodemon'], function() {
    var port = process.env.PORT || 3000;
    browserSync.init({

        // All of the following files will be watched
        files: [dir.dist + '*.*'],

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