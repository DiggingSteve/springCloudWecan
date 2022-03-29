<template>
  <div>
    <div class="roomContainer" >
      <!-- 头部信息开始 -->
      <div class="head" >
        <span class="orderNumber"
          >{{   `${ orderFormInfo.data.mawb !== ""  ?  orderFormInfo.data.mawb : orderFormInfo.data.pono  } ` }} {{` ${orderFormInfo.data.hbh !== '' ? `航班号: ${orderFormInfo.data.hbh} `: ''} `}} {{` ${ orderFormInfo.data.hbrq !== '--' ?  `航班日期: ${orderFormInfo.data.hbrq.match(/\d{4}.\d{1,2}.\d{1,2}/mg).toString()}`  : ''}   `}}</span
        >的留言

        <!-- <i class="el-icon-minus minimize" @click="minimize"></i> -->
        <i class="el-icon-full-screen full" @click="full"></i>
        <i class="el-icon-close close" @click="closeWindow"></i>
        <div class="digest" v-if="fullscreen" >
          <InfoList
            class="infoListStyle"
            
            :inputModelData="inputModelDatas"
            ref="refInfoList"
            :ifopendetail="false"
            :showMawbSearch="false"
            :costBiaozhu="false"
            :showBtnGroup="false"
            :positionDocUpload="false"
            :showDcno="false"
            :showOrderNumber="false"
            name="详细"
          ></InfoList>
        </div>
      </div>
      <!-- 显示摘要开始 -->

      <!-- 显示摘要结束 -->
      <!-- 头部信息结束 -->

      <!-- 主体开始 -->
      <div class="body" >
        <!-- 主体左侧开始 -->
        <div
          class="leftContainer"
          :style="{ width: fullscreen === true ? 70 + '%' : 100 + '%' }"
          
        >
          <!-- 内容显示区域开始 -->
          <div
            class="showContent"
            id="chatRoom"
         
            :style="{ height: fullscreen === true ? 560 + 'px' : 398 + 'px' }"
          >
            <div
              v-for="(item, index) in chatContent"
              :class="[
                'message-item',
                item.loginName == logname ? 'right' : 'left'
              ]"
              :style="{ right: fullscreen === true ? -614 + 'px' : -301 + 'px'}"
              :key="index"
              v-show="chatContent.length > 0"
            >
              <div class="system" v-if="item.messagetype === 'nodemessage'">
                <i class="el-icon-info" style="color:green"></i>
                {{ item.inputConent }}
              </div>
              <div class="heads">
                <span
                  class="name"
                  v-if="
                    item.loginName !== logname &&
                      item.messagetype !== 'nodemessage'
                  "
                  >{{ item.loginName }}</span
                >
                <span class="time" v-if="item.messagetype !== 'nodemessage'">{{
                  item.time
                }}</span>
              </div>
              <div
                class="message"
                v-html="item.inputConent"
                v-if="item.messagetype === 'textmessage'"
                style="width:max-content"
                v-viewer="{movable: false}"
              ></div>
              <div
                class="fillContainer"
                v-if="item.messagetype === 'bufferfile'"
              >
                <div class="inContainer">
                  <img
                    class="icon"
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAArCAIAAABw9tYkAAADQklEQVRYCe2Yz29MURTHv2+mk/7+Nc2Uon60QotQiyoWEiuR8AdYWNhhXSuREAlburezIJFalERiJ001aRsioUwMpVXVFP1Jf8x0fK+Zvjfz3ju3742phTi5mXnv3nvO590f59zznpFMJuGQ5SRYfIkBBALgr14KbM2JJObj+DiN4RksJGyNutuqQjRUorYUoYCuWxYvvoxn47jZj663mF7Uqbm2HdyAi4dwbJsOaZjzyfl7OorL3Xg85GrNU2VLLS4dxsntItIa/NwSOt/gybAnu1Kn5+O42qOmZ2nZvYvFGxgDi681czWpR1q8oSmMzLpa8F2pQVq8n3EsxH2blhQkpMWTNHOud0Vm+YPNdDCAAgPGqj68osbIEU8ikbFTUki2mztW5AUMtK5HWx2KQyv2VvsnqXsEfWOgH5uSQtIakUEDIm9jGc7vx+ndpqKni4cxXOlB3+eszkTefoWGKuyNyDw60OwSZnxGGUYl1033fhLD01re2Byu9+LuIIrEKcgaBG8Ye6PfVOx1yuRCOkDqjPGJWPIrOh5HVhQEl9qjMAJzMucTurNM5NEZzragvRWREo84MGLceoEb/eosk0T0d+7PfREFo/95LCUh7AijrkxiqXpxfFz2e1FFChfr9DPbeFB3RvFyIrPOfi3y2JHOxJJfEeczvxjT2n+eORV5ufjX51PnDwxkjDI8tGzCuMyjzmf+nbah41UXgSlsY3VWlk5M7Ls6VCd+5IIUeQUBnGvBhTZUFtqGB2aq13rR0a8OSL8i7pdN5dgVcYERUBrCzupV4qT0HCJPKchLJLdIoHS9yGM+wZOMW8MpqXeoxYykyNlHqhHX79MMHsTQXIOmsF339Vd0xfBhyl7v5V7kUfl+FI/eoTCYtT9Zz3OVQ89NLB7zBmfqQNMsfy60nPJja/14oNd6Th38PgGTz/oKpWTxGquwtdJliH5NO/tzcPXlWPd7MBavqQZHt4Bu55xVpwnvNbTGHXe8QeXXFGv9eHNmDxYT6BgANyffAfiJws0dPLGY+JDEbwebK9B+ACca01rW+7tppncUdwYx8EUlu37zedMIoyBJR+pxqlk5lSkuPLNtLS6s9VsL606bf5v3C8TVCKzr4puBAAAAAElFTkSuQmCC"
                    alt=""
                  />
                  <span class="title">{{ item.fileName }}</span>
                  <span class="download"
                    ><a :href="item.fileAddress" target="_blank">下载</a></span
                  >
                </div>
              </div>
            </div>
          </div>
          <!-- 内容显示区域结束 -->

          <!-- 发送内容开始 -->
          <div
            class="sendContent"
            :style="{ height: fullscreen === true ? 220 + 'px' : 160 + 'px' }"
          >
            <div class="tools">
              <div
                class="tools-item"
                v-for="(item, index) in tool"
                :key="index"
              >
                <span @click="getToolType(item.id)">
                  <i :class="item.icon"></i>
                  {{ item.label }}
                </span>
              </div>

              <div class="emojisContainer" v-if="emojisStatus">
                <ul>
                  <!-- @click="getEmojis(item)" -->
                  <li
                    v-for="item in emojis"
                    :key="item"
                    @click="getEmojis(item)"
                  >
                    {{ item }}
                  </li>
                </ul>
              </div>
              <div class="uploadContainer" v-if="uploadStatus">

                <div>
                  <i class="el-icon-close closeUpload" @click="closeShowUpload"></i>
                  <el-upload
                    ref="upload"
                    class="upload-demo uploads"
                    drag
                    multiple
                    action="#"
                    :auto-upload="false"
                    :file-list="fileList"
                    :http-request="httpRequest"
                    style="width:200px"
                  >
                    <i class="el-icon-upload"></i>
                    
                    <div class="el-upload__text" trigger>
                      <em> 将文件拖到此处然后点击上传文件</em>
                    </div>
                  </el-upload>
                </div>
                <div class="operate">
                  <el-switch
                    v-model="showDocStatus"
                    @change="loadDoc"
                    inactive-text="上传文档库"
                  >
                  </el-switch>
                </div>

                <el-select
                  v-if="showDocStatus"
                  v-model="selectDocTheir"
                  placeholder="请选择文档"
                  popper-class="docSelect-option"
                >
                  <el-option
                    v-for="item in docTheirList"
                    :key="item.name"
                    :label="item.name"
                    :value="item.name"
                  >
                  </el-option>
                </el-select>

                <el-select
                  v-if="showDocStatus"
                  v-model="selectDocType"
                  placeholder="请选择文档类型"
                  popper-class="docSelect-option"
                  @change="getDocType"
                >
                  <el-option
                    v-for="item in docTypeList"
                    :key="item.id"
                    :label="item.typename"
                    :value="item"
                  >
                  </el-option>
                </el-select>
                <el-button
                  style="margin: 5px 0px"
                  type="primary"
                  @click="uploadFile"
                  >上传文件</el-button
                >
              </div>
            </div>
            <At
              :members="filtercontactListContainer"
              :filter-match="filterMatch"
              :deleteMatch="deleteMatch"
              @insert="getValue"
            >
              <template slot="item" slot-scope="s">
                <div v-text="s.item" style="width:100%"></div>
              </template>
              <div
                class="inputContent"
                contenteditable="true"
                ref="inputConents"
              ></div>
            </At>
            <el-button class="sendButton" tabindex="-1" @click="send"
              >发送</el-button
            >
          </div>
          <!-- 发送内容结束 -->
        </div>
        <!-- 主体左侧部门结束 -->

        <!-- 主体右侧部分开始 -->
        <div
          class="rightContent"
          v-show="fullscreen === true"
          :style="{ width: fullscreen === true ? 30 + '%' : 0 + '%' }"
        >
          <div class="tip"><i class="el-icon-discover"></i> 历史记录</div>
          <div class="historyData-Head">
            <el-input
              class="search"
              v-model="searchData"
              placeholder="请输入关键词搜索"
            ></el-input>
            <el-button class="searchBtn" tabindex="-1" @click="search"
              >搜索</el-button
            >
          </div>
          <el-divider></el-divider>
          <!-- 聊天历史记录主体显示开始 -->
          <div class="historyData-Body">
            <div
              v-for="(item, index) in historyChatDataList"
              class="message-item"
              :key="index"
              v-show="chatContent.length > 0"
            >
              <div class="heads">
                <span class="name">{{ item.loginName }}</span>
                <span class="time">{{ item.time }}</span>
              </div>
              <div
                class="message"
                v-html="item.inputConent"
                v-if="
                  item.messagetype === 'textmessage' ||
                    item.messagetype === 'nodemessage'
                "
                 v-viewer="{movable: false}"
              ></div>
              <div
                class="fillContainer"
                v-if="item.messagetype === 'bufferfile'"
              >
                <div class="inContainer">
                  <img
                    class="icon"
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAArCAIAAABw9tYkAAADQklEQVRYCe2Yz29MURTHv2+mk/7+Nc2Uon60QotQiyoWEiuR8AdYWNhhXSuREAlburezIJFalERiJ001aRsioUwMpVXVFP1Jf8x0fK+Zvjfz3ju3742phTi5mXnv3nvO590f59zznpFMJuGQ5SRYfIkBBALgr14KbM2JJObj+DiN4RksJGyNutuqQjRUorYUoYCuWxYvvoxn47jZj663mF7Uqbm2HdyAi4dwbJsOaZjzyfl7OorL3Xg85GrNU2VLLS4dxsntItIa/NwSOt/gybAnu1Kn5+O42qOmZ2nZvYvFGxgDi681czWpR1q8oSmMzLpa8F2pQVq8n3EsxH2blhQkpMWTNHOud0Vm+YPNdDCAAgPGqj68osbIEU8ikbFTUki2mztW5AUMtK5HWx2KQyv2VvsnqXsEfWOgH5uSQtIakUEDIm9jGc7vx+ndpqKni4cxXOlB3+eszkTefoWGKuyNyDw60OwSZnxGGUYl1033fhLD01re2Byu9+LuIIrEKcgaBG8Ye6PfVOx1yuRCOkDqjPGJWPIrOh5HVhQEl9qjMAJzMucTurNM5NEZzragvRWREo84MGLceoEb/eosk0T0d+7PfREFo/95LCUh7AijrkxiqXpxfFz2e1FFChfr9DPbeFB3RvFyIrPOfi3y2JHOxJJfEeczvxjT2n+eORV5ufjX51PnDwxkjDI8tGzCuMyjzmf+nbah41UXgSlsY3VWlk5M7Ls6VCd+5IIUeQUBnGvBhTZUFtqGB2aq13rR0a8OSL8i7pdN5dgVcYERUBrCzupV4qT0HCJPKchLJLdIoHS9yGM+wZOMW8MpqXeoxYykyNlHqhHX79MMHsTQXIOmsF339Vd0xfBhyl7v5V7kUfl+FI/eoTCYtT9Zz3OVQ89NLB7zBmfqQNMsfy60nPJja/14oNd6Th38PgGTz/oKpWTxGquwtdJliH5NO/tzcPXlWPd7MBavqQZHt4Bu55xVpwnvNbTGHXe8QeXXFGv9eHNmDxYT6BgANyffAfiJws0dPLGY+JDEbwebK9B+ACca01rW+7tppncUdwYx8EUlu37zedMIoyBJR+pxqlk5lSkuPLNtLS6s9VsL606bf5v3C8TVCKzr4puBAAAAAElFTkSuQmCC"
                    alt=""
                  />
                  <span class="title">{{ item.fileName }}</span>
                  <span class="download"
                    ><a :href="item.fileAddress" target="_blank">下载</a></span
                  >
                </div>
              </div>
            </div>
          </div>
          <!-- 聊天历史记录主体显示结束 -->
        </div>
        <!-- 主体右侧部分结束 -->
      </div>
      <!-- 主体结束 -->
    </div>
  </div>
</template>

<script>
import At from "vue-at";
import InfoList from "@/components/orderDetails/infoList.vue";
import  {currentDate} from "@/utils/time.js"
 import 'viewerjs/dist/viewer.css'
 import Viewer from 'v-viewer'
 import Vue from 'vue'
 Vue.use(Viewer)

export default {

  components: {
    At,
    InfoList
  },
  inject: ["orderFormInfo"],

  data() {
    return {
      logname: localStorage.getItem("usrname"),
      docData: [],
      showDocStatus: false,
      searchData: "",
      historyChatDataList: [],
      // 文档所属存储
      docTheirList: [],
      //选中的文档所属
      selectDocTheir: "",
      docTypeList: [],
      selectDocType: null,
      fullscreen: false,
      fileList: [],
      windowStatus: true,
      emojisStatus: false,
      uploadStatus: false,
      // @人列表容器
      contactListContainer: [],
      contactList: [],
      emojis: [
        "😀",
        "😄",
        "😅",
        "🤣",
        "😂",
        "😉",
        "😊",
        "😍",
        "😘",
        "😜",
        "😝",
        "😏",
        "😒",
        "🙄",
        "😔",
        "😴",
        "😷",
        "🤮",
        "🥵",
        "😎",
        "😮",
        "😰",
        "😭",
        "😱",
        "😩",
        "😡",
        "💀",
        "👽",
        "🤓",
        "🥳",
        "😺",
        "😹",
        "😻",
        "🤚",
        "💩",
        "👍",
        "👎",
        "👏",
        "🙏",
        "💪"
      ],
      tool: [
        {
          id: 1,
          icon: "el-icon-apple",
          label: "表情"
        },
        {
          id: 2,
          icon: "el-icon-folder-opened",
          label: "文件上传"
        }
      ],
      chatContent: [],
      temporaryArr: [],
      inputModelDatas:null,
      selectTools:null,
      
    };
  },
  computed: {
    filtercontactListContainer() {
      const arr = []
       this.$store.state.nodemanList.forEach(item=>{
        arr.push(item.nodeman)
      })
      return arr.filter(
        obj => !this.contactList.map(i => i.logname).includes(obj)
      )
      
      
    }
  },
  watch: {
    selectDocTheir(val) {
      console.log("原始数据----------------------")
      console.log(this.docData);
      console.log("原始数据----------------------")
      this.selectDocType = ""

      this.docData.forEach(item => {
        if ((item.name === val)) {
          this.docTypeList = item.typelist;

        }
      });
      console.log(this.docTypeList);
    },
    fullscreen(val){
      if(val === true ){
        // this.getDeatil()
      }
    },

    "$store.state.websoketPushChatData.data"(val){
      this.chatContent=val
    },

  },
  methods: {
    full() {
      this.fullscreen = !this.fullscreen;
      this.$emit("fullScreen", this.fullscreen);
    },
    getDocType(row){
      console.log(row)
      this.selectDocType.groupid = row.groupid;
      this.selectDocType.typename = row.typename
    },
    show () {
    const viewer = this.$el.querySelector('.message').$viewer
    viewer.show()
   },

    closeWindow() {
      var that = this
      if(that.$store.state.chatStore.data != null || that.$store.state.chatStore.data){
      that.$store.commit("setnodemanList",{status:"clear"})
      that.$websoketGlobal.ws.send(JSON.stringify({
         boguid:that.$store.state.chatStore.data.boguid,
         guid:that.$store.state.chatStore.data.guid,
         czman: localStorage.getItem("usrname"),
         logExtraData: that.$store.state.logExtraDataForBuild,
         messagetype: "closehistorymessage"
       }));

    
      that.windowStatus = !that.windowStatus;
      that.$emit("closeWindow", that.windowStatus);
      // 删除已读信息
      that.$store.commit('setreadMessageList',{status:'delete',guid:that.$store.state.chatStore.data.guid})
      that.$store.commit('setChat',{status:false})
      
      } else {
      
        that.$store.commit('setChat',{status:false})
        return false
      }

       
        

    },
    minimize(){
      this.$store.commit('setChat',{status:'minimize'})
    },
    getDeatil(){
      console.log(this.$store.state.chatStore.data)
       this.$axios({
      method: "get",
      url: this.$store.state.webApi + "api/ExHpoAxpline",
      params: { boguid: this.$store.state.chatStore.data.jobid || this.$store.state.chatStore.data.boguid},
      loading: false,
      tip: false
    })
      .then(results => {
        this.inputModelDatas = results.data;
        console.log(this.inputModelDatas)
      })
      .catch(error => {
        console.log(error);
      });
    },

    // 聊天定位到底部
    scrollToBottom() {
      let chatRoom = document.getElementById("chatRoom");
      chatRoom.scrollTop = chatRoom.scrollHeight;
    },
    search() {
      this.historyChatDataList = [];
      this.chatContent.forEach(item => {
        if (item.inputConent && item.inputConent.includes(this.searchData)) {
          this.historyChatDataList.push(item);
        }
      });
      if (this.searchData === "") {
        this.historyChatDataList = this.chatContent;
      }
      console.log("================");
      console.log(this.historyChatDataList);
    },
    send() {

    console.log(this.orderFormInfo.data.mawb)
    console.log(this.orderFormInfo.data.pono)
      let that = this;
        console.log("===================");
        // console.log(that.$store.state.pushMessageList)
       console.log(that.orderFormInfo.data.qfsj)
       
        console.log("===================");
      const obj = {
        messageId: Number(
          Math.random()
            .toString()
            .substr(3, length) + Date.now()
        ).toString(36),
        boguid: that.orderFormInfo.data.boguid,
        guid: that.orderFormInfo.data.guid,
        mawb: that.orderFormInfo.data.mawb,
        pono: that.orderFormInfo.data.pono,
        messagetype: "textmessage",
        loginName: localStorage.getItem("usrname"),
        calllist: that.contactList,
        inputConent: that.$refs.inputConents.innerHTML ,
        time: currentDate,
        czman: localStorage.getItem("usrname"),
        logExtraData: that.$store.state.logExtraDataForBuild,
        nodelist:that.$store.state.orderNodenameList,
        hbh:that.orderFormInfo.data.hbh,
        hbrq:that.orderFormInfo.data.hbrq !== '' ? that.orderFormInfo.data.hbrq.match(/\d{4}.\d{1,2}.\d{1,2}/mg).toString() : '',
        qfsj:that.orderFormInfo.data.qfsj,
        // ybpiece:that.inputModelDatas.ybpiece.toString(),
        ybweight: that.inputModelDatas.ybweight !== '' ? that.inputModelDatas.ybweight.toString() : '', 
        ybvolume: that.inputModelDatas.ybvolume !== '' ? that.inputModelDatas.ybvolume.toString() : '',
        realpiece: that.inputModelDatas.realpiece !== '' ? that.inputModelDatas.realpiece.toString() : '',
        realweight: that.inputModelDatas.realweight !== '' ? that.inputModelDatas.realweight.toString() : '',
        realvolume: that.inputModelDatas.realvolume !== '' ? that.inputModelDatas.realvolume.toString() : '',
        gid:that.inputModelDatas.gid,
        fid:that.inputModelDatas.fid,
        sfg:that.inputModelDatas.sfg,
        mdg:that.inputModelDatas.mdg,
      };
      console.log( that.orderFormInfo)
      if (that.$websoketGlobal.ws && that.$websoketGlobal.ws.readyState == 1) {
        console.log("连接状态依然是成功的");
        that.$websoketGlobal.ws.send(JSON.stringify(obj));
        that.$refs.inputConents.innerHTML = "";
        that.contactList = []


        // this.$store.commit("setWebsoketPushChatData", {
        //   obj: obj
        // });
      }
    },

    // 获取选中的工具栏类型
    getToolType(val) {
      if (val === 1) {
        this.emojisStatus = true;
        this.uploadStatus = false
        this.selectTools = 1
      } else if (val === 2) {
        this.uploadStatus = true;
        this.emojisStatus = false;
        this.selectTools = 2
      }
    },
    formatTime(val){

    },
    // 获取选中的表情
    getEmojis(val) {
      this.$refs.inputConents.innerHTML += val;
      this.emojisStatus = false;
    },
    // 过滤联系人
    filterMatch(name, chunk) {

      return name.toLowerCase().indexOf(chunk.toLowerCase()) === 0;
    },
    // 删除联系人
    deleteMatch(name, chunk, suffix) {
      // alert(chunk.trim())
      console.log(chunk.trim());
      this.contactList = this.contactList.filter(
        item => item.logname != chunk.trim()
      );
      return chunk === name + suffix;
    },
    // 获取联系人
    getValue(val) {
      console.log(val)
      this.contactList.push({ logname: val});
    },
    fileChange(file, fileList) {
      this.fileList = this.fileList.push(fileList)
    },
    // 上传文件
    async httpRequest(options) {
      console.log(options)
      console.log(this.fileList)
      let that = this;

      //每个文件切片大小
      const bytesPerPiece = 1024 * 2048;

      const { name, size } = options.file;
      

      const chunkCount = Math.ceil(size / bytesPerPiece);
      // 获取到文件后，发送文件的基本信息

      const fileBaseInfo = {
        fileName: name,
        fileSize: size,
        segments: "historymessage",
        loginName: localStorage.getItem("usrname"),
        pono: that.orderFormInfo.data.pono,
        mawb: that.orderFormInfo.data.mawb,
        boguid: that.orderFormInfo.data.boguid,
        guid: that.orderFormInfo.data.guid,
        time: new Date().toLocaleString(),
        chunkSize: bytesPerPiece,
        chunkCount: chunkCount,
        messagetype: "bufferfile",
        process: "begin",
        isNotUpload: false,
         czman: localStorage.getItem("usrname"),
         logExtraData: that.$store.state.logExtraDataForBuild,
        nodelist: this.$store.state.orderNodenameList
      };
      if (this.showDocStatus === true) {
        fileBaseInfo.isNotUpload = true;
        fileBaseInfo.groupid= that.selectDocType.groupid;
        fileBaseInfo.typename = that.selectDocType.typename;
      }

      
      let start = 0;

      // 进行分片
      var blob = options.file.slice(start, start + bytesPerPiece);
      //创建`FileReader`
      var reader = new FileReader();
      //开始读取指定的 Blob中的内容, 一旦完成, result 属性中保存的将是被读取文件的 ArrayBuffer 数据对象.
     reader.readAsArrayBuffer(blob);
      //读取操作完成时自动触发。
      reader.onload = function(e) {
        if(start === 0 ) {
            that.$websoketGlobal.ws.send(JSON.stringify(fileBaseInfo));
        }
        // 发送文件流
        that.$websoketGlobal.ws.send(reader.result);
        start += bytesPerPiece;
        if (start < size) {
          var blob = options.file.slice(start, start + bytesPerPiece);
         reader.readAsArrayBuffer(blob);
        } else {
          fileBaseInfo.process = "end";
        that.$websoketGlobal.ws.send(JSON.stringify(fileBaseInfo));
        }
        that.uploadStatus = false;
        that.fileList = [];
         this.selectDocType = ""
        this.selectDocTheir = ""
      };
    },
    getFile() {
      this.$refs.upload.submit();
    },
    initDoc() {
      this.$axios({
        method: "get",
        url: this.$store.state.imageWebApi + "api/RankDoc",
        params: {},
        tip: false
      }).then(res => {
        this.docData = res.data;
        let arr = [];
        res.data.forEach(i => {
          arr.push({ name: i.name });
        });
        console.log(arr);
        this.docTheirList = arr;
      });
    },
    uploadFile() {
      this.$refs.upload.submit();
    },
    loadDoc() {
      // this.showDocStatus = !this.showDocStatus;
      this.initDoc();
    },
    showDigest() {
      alert(this.inputModelData);
    },
    closeShowUpload(){
      this.uploadStatus = false;
      this.selectDocType = ""
      this.selectDocTheir = ""
    }
  },

  updated() {
    this.scrollToBottom();
    //this.chatContent = this.$store.state.websoketPushChatData.data
    //this.historyChatDataList = this.$store.state.websoketPushChatData.data
  },

  mounted() {
    
    // console.log(this.inputModelDatas)
    this.getDeatil()
    // 聊天数据
 
      this.chatContent = this.$store.state.websoketPushChatData.data



    this.scrollToBottom();
    // document.onkeydown = function(event) {
    //   if (event.ctrlKey && window.event.keyCode == 65) {
    //     //禁用ctrl + a 功能
    //     return false;
    //   }
    // };
    document.addEventListener("click", e => { 
      console.log(e.target.className)
      if ( e.target.className === "message-item right" ||  e.target.className === "message-item left"  ||  e.target.className === "heads" || e.target.className === "showContent"  ) {
        this.emojisStatus = false;
        this.uploadStatus = false;
        this.selectDocType = ""
        this.selectDocTheir = ""
      }

    });



    const contact = JSON.parse(localStorage.getItem("comContact"));
    for (let index = 0; index < contact.length; index++) {
      if(contact[index].logname === localStorage.getItem("usrname")){
        contact.splice(index,1)
      }
      
    }
    this.contactListContainer = contact.map(item => item.logname);





    this.scrollToBottom();
    console.log(this.$store.state.contactList);
    if (this.$store.state.contactList) {
      var str = "";
      this.$store.state.contactList.forEach(item => {
        console.log(item.logname);
        str += `@${item.logname}`;
      });

      this.$refs.inputConents.innerHTML += str;
    }


 
  }
};
</script>

<style lang="less" scoped>
.roomContainer {
  width: 100%;
  // height: 100%;
  display: flex;
  flex-direction: column;
  .head {
    height:40px;
    padding: 9px 15px;
    color: #999999;

    // border-bottom: 1px solid #;
    box-shadow: 0px 1px 0px #e8e8e8;
    position: relative;
    .digest {
      width: 100%;
      height: 0px;
      // background:red;
    }
    .minimize{
      position: absolute;
      right: 70px;
      top: 15px;
      cursor: pointer;
    }
    .full {
      position: absolute;
      right: 40px;
      top: 15px;
      cursor: pointer;
    }
    .close {
      position: absolute;
      right: 16px;
      top: 15px;
      cursor: pointer;
    }
    .infoListStyle {
      width: 90%;
      
      position: absolute;
      right: 100px;
      top: 0px;
      z-index: 99999999999;
    }
    .showOrderInfo {
      position: absolute;
      right: 65px;
      top: 6px;
      cursor: pointer;
    }
    .orderNumber {
      font: normal normal bold 14px/20px Arial;
      color: #0f5a8c;
    }
  }

  .body {
    display: flex;
    flex-wrap: wrap;
    .leftContainer {
      display: flex;
      flex-direction: column;
      .showContent {
        width: 100%;
        height: 560px;
        display: flex;
        flex-direction: column;
        overflow-y: scroll; //超出高度滚动
        scrollbar-width: none;
        position: relative;
        .message-item {
          .system {
            width: 100%;
            text-align: center;
            color: #999999;
            font-size: 12px;
            white-space: nowrap;
            /* 2.溢出的部分隐藏起来 */
            overflow: hidden;
            /* 3. 文字溢出的时候用省略号来显示 */
            text-overflow: ellipsis;
          }
          .heads {
            height: 17px;
            line-height: 17px;
            display: flex;
            flex-wrap: wrap;
            border: none;
            margin: 4px 10px;
            .name {
              font-size: 12px;
              color: #222222;
            }
            .time {
              font-size: 12px;
              margin-left: 10px;
              color: #999999;
            }
          }
          .fillContainer {
            color: #ffffff;
            width: 180px;
            height: 80px;
            border-radius: 5px;
            margin: 5px 10px;
            padding: 10px;
            background: #f8f8f8 0% 0% no-repeat padding-box;

            .inContainer {
              width: 160px;
              height: 60px;
              background: #ffffff;
              display: flex;
              justify-content: center;
              align-items: center;
              position: relative;
              cursor: pointer;
              .icon {
                width: 29px;
                height: 35px;
                position: absolute;
                top: 12px;
                left: 7px;
              }
              .title {
                width: 100px;
                color: #222222;
                position: absolute;
                top: 10px;
                left: 45px;
                font-size: 12px;
                white-space: nowrap;
                /* 2.溢出的部分隐藏起来 */
                overflow: hidden;
                /* 3. 文字溢出的时候用省略号来显示 */
                text-overflow: ellipsis;
              }
              .download {
                position: absolute;
                top: 37px;
                left: 46px;
                color: #0f5a8c;
                font-size: 12px;
              }
            }
          }
          .message {
            min-width:30px;
            max-width: 400px;
            height: max-content;
            border-radius: 5px;
            margin: 5px 10px;
            padding: 5px;
            white-space:normal;
         word-break:break-all;
         word-wrap:break-word; 
            background: #f8f8f8 0% 0% no-repeat padding-box;
            .fillContainer {
              color: #ffffff;
              width: 180px;
              height: 80px;
              border-radius: 5px;
              margin: 5px 10px;
              padding: 10px;
              // background: #F8F8F8 0% 0% no-repeat padding-box;
              background: #0188fb 0% 0% no-repeat padding-box;
            }
          }
          .message /deep/ img {
            width: 80px !important;
            height: 40px !important;
          }
        }
        .left {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
        }
        .right {
          width: 400px;
          height:max-content;
          display: flex;
          position: relative;
          flex-direction: column;
          align-items: flex-end;

          // 大 -614  小-301
          .message {

            color: #ffffff;
            width: max-content;
            border-radius: 5px;
            margin: 5px 10px;
            padding: 5px;
            background: #0188fb 0% 0% no-repeat padding-box;
            white-space:normal;
            word-break:break-all;
            word-wrap:break-word; 
          }
          .fillContainer {
            color: #ffffff;
            width: 180px;
            height: 80px;
            border-radius: 5px;
            margin: 5px 10px;
            padding: 10px;
            // background: #F8F8F8 0% 0% no-repeat padding-box;
            background: #0188fb 0% 0% no-repeat padding-box;
            .inContainer {
              width: 160px;
              height: 60px;
              background: #ffffff;
              display: flex;
              justify-content: center;
              align-items: center;
              position: relative;
              cursor: pointer;
              .icon {
                width: 29px;
                height: 35px;
                position: absolute;
                top: 12px;
                left: 7px;
              }
              .title {
                width: 100px;
                color: #222222;
                position: absolute;
                top: 10px;
                left: 45px;
                font-size: 12px;
                white-space: nowrap;
                /* 2.溢出的部分隐藏起来 */
                overflow: hidden;
                /* 3. 文字溢出的时候用省略号来显示 */
                text-overflow: ellipsis;
              }
              .download {
                position: absolute;
                top: 37px;
                left: 46px;
                color: #0f5a8c;
                font-size: 12px;
              }
            }
          }
        }
      }
      .showContent::-webkit-scrollbar {
        display: none; //谷歌隐藏滚动条
      }
      .sendContent {
        width: 100%;
        height: 220px;
        position: relative;
        // border-top: 1px solid #dbd7d7;
        border: none;
        .tools {
          height: 17px;
          line-height: 17px;
          padding:1px;
          display: flex;
          flex-wrap: wrap;
          position: relative;
          -webkit-box-shadow:0px 0px 0px 1px #e8e8e8;
          box-shadow: 0px 0px 0px 1px #e8e8e8;
          .tools-item {
            color: #666666;
            margin: 0 5px;
          }
          .emojisContainer {
            width: 300px;
            height: 200px;
            overflow-y: scroll; //超出高度滚动
            scrollbar-width: none;
            border-radius: 5px;
            position: absolute;
            bottom: 22px;
            left: 0px;
            -moz-box-shadow: 2px 1px 11px #333333;
            -webkit-box-shadow: 2px 1px 11px #333333;
            box-shadow: 2px 1px 11px #333333;
            background: #ffffff;
            ul {
              width: 100%;
              display: flex;
              flex-wrap: wrap;
              li {
                width: 30px;
                height: 30px;
                margin: 5px 10px;
              }
            }
          }
          .emojisContainer::-webkit-scrollbar {
            display: none; //谷歌隐藏滚动条
          }
        }

        .uploadContainer {
          width: 300px;
          height: 335px;
          display: flex;
          border: 1px dashed rgb(230, 224, 224);
          background: white;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          //  background: red;
          position: absolute;
          top: -340px;
        
          
            .closeUpload{
              position: absolute;
              right:12px;
              top: 10px;
            }
      
          .el-switch {
            height: 45px;
          }
          .operate {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: center;
            .btnSend {
              height: 20px;
              margin: 10px 0px;
            }
          }
        }
        .inputContent {
          height: 144px;
          overflow-y: scroll; //超出高度滚动
          scrollbar-width: none;
        }
        .inputContent /deep/ img {
          width: 80px !important;
          height: 40px !important;
        }
        .sendButton {
          background: #0f5a8c 0% 0% no-repeat padding-box;
          color: #ffffff;
          position: absolute;
          right: 21px;
          bottom: 2px;
        }
        .inputContent::-webkit-scrollbar {
          display: none; //谷歌隐藏滚动条
        }
      }
    }
    .rightContent {
      height: 803px;
      overflow: hidden;
      border-left: 1px solid #bbbbbb;
      .tip {
        height: 30px;
        line-height: 10px;
        display: flex;
        flex-wrap: wrap;
        color: #666666;
        font-size: 12px;
        margin: 10px 15px;
      }
      .historyData-Head {
        margin: -13px 15px;
        display: flex;
        flex-wrap: wrap;
        .search {
          width: 300px;
        }
        .searchBtn {
          color: #ffffff;
          font-size: 14px;
          margin: 0 8px;
          background: #0f5a8c 0% 0% no-repeat padding-box;
        }
      }
      .historyData-Body {
        height: 100%;
        margin: -13px 20px;
        display: flex;
        flex-direction: column;
        padding: 20px 0px;
        border-top: 1px dashed #bbbbbb;
        overflow-y: scroll; //超出高度滚动
        scrollbar-width: none;
        .message-item {
          .heads {
            height: 17px;
            line-height: 17px;
            display: flex;
            flex-wrap: wrap;
            border: none;
            margin: 4px 10px;
            .name {
              font-size: 12px;
              color: #222222;
            }
            .time {
              font-size: 12px;
              margin-left: 10px;
              color: #999999;
            }
          }
          .fillContainer {
            color: #ffffff;
            width: 180px;
            height: 80px;
            border-radius: 5px;
            margin: 5px 10px;
            padding: 10px;
            background: #f8f8f8 0% 0% no-repeat padding-box;

            .inContainer {
              width: 160px;
              height: 60px;
              background: #ffffff;
              display: flex;
              justify-content: center;
              align-items: center;
              position: relative;
              cursor: pointer;
              .icon {
                width: 29px;
                height: 35px;
                position: absolute;
                top: 12px;
                left: 7px;
              }
              .title {
                width: 100px;
                color: #222222;
                position: absolute;
                top: 10px;
                left: 45px;
                font-size: 12px;
                white-space: nowrap;
                /* 2.溢出的部分隐藏起来 */
                overflow: hidden;
                /* 3. 文字溢出的时候用省略号来显示 */
                text-overflow: ellipsis;
              }
              .download {
                position: absolute;
                top: 37px;
                left: 46px;
                color: #0f5a8c;
                font-size: 12px;
              }
            }
          }
          .message {
            width: max-content;
            border-radius: 5px;
            margin: 5px 10px;
            padding: 5px;
            background: #f8f8f8 0% 0% no-repeat padding-box;
            .fillContainer {
              color: #ffffff;
              width: 180px;
              height: 80px;
              border-radius: 5px;
              margin: 5px 10px;
              padding: 10px;
              // background: #F8F8F8 0% 0% no-repeat padding-box;
              background: #0188fb 0% 0% no-repeat padding-box;
            }
          }
          .message /deep/ img {
            width: 80px !important;
            height: 40px !important;
          }
        }
      }
      .historyData-Body::-webkit-scrollbar {
        display: none; //谷歌隐藏滚动条
      }
    }
    /deep/ .el-upload-dragger {
      width: 200px !important;
      height: 150px !important;
    }
  }
}
</style>
