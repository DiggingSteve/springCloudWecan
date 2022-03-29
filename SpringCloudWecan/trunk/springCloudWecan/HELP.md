
# 项目结构

> server 注册发现

> config 配置服务   

> gateway 网关        

> service  业务服务
>> fee  运价服务
>> file  ftp文件服务
>> log 日志服务
>> mqReceiver mq消费端
>> pushmsg  邮件短信推送服务
>> websocket 消息推送服务

> common 公共方法
>> commonUtils 公共方法  
>> commonFeign 公共Feign接口 
>> commonBase BaseController
>> commonLog  公共代码日志
>> commonMongo mongo代码
>> commonMsgQueue 消息推送
>> commonPool   ftp池/  

> dao 操作数据库方法      
> 调用mybatis-plus(orm)/mysql 

> model 实体类
>> modelDbo 数据库实体
>> modelView 非数据库实体