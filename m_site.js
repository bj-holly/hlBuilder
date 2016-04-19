var hlBuild = require('./hlBuilder');

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
