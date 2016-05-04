# hlBuilder 
#### 简单的静态页面上线构建工具

###### 存在原因：
<p>由于动静分离以后，静态资源会部署到CDN上面，而在开发过程中，静态资源都是相对引用的。</p>
<p>因此在上线时，需要把静态资源的引用，修改为CDN的引用地址，同时实现非覆盖式发布。</p>
<p>暂时只适用于我公司特定环境，欢迎大牛阅读源码，指点斧正，共同完善。</p>

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
