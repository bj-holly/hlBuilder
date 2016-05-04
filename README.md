# hlBuilder 
#### 简单的静态页面上线构建工具

###### 实现功能：

1. 根据配置的静态资源范围，读取资源内容，MD5后重命名文件
2. 替换html、shtml、js、css文件内引用到的静态资源路径。

###### 配置说明：
<pre>
hlBuild.start({
	//工程源目录
	projectOriginDir : 'D:/kaolafm/workspace/websrc.kaolafm.com/m/m-site/dist',
	//build目标目录
	buildTargetDir : 'D:/kaolafm/workspace/websrc.kaolafm.com/dist/m_site',
	//需要重命名的扩展名，不能省略点,暂时支持范围(js、css、png、jpg、jpeg、gif)
	needRenameSuffix : ['.js', '.css', '.png', '.jpg', '.gif'],
	//静态URL
	staticUrl : 'http://static.kaolafm.com/kaolafm/m',
	//编译后自动打开目录
	autoOpen : true
});
</pre>
###### 运行：
node m_site.js