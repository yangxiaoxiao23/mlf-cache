/*
 * mlf-cache
 * https://github.com/yangxiaoxiao23/mlf-cache
 *
 * Copyright (c) 2015 yangxiaoxiao23
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
    var crypto = require('crypto');
    function getNewAssetsUrl(assetName, md5) {
        md5=md5.substring(0,8);
        var newurl='';
        if(assetName.indexOf('?t=')>=0){
            newurl = assetName.substring(0,assetName.length-8) + md5;
        }else{
            newurl = assetName + '?t=' + md5;
        }
        return newurl;
    }

    function replaceAssets(fileSrc, assetUrl) {
        if (grunt.file.exists(fileSrc)) {
            var data = grunt.file.read(fileSrc);

            var replaceUrl = assetUrl.replaceUrl;

            var path = assetUrl.path;

            var assetData = grunt.file.read(path);


            replaceUrl = replaceUrl.substring(replaceUrl.lastIndexOf('/'),replaceUrl.length);

            if (data.indexOf(replaceUrl) >= 0) {
                var md5sum = crypto.createHash('md5');
                md5sum.update(assetData, 'utf-8');
                var reg = new RegExp('".*' + replaceUrl + '.*"','g');
                var fullAssetUrl = reg.exec(data).toString();
                var assetName = fullAssetUrl.substring(fullAssetUrl.indexOf(replaceUrl),fullAssetUrl.length-1);
                var md5 = md5sum.digest('hex');
                var newurl = getNewAssetsUrl(assetName, md5);
                var newdata = data.replace(assetName, newurl);
                if (grunt.file.write(fileSrc, newdata)) {
                    grunt.log.success(fileSrc + ' 添加md5: ' + md5 + ' 成功');
                } else {
                    grunt.log.error(fileSrc + ' 添加md5失败');
                }
            } else {
                grunt.log.error('没有发现要替换的内容 ' + fileSrc);
            }
        }
    }

    grunt.registerMultiTask('cache', 'The best Grunt plugin ever.', function() {
        var options = this.options({

        });

        var assetUrl = this.data.assetUrl;
        this.files.forEach(function(f) {
            var src = f.src.filter(function(filepath) {
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('源文件 "' + filepath + '" 没有找到.');
                    return false;
                } else {
                    grunt.log.success('源文件 "' + filepath + '" 发现.');
                    for(var i= 0,len=assetUrl.length;i<len;i++){
                        var url = assetUrl[i];
                        replaceAssets(filepath, url);
                    }
                    return true;
                }
            });
        });
    });
};
