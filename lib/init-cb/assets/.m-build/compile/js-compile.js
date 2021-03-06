/*jshint esversion: 6 */ //定义ES6
/*jshint node: true  */ //定义node

/** node系统处理路径模块 **/
const path = require('path');
const fs = require("fs");

/** gulp 模块 **/
const gulp = require('gulp');

/** webpack模块 **/
const webpack = require('webpack');

/** rollup模块 **/
const rollup = require('rollup').rollup;
const babel = require('rollup-plugin-babel');
const rollupUglify = require('rollup-plugin-uglify');
const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');
const regenerator = require('rollup-plugin-regenerator');
const postcss = require('rollup-plugin-postcss');


/** 公用js **/
const util = require('../util/util');

/** 命令行字体颜色 **/
const color = require('colors-cli/safe');
const error = color.x199;
const warn = color.x40;
const notice = color.x78;


/**
 * 监听JS执行相关打包操作
 * @param  {Object}   dir    [目录信息]
 * @param  {Object}   config [配置信息]
 * @param  {Function} done   [函数执行成功后的回调函数]
 */
var jsCompile = (dir, config, done) => {

  var src = dir.src;
  var dist = dir.dist;

  /**
   * rollup打包函数
   * @param  {Object}   e    [文件信息]
   * @param  {Function} done [函数执行成功后的回调函数]
   */
  function rollupCb(e, done) {

    // 找到源文件路径
    var baseURL = e.history[0];

    var entryName = path.basename(baseURL);
    // 获取源文件的后半部分文件名
    var outName = entryName.slice(5);

    console.log(warn('packing ->>  ' + src.js + entryName));

    let pluginsArr = [
      postcss({
        plugins: [
          // cssnext(),
          // yourPostcssPlugin()
        ],
        //sourceMap: false, // default value
        //extract: false, // default value
        extensions: ['.css', '.sss'] // default value
        // parser: sugarss
      }),
      nodeResolve({
        jsnext: true
      }),
      commonjs({
        sourceMap: false
      }),
      babel({
        runtimeHelpers: true
      })
    ];

    //  开始打包
    return rollup({
      entry: src.js + entryName,
      plugins: pluginsArr
    }).then(function(bundle) {

      bundle.write({
        format: config.rollup.format,
        // moduleName 就是你导出模块的名字
        moduleName: config.rollup.moduleName || util.camelize(util.dasherize(outName.substring(0, outName.lastIndexOf('.')))),
        sourceMap: false,
        dest: dist.js + util.dasherize(outName)
      });
      console.log(warn('packed  ->>  ' + dist.js + util.dasherize(outName)), '\n');
      done();

    }, function(err) {
      console.log(error(err));
    });

  }

  /**
   * webpack打包函数
   * @param  {Object}   e    [文件信息]
   * @param  {Function} done [确认函数执行完成的回调函数]
   */
  function webpackCb(e, done) {

    var baseURL = e.history[0];

    var entryName = path.basename(baseURL);

    // 获取源文件的后半部分文件名
    var outName = entryName.slice(5);

    console.log(warn('packing ->>  ' + src.js + entryName));

    // 添加动态的配置
    config.webpackConfig.entry = src.js + entryName;

    config.webpackConfig.output = {
      path: dist.js,
      filename: util.dasherize(outName)
    };


    /**
     * 调用webpack打包
     */
    webpack(config.webpackConfig, function(err, stats) {
      if (err)
        console.log(error(err));
      else {
        // for (var i = 0; i < stats.compilation.fileDependencies.length; i++) {
        //   console.log(notice(stats.compilation.fileDependencies[i]));
        // }
        console.log(warn('packed  ->>  ' + dist.js + util.dasherize(outName)));
        done();
      }
    });
  }


  // 读取文件开始打包
  var fileArr = fs.readdirSync(src.js);

  fileArr.forEach(function(name, index) {
    var reg = /^entry./;

    if (reg.test(name)) {
      var e = {};
      e.history = [];
      e.history.push(__dirname + '/' + src.js + name);

      /** 监听 ruollup 打包 js **/
      if (config.rollup.need && !config.webpack.need)
        rollupCb(e, done);

      /** 监听 webpack 打包 js **/
      if (config.webpack.need && !config.rollup.need)
        webpackCb(e, done);
    }

  });


};

module.exports = jsCompile;
