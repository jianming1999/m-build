/*jshint esversion: 6 */ //定义ES6
/*jshint node: true   */ //定义node

const path = require('path');

const gulp = require('gulp');

const sass = require('gulp-sass');

const compass = require('gulp-compass');

const minifyCSS = require('gulp-clean-css');

const gulppostcss = require('gulp-postcss');

const gulpclean = require('gulp-clean');

const gutil = require('gulp-util');

const print = require('gulp-print');

const color = require('colors-cli/safe');
const error = color.x199;
const notice = color.x220;


var getName = function(str) {
  var baseName = path.basename(str);
  var useName = baseName.substring(0, baseName.lastIndexOf('.'));
  return useName;
};


/**
 * 监听sass目录 并编译
 * @param  {Object}   dir    [目录信息]
 * @param  {Object}   config [配置信息]
 */
var sassWatch = (dir, config, done) => {
  var src = dir.src;
  var dist = dir.dist;

  var watcher = gulp.watch(src.scss + '**/*.scss');

  watcher.on('change', function(link, stats) {

    var name = getName(link);
    var subcatalog = path.dirname(link).slice(src.scss.length);

    if(!config.sass.compass){

      return gulp.src(link)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulppostcss(config.sassProcessors))
        // .pipe(minifyCSS())
        .pipe(gulp.dest(dist.css + subcatalog))
        .pipe(print(function() {
          gutil.log(notice(`${link} 已经被编译  -->  输出在${dist.css}${subcatalog.length>0?subcatalog+'/':subcatalog}${name}.css`));
          done();
        }));

    }else{

      return gulp.src(link)
        .pipe(compass({
          css: dist.css + subcatalog,
          sass: path.dirname(link)
        })).on('error', function(e) {console.log(e);})
        .pipe(gulppostcss(config.sassProcessors))
        // .pipe(minifyCSS())
        .pipe(gulp.dest(dist.css + subcatalog))
        .pipe(print(function() {
          gutil.log(notice(`${link} 已经被编译  -->  输出在${dist.css}${subcatalog.length>0?subcatalog+'/':subcatalog}${name}.css`));
          done();
        }));

    }



  });

  watcher.on('add', function(link, stats) {

    var name = getName(link);
    var subcatalog = path.dirname(link).slice(src.scss.length);

    if(!config.sass.compass){

      return gulp.src(link)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulppostcss(config.sassProcessors))
        // .pipe(minifyCSS())
        .pipe(gulp.dest(dist.css + subcatalog))
        .pipe(print(function() {
          gutil.log(notice(`${link} 已经被添加并且编译  --> 输出在${dist.css}${subcatalog.length>0?subcatalog+'/':subcatalog}/${name}.css`));
          done();
        }));

    }else{

      return gulp.src(link)
        .pipe(compass({
          css: dist.css + subcatalog,
          sass: path.dirname(link)
        })).on('error', function(e) {console.log(e);})
        .pipe(gulppostcss(config.sassProcessors))
        // .pipe(minifyCSS())
        .pipe(gulp.dest(dist.css + subcatalog))
        .pipe(print(function() {
          gutil.log(notice(`${link} 已经被添加并且编译  --> 输出在${dist.css}${subcatalog.length>0?subcatalog+'/':subcatalog}/${name}.css`));
          done();
        }));

    }

  });

  // watcher.on('unlink', function(link, stats) {
  //
  //   var name=getName(link);
  //   var subcatalog=path.dirname(link).slice(src.scss.length);
  //
  //   return gulp.src(`${dist.css}${subcatalog.length>0?subcatalog+'/':subcatalog}${name}.css`, {read: false})
  //     .pipe(gulpclean({force: true}))
  //     .pipe(print(function(filepath){
  //       gutil.log(notice(`${link} 和 ${dist.css}${subcatalog.length>0?subcatalog+'/':subcatalog}${name}.css 已经被删除`));
  //       done();
  //     }));
  //
  // });


};

module.exports = sassWatch;
