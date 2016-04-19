var hlBuild = {
	start : function(option) {
		
		option = option || {};
		
		var begin = new Date();
		
		/*
		var option = {
			//工程源目录
			projectOriginDir : 'D:/kaolafm/workspace/temp/build-test/carlife',
			//build目标目录
			buildTargetDir : 'D:/kaolafm/workspace/temp/build-test/carlife_dist',
			//需要重命名的扩展名，不能省略点
			needRenameSuffix : ['.js', '.css', '.png', '.jpg'],
			//静态URL
			staticUrl : 'http://static.kaolafm.com/kaolafm/m/client/carlife',
			//编译后自动打开目录
			autoOpen : true
		};
		*/
		
		var errMsg = [];
		
		if(!option.projectOriginDir){
			errMsg.push('缺少配置：projectOriginDir');
		}else if({}.toString.call(option.projectOriginDir) !== '[object String]'){
			errMsg.push('projectOriginDir 必须为String类型');
		}
		
		if(!option.buildTargetDir){
			errMsg.push('缺少配置：buildTargetDir');
		}else if({}.toString.call(option.buildTargetDir) !== '[object String]'){
			errMsg.push('buildTargetDir 必须为String类型');
		}
		
		if(!option.needRenameSuffix){
			errMsg.push('缺少配置：needRenameSuffix');
		}else if({}.toString.call(option.needRenameSuffix) !== '[object Array]'){
			errMsg.push('needRenameSuffix 必须为Array类型');
		}
		
		if(!option.staticUrl){
			errMsg.push('缺少配置：staticUrl');
		}else if({}.toString.call(option.staticUrl) !== '[object String]'){
			errMsg.push('staticUrl 必须为String类型');
		}
		
		if(errMsg.length > 0){
			errMsg.forEach(function(msg, index){
				console.log(msg);
			});
			return;
		}
		
		
		/**
		 * 存储静态文件信息
		 * {dir:'',originName:'',targetName:''}
		 */
		var staticFiles = {
			js : [],
			css : [],
			img : []
		};
		
		var fs= require('fs');
		var crypto = require('crypto');
		var cmd = require('child_process');	
		
		//文件处理工具类
		var fileUtil = {
			copy : function(src, dist){
				readable = fs.createReadStream(src);
				writable = fs.createWriteStream(dist);
				readable.pipe(writable);
			},
			rename : function(oldFile, newFile){
				fs.renameSync(oldFile, newFile)
			},
			getMd5Name : function(path){
				var data = fs.readFileSync(path, 'UTF-8');
				var md5Str = crypto.createHash('md5').update(data).digest('hex');
				return md5Str;
			},
			deleteFolderRecursive : function(path) {
	
			    var files = [];
			    if( fs.existsSync(path) ) {
			        files = fs.readdirSync(path);
			        files.forEach(function(file,index){
			            var curPath = path + '/' + file;
			            if(fs.statSync(curPath).isDirectory()) { // recurse
			                fileUtil.deleteFolderRecursive(curPath);
			            } else { // delete file
			                fs.unlinkSync(curPath);
			            }
			        });
			        fs.rmdirSync(path); // delete dir
			    }
			}
		};
		
		//字符串工具类
		var stringUtil = {
			endWith : function(target, str, ignoreCase){
				var endStr = target.substring(target.length - str.length);
				return ignoreCase ? 
					   endStr.toLowerCase() === str.toLowerCase() : 
					   endStr === str;
			}
		};
		
		//builder
		var builder = {
			//copy并重命名
			copyAndRename : function(path){
				
				if(!fs.existsSync(path)){
					console.log('The path not exist : ' + path);
					return;
				}
				
				console.log('\n开始拷贝并重命名................................................\n');
				
				(function recurse(path){
					var stats = fs.statSync(path);
					if(stats.isDirectory()){
						
						//创建目标路径
						fs.mkdirSync(path.replace(option.projectOriginDir, option.buildTargetDir));
						
						//递归
						var files = fs.readdirSync(path);
						files.forEach(function(file,index){
							recurse(path + '/' + file);
						});
					}else{
						
						//源路径
						var src = path;
						//目标路径
						var dist = src.replace(option.projectOriginDir, option.buildTargetDir);
						//copy
						fileUtil.copy(src, dist);
						
						//文件扩展名
						var suffix = dist.substring(dist.lastIndexOf('.'));
							suffix = suffix.toLocaleLowerCase();
						
						//需要重命名
						if(option.needRenameSuffix.indexOf(suffix) > -1){
							//目标目录
							var distDir = dist.substring(0, dist.lastIndexOf('/') + 1);
							//源文件名
							var originName = dist.replace(distDir, '');
							//目标文件名
							var targetName = originName.replace(suffix, '_' + fileUtil.getMd5Name(src) + suffix);
							//目标全路径+MD5文件名
							var renamePath = distDir + targetName;
							//重命名
							fileUtil.rename(dist, renamePath);
							
							//添加到copy记录
							var recordObj = {
								'dir' : src.replace(option.projectOriginDir + '/', '').replace('/' + originName, ''),
								'originName' : originName,
								'targetName' : targetName
							};
							
							if(suffix === '.js'){
								staticFiles.js.push(recordObj);
							}else if(suffix === '.css'){
								staticFiles.css.push(recordObj);
							}else if(suffix === '.png' || suffix === '.gif' || suffix === '.jpg' || suffix === '.jpeg'){
								staticFiles.img.push(recordObj);
							}
							
							console.log(src);
							console.log(dist);
							console.log(renamePath);
						}
					}
				})(path);
				
			},
			replaceJs : function(){
				console.log('\n开始替换JS................................................\n');
				console.log(staticFiles.js);
				
				(function recurse(path){
					var stats = fs.statSync(path);
					if(stats.isDirectory()){
						//递归
						var files = fs.readdirSync(path);
						files.forEach(function(file,index){
							recurse(path + '/' + file);
						});
					}else{
						if(stringUtil.endWith(path, '.html', true) || stringUtil.endWith(path, '.shtml', true) || stringUtil.endWith(path, '.js', true)){
							
							console.log('\n' + path);
							
							//读取HTML、STHML或JS文件
							var data = fs.readFileSync(path, 'UTF-8');
							
							//遍历需要替换的JS文件
							staticFiles.js.forEach(function(obj, index){
								var oldJsSrc = obj.dir + '/' + obj.originName;
								var newJsSrc = option.staticUrl + '/' + obj.dir + '/' + obj.targetName;
								console.log('\t' + index + ': ' + oldJsSrc + ' --> ' + newJsSrc);
								
								var reg = new RegExp('([\"\']{1})[\.\/\w_-]*' + oldJsSrc + '\\1', 'gm');
								
								//替换
								data = data.replace(reg, function(){
									console.log('\t\t匹配到：' + arguments[0]);
									return arguments[1] + newJsSrc + arguments[1];
								});	
							});
							
							//写入替换好的文件
							fs.writeFileSync(path, data);
						}
					}
				})(option.buildTargetDir);
				
			},
			replaceCss : function(){
				console.log('\n开始替换CSS................................................\n');
				console.log(staticFiles.css);
				
				(function recurse(path){
					var stats = fs.statSync(path);
					if(stats.isDirectory()){
						//递归
						var files = fs.readdirSync(path);
						files.forEach(function(file,index){
							recurse(path + '/' + file);
						});
					}else{
						if(stringUtil.endWith(path, '.html', true) || stringUtil.endWith(path, '.shtml', true)){
							
							console.log('\n' + path);
							
							//读取HTML、STHML文件
							var data = fs.readFileSync(path, 'UTF-8');
							
							//遍历需要替换的CSS文件
							staticFiles.css.forEach(function(obj, index){
								var oldCssSrc = obj.dir + '/' + obj.originName;
								var newCssSrc = option.staticUrl + '/' + obj.dir + '/' + obj.targetName;
								 
								console.log('\t' + index + ': ' + oldCssSrc + ' --> ' + newCssSrc);
								
								var reg = new RegExp('([\"\']{1})[\.\/\w_-]*' + oldCssSrc + '\\1', 'gm');
								
								//替换
								data = data.replace(reg, function(){
									console.log('\t\t匹配到：' + arguments[0]);
									return arguments[1] + newCssSrc + arguments[1];
								});	
							});
							
							//写入替换好的文件
							fs.writeFileSync(path, data);
						
						}
					}
				})(option.buildTargetDir);
			},
			replaceImage : function(){
				console.log('\n开始替换IMG................................................\n');
				console.log(staticFiles.img);
				
				(function recurse(path){
					var stats = fs.statSync(path);
					if(stats.isDirectory()){
						//递归
						var files = fs.readdirSync(path);
						files.forEach(function(file,index){
							recurse(path + '/' + file);
						});
					}else{
						if(stringUtil.endWith(path, '.html', true) || stringUtil.endWith(path, '.shtml', true) || stringUtil.endWith(path, '.css', true) || stringUtil.endWith(path, '.js', true)){
							console.log('\n' + path);
							
							//读取HTML、STHML、CSS、JS文件
							var data = fs.readFileSync(path, 'UTF-8');
							
							//遍历需要替换的IMG文件
							staticFiles.img.forEach(function(obj, index){
								var oldImgSrc = obj.dir + '/' + obj.originName;
								var newImgSrc = option.staticUrl + '/' + obj.dir + '/' + obj.targetName;
								console.log('\t' + index + ': ' + oldImgSrc + ' --> ' + newImgSrc);
								
								var reg = new RegExp('([\"\']{1})[\.\/\w_-]*' + oldImgSrc + '\\1', 'gm');
								
								//替换
								data = data.replace(reg, function(){
									console.log('\t\t匹配到：' + arguments[0]);
									return arguments[1] + newImgSrc + arguments[1];
								});	
								
								//替换没有引号，只用括号包含url的情况，例如background:url(images/test.png)
								reg = new RegExp('[\(]{1}[\.\/\w_-]*' + oldImgSrc + '[\)]{1}', 'gm');
								data = data.replace(reg, function(){
									console.log('\t\t匹配到：' + arguments[0]);
									return '(' + newImgSrc + ')';
								});	
							});
							
							//写入替换好的文件
							fs.writeFileSync(path, data);
						}
					}
				})(option.buildTargetDir);
			}
		}
		
		/*
		var src = "D:/kaolafm/workspace/websrc.kaolafm.com/m/m-site/dist/js/common.js";
		var name = fileUtil.getMd5Name(src);
		console.log(name);
		return;
		*/
		
		//删除目标路径
		fileUtil.deleteFolderRecursive(option.buildTargetDir);
		//复制并从命名文件
		builder.copyAndRename(option.projectOriginDir);
		
		setTimeout(function(){
			//替换JS引用
			builder.replaceJs();
			//替换CSS引用
			builder.replaceCss();
			//替换IMG引用
			builder.replaceImage();
			
			var end = new Date();
			console.log('用时：' + (end.getTime() - begin.getTime()) + '毫秒。');
			
			//自动打开编译目录
			if(option.autoOpen){
				cmd.exec('start ' + option.buildTargetDir, function(error, stdout, stderr){
					if(error){
						console.log('打开目录失败！');
					}
				});
			}
		},1000);
	}
};

module.exports = hlBuild;