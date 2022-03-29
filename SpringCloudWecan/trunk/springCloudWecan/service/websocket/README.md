# 前后端参数规范

##  前端输入值规范 
```
switch(messagetype)
{
case "historymessage"://历史记录
"messagetype":"historymessage","guid":1111,"boguid":17553657551818752
break; 
case "closehistorymessage"://关闭历史记录 
   "messagetype":"closehistorymessage","guid":1111,"boguid":17553657551818752
break; 
case "bufferfile"://发送文件
"messagetype":"bufferfile","guid":1111,"boguid":17553657551818752,filetotal:"总大小",filename: "文件名",chunkCount: "分数",chunkSize:"每份大小",process:"begin/end"
break;  
case "textmessage"://textmessage
 "messagetype":"textmessage","guid":1111,"boguid":17553657551818752,"content":"内容","calllist":[{"logname":"登录名"}]
break; 
} 
``` 


##  后台返回值规范 
###### {"resultdata":object,"resultmessage":"success","resultstatus":0,"resultsuccess":true}
###### resultdata.object 为jsonObject
###### 其中都包含 messagetype 区分消息类型 
```
switch(messagetype)
{
case "historymessage"://历史记录 
   "messagetype":"historymessage","boguid":17553657551818752,"datalist":[{消息1},{消息2}]
break;
case "historyjoblistmessage"://历史joblist记录 
   "messagetype":"historyjoblistmessage","joblist":[{guid:1231,boguid:1231},{guid:456,boguid:456}]
break;
case "jobinfomessage"://jobinfo推送 
   "messagetype":"jobinfomessage","boguid":17553657551818752,"guid":17553657551818752
break;
case "onlinemessage"://上线消息 
   "messagetype":"onlinemessage","logname":"登入名","sessionId":"连接id"
break;
case "offlinemessage"://离线消息
    "messagetype":"offlinemessage","logname":"登入名","sessionId":"连接id"
break;
case "bufferpercent"://文件上传进度消息,进度每10%为推送节点
    "messagetype":"bufferpercent","fileName":"文件名","percent":百分比
break;
case "bufferfile"://文件传送完毕消息
    "messagetype":"bufferfile","boguid":17553657551818752,"fileName":"文件名","fileAddress":"上传后http地址"
break;
case "nodemessage"://节点消息
    "messagetype":"nodemessage","boguid":17553657551818752,"nodename":"节点名称","nodecode":"节点代码"
break; 
case "textmessage"://普通消息
    "messagetype":"textmessage","boguid":17553657551818752
break;
} 
 
在json 中 加入 参数  pushtype 区分推送类型是否显示为弹窗提示
case "call": 
    "pushtype":"call","messagetype":"textmessage","boguid":17553657551818752,"content":"内容"
break; 
```