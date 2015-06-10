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
			assetUrl=assetUrl.substring(assetUrl.lastIndexOf('/'),assetUrl.length);
			if (data.indexOf(assetUrl) >= 0) {
				var md5sum = crypto.createHash('md5');
				var reg = new RegExp('".*'+assetUrl+'.*"','g');
				var fullAssetUrl = reg.exec(data).toString();
				var assetName=fullAssetUrl.substring(fullAssetUrl.indexOf(assetUrl),fullAssetUrl.length-1);
				var newurl = getNewAssetsUrl(assetName, md5sum.digest('hex'));
				var newdata = data.replace(assetName, newurl);
				if (grunt.file.write(fileSrc, newdata)) {
					grunt.log.success(fileSrc + ' 替换成功');
				} else {
					grunt.log.error(fileSrc + ' 替换失败');
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
					replaceAssets(filepath, assetUrl);
					return true;
				}
			});
		});
	});
};
