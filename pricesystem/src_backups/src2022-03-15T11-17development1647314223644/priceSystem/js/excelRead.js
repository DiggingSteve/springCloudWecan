
import url from "postcss-url";
import { BaseService } from "./base";
const uploadStatus = { pending: "等待上传", uploading: "正在上传", completed: "已完成", canceled: "已删除" }
function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}


class excelRead extends BaseService {
    constructor(v) {
        super(v)
        this.option = new UploadOption();
        this.guid = guid();
        

    }

    sheet=null;
    
    option = new UploadOption();



    setOption(obj) {

        this.option.file = obj.file;
    }

    setEvent(o){
        this.events.afterUpload=o.afterUpload;
    }

    read(){
        var reader = new FileReader();
        var _this=this;
        reader.onload = function(e) {
            var data = e.target.result;
            var workbook = XLSX.read(data, {type: 'binary'});
            console.log(workbook)
            debugger
            _this.sheet=workbook.Sheets[workbook.SheetNames[0]];
            _this.vueInstance.$emit("update:fileData",_this.sheet);
        };
        var d= reader.readAsBinaryString(this.option.file);

    }



    percent = 0;

    currentChunk = 0;

    errorCount = 0;

    guid = "";

    /**上传结束后返回值 */
    returnData={};

    events=new FileUploadEvent();

    /**任务状态 */
    status = uploadStatus.pending;

   

    delJob(index) {
        this.status = uploadStatus.canceled;
    }

}

class UploadOption {

    //file 类
    file = null;

    get fileTotalSize() {
        return this.file.size;
    }



}


class FileUploadEvent{

    /**function 上传完毕后调用的事件 */
    afterUpload=null;

}
export { excelRead, UploadOption, uploadStatus }