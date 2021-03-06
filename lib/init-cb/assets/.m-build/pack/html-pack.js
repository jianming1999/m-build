/*jshint esversion: 6 */ //定义ES6
/*jshint node: true   */ //定义node

const gulp = require('gulp');

const gulphtmlmin = require('gulp-htmlmin');

/**
 * 监听html 相关处理
 * @param  {Object}   dir    [目录信息]
 * @param  {Object}   config [配置信息]
 */
var htmlPack=(dir, config) => {

  var src = dir.src;
  var dist = dir.dist;
  var build = dir.build;

  return gulp.src(dist.app + "*.html")
    .pipe(gulphtmlmin(config.htmlminConfig))
    .pipe(gulp.dest(build.build));
};

module.exports = htmlPack;
