
import url from "postcss-url";
import { BaseService } from "./base";
const uploadStatus = { pending: "等待上传", uploading: "正在上传", completed: "已完成", canceled: "已删除" }
function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}


class FragmentUploadFile extends BaseService {
    constructor(v) {
        super(v)
        this.option = new UploadOption();
        this.guid = guid();
        

    }
    option = new UploadOption();

    setOption(obj) {
        this.option.url = obj.url;
        this.option.url=this.vueInstance.$store.state.fileApi+"File/upload";
        this.option.file = obj.file;
    }

    setEvent(o){
        this.events.afterUpload=o.afterUpload;
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

    /**
     * 
     * @param {是否第一次上传} isStart 
     * @returns 
     */
    sendFile(isStart) {
        if (!!isStart) {
            if (this.status == uploadStatus.uploading) {
                throw new Error("任务进行中请勿重复上传")
            }
            else if (this.status == uploadStatus.completed) {
                throw new Error("已上传请勿重复上传")
            }

        }
        if (this.status == uploadStatus.canceled) {
            return;
        }
        this.status = uploadStatus.uploading;
        let blobFrom = this.currentChunk * this.option.chunkSize;
        let blobTo = (this.currentChunk + 1) * this.option.chunkSize > this.option.fileTotalSize ? this.option.fileTotalSize : (this.currentChunk + 1) * this.option.chunkSize;
        let curSize = 0;
        let startTime = new Date().getTime();
        let url = this.option.url;
        let fd = new FormData();
        fd.append("file", this.option.file.slice(blobFrom, blobTo))
        fd.append("fileName", this.option.file.name);
        fd.append("currentChunk", this.currentChunk);
        fd.append("chunkCount", this.option.chunkCount);
        fd.append("chunkSize", this.option.chunkSize);
        // 当前传的字节数，如果不是最后一片，那么就是fragmentSize
        if (this.currentChunk * this.option.chunkSize > this.totalSize) {
            curSize = this.option.fileTotalSize - this.currentChunk * this.option.chunkSize
        } else {
            curSize = this.option.chunkSize;
        }

        this.request("post", url, fd, { loading: false }).then(d => {
            this.currentChunk++;

            this.percent = d.data.resultdata.percent;
            if (this.currentChunk < this.option.chunkCount) {
                this.sendFile(false);
            }
            if (this.percent == 100) {
                this.status = uploadStatus.completed;
                if(!!this.events.afterUpload){
                    this.events.afterUpload(this)
            
                }
            }
        }).catch((e) => {
            this.status=uploadStatus.pending;
            this.currentChunk=0;
            this.errorCount++;
        });
    }

    delJob(index) {
        this.status = uploadStatus.canceled;
    }

}

class UploadOption {

    //file 类
    file = null;

    url = "";




    get chunkSize() {
        return 2 * 1024 * 1024;// 默认分片2mb
    }

    get chunkCount() {
        //多少片
        return Math.ceil(this.file.size / this.chunkSize);
    }

    get fileTotalSize() {
        return this.file.size;
    }



}

class FileUploadEvent{

    /**function 上传完毕后调用的事件 */
    afterUpload=null;

}
export { FragmentUploadFile, UploadOption, uploadStatus }