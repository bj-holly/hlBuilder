# hlBuilder 
#### �򵥵ľ�̬ҳ�����߹�������

###### ʵ�ֹ��ܣ�

1. �������õľ�̬��Դ��Χ����ȡ��Դ���ݣ�MD5���������ļ�
2. �滻html��shtml��js��css�ļ������õ��ľ�̬��Դ·����

###### ����˵����
<pre>
hlBuild.start({
	//����ԴĿ¼
	projectOriginDir : 'D:/kaolafm/workspace/websrc.kaolafm.com/m/m-site/dist',
	//buildĿ��Ŀ¼
	buildTargetDir : 'D:/kaolafm/workspace/websrc.kaolafm.com/dist/m_site',
	//��Ҫ����������չ��������ʡ�Ե�,��ʱ֧�ַ�Χ(js��css��png��jpg��jpeg��gif)
	needRenameSuffix : ['.js', '.css', '.png', '.jpg', '.gif'],
	//��̬URL
	staticUrl : 'http://static.kaolafm.com/kaolafm/m',
	//������Զ���Ŀ¼
	autoOpen : true
});
</pre>
###### ���У�
node m_site.js