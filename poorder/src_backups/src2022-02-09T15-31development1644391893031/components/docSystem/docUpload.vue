<template>
  <div>
    <el-dialog v-if="visible" :title="dialogTitle" center :visible.sync="visible"
      :class="{dialogPage:(system=='bo'&&!prevUpload)}" :close-on-click-modal="false" :close-on-press-escape="false"
      :width="prevUpload?'420px':(system=='bo'?'100%':'80%')" :top="system=='bo'?'0px':'4%'" :modal="system=='out'"
      @close="dialogClose" :style="dialogStyle">
      <slot name="infolist">
      </slot>
      <!-- <div v-if="docList.length==0&&!isediting" style="text-align:center">
          <svg t="1599471618624" class="icon" viewBox="0 0 1658 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2716" width="500" height="500"><path d="M116.303139 786.479504c0 112.412717 308.981404 203.530494 690.447511 203.735253 381.466107 0 690.857029-91.117776 691.061788-203.530494v-0.204759c0-112.412717-309.186163-203.530494-690.65227-203.530494-381.466107-0.204759-690.857029 90.913017-690.857029 203.530494z" fill="#EDE6D6" p-id="2717"></path><path d="M0 706.418716c0 12.080784 26.004399 21.909218 58.15157 21.909218s58.15157-9.828434 58.151569-21.909218c0-12.080784-26.004399-21.909218-58.151569-21.909218S0 694.542691 0 706.418716z m1512.35033 123.674465c0 15.971206 32.556689 29.075785 72.689462 29.075785s72.689462-12.89982 72.689462-29.075785c0-15.971206-32.556689-29.075785-72.689462-29.075784s-72.689462 12.89982-72.689462 29.075784z" fill="#EFEAD5" p-id="2718"></path><path d="M247.144171 227.896821v535.240152c0 17.814037 14.128374 33.170966 33.990002 37.061387l524.797441 103.40332V290.34833c-372.456709-47.29934-558.787443-68.184763-558.787443-62.451509z" fill="#FBE8D7" p-id="2719"></path><path d="M1358.576285 227.896821v535.240152c0 17.609278-14.128374 32.966207-33.785243 37.061387l-519.064187 103.608079-5.938013-613.458109c372.661468-47.29934 558.787443-68.184763 558.787443-62.451509z" fill="#E8C3A0" p-id="2720"></path><path d="M101.765247 426.308338l148.245551-211.925615 556.125575 67.980004-129.612478 253.082184-574.758648-109.136573z" fill="#FEF6EF" p-id="2721"></path><path d="M793.236553 278.472306L929.606079 532.987802l572.711058-116.917416-137.188563-203.735253L799.379324 278.472306h-6.142771z" fill="#F9DBC0" p-id="2722"></path><path d="M750.237153 159.09778h-32.556689c-44.023195 0-79.65127-35.628074-79.65127-79.651269C638.029194 35.628074 673.657269 0 717.680464 0h363.242551c44.023195 0 79.65127 35.628074 79.65127 79.65127s-35.628074 79.65127-79.65127 79.651269H827.226555" fill="#2878FF" opacity=".5" p-id="2723"></path><path d="M739.384923 108.727055c-15.971206 0.204759-29.280544-12.490302-29.690062-28.461508s12.490302-29.280544 28.461508-29.690062c15.971206-0.204759 29.280544 12.490302 29.485303 28.666267 0.409518 15.971206-12.285543 29.075785-28.256749 29.485303z m159.916817 0c-15.971206 0.204759-29.280544-12.490302-29.690062-28.461508s12.490302-29.280544 28.461507-29.690062c15.971206-0.204759 29.280544 12.490302 29.485303 28.666267 0.409518 15.971206-12.285543 29.075785-28.256748 29.485303z m159.916816 0c-15.971206 0-29.075785-13.104579-29.075785-29.075785s13.104579-29.075785 29.075785-29.075785c15.971206 0 29.075785 13.104579 29.075785 29.075785 0 15.971206-13.104579 29.075785-29.075785 29.075785z" fill="#FFFFFF" p-id="2724"></path><path d="M1042.428314 486.302739l2.661868-11.466506s-18.837832-15.561688-17.609278-33.170966c1.433313-17.609278 12.89982-28.256749 12.89982-28.256749h35.013797l-5.323735 59.380124 0.614277 10.033194-28.256749 3.480903z m43.20416 508.416717l0.614277 8.804639h12.080783l-2.04759-11.466507-10.64747 2.661868z" fill="#F6D0C3" p-id="2725"></path><path d="M1058.604279 1011.714457s1.433313-8.804639 7.371326-9.418916c5.323735-0.614277 26.413917 0.614277 32.351929 1.433313 0.614277 0 2.04759 0.614277 2.047591 2.047591v6.757048c0 1.433313-0.614277 2.04759-2.047591 2.047591H1058.604279v-2.866627z" fill="#333333" p-id="2726"></path><path d="M1021.542891 1004.138372l0.614278 8.804639h11.466506l-1.433313-11.466506-10.647471 2.661867z" fill="#F6D0C3" p-id="2727"></path><path d="M994.514697 1021.133373s1.433313-8.804639 7.371326-9.418916c5.323735-0.614277 26.413917 0.614277 32.351929 1.433313 0.614277 0 2.04759 0.614277 2.047591 2.047591v6.757049c0 1.433313-0.614277 2.04759-2.047591 2.04759h-39.928014v-2.866627z m89.889222-25.594881h13.514097l5.323736-143.126574c0-7.371326 1.433313-14.128374 2.661867-20.885423 6.757049-27.642472 21.704459-106.679464 17.609278-142.512298l-12.080783-20.885423-74.327535 4.095181s9.418916 87.022595 20.271146 121.422116c2.04759 6.757049 4.095181 13.514097 4.709458 20.271146l22.318736 181.621275z" fill="#333333" p-id="2728"></path><path d="M982.433913 663.214557l37.061388 342.971406h14.94741l7.371326-140.464707c0.614277-8.190362 2.04759-16.380724 4.095181-24.366327 8.190362-31.123375 30.304339-108.112777 28.256749-154.593081l-91.732054-23.547291z" fill="#3A3A3A" p-id="2729"></path><path d="M1144.39832 557.354129s12.080784 39.108978 10.85223 55.284943c-1.433313 14.128374-10.033193 51.394521-33.170966 56.103979l-0.614277-87.841631 21.704459-22.933014 1.228554-0.614277z m-180.802239 2.661868s-12.080784 39.108978-10.85223 55.284943c1.433313 14.128374 10.033193 51.394521 33.170966 56.103979l0.614277-87.841632-21.704459-22.933013-1.228554-0.614277z m74.122775-128.998201s6.142771-6.142771 10.85223-4.095181c5.323735 2.04759 6.142771 12.89982 3.276145 27.028195-2.661868 14.128374-15.561688-9.418916-15.561688-9.418916l1.433313-13.514098z" fill="#F6D0C3" p-id="2730"></path><path d="M1043.861628 427.741652c-4.095181 0.614277-8.804639-0.614277-11.466507-4.095181-4.095181-5.323735-8.804639-13.514097-4.095181-19.656869 7.371326-10.033193 27.642472-17.609278 45.866027-7.371326 18.223555 10.033193 20.271146 33.170966 20.271146 33.170966s-1.433313 41.770846-25.594881 41.770846h-6.142772c-2.661868 0-5.323735-2.04759-6.142771-4.095181-3.276145-8.804639-4.709458-18.223555-4.095181-27.642471v-6.142772c-0.614277-5.938012-4.504699-6.757049-8.59988-5.938012z" fill="#333333" p-id="2731"></path><path d="M1146.445911 557.968406c-16.995001-35.013797-46.480304-59.175365-60.813437-69.413317-3.890422-3.071386-6.961808-4.914217-8.190362-5.528494-4.709458-2.04759-27.642472 0-37.061388 2.04759-1.842831 0.409518-4.914217 2.25235-8.804639 4.709458-14.742651 8.59988-52.623075 33.170966-70.846631 70.846631l22.318736 36.447111 0.204759-0.20476-0.819036 73.918017c0 4.095181 2.04759 8.190362 5.323735 8.804639 71.665667 34.39952 121.422116 16.790242 134.321936 10.852229 2.04759-0.614277 4.095181-2.661868 4.095181-4.709458 3.685663-24.571086 3.071386-62.45151 1.023795-95.008198l19.247351-32.761448z" fill="#2878FF" p-id="2732"></path><path d="M250.010798 214.382723l466.85063 71.05139v-118.760248l-4.29994-0.409518z" fill="#E0BC9C" p-id="2733"></path><path d="M785.865227 289.119776l579.468106-76.784643L712.561488 166.264347V284.615077l73.303739 4.504699z" fill="#FBECDA" p-id="2734"></path></svg>
            <div>
             <el-button
             size="medium"
              type="primary"
              :disabled="isediting"
              v-if="system=='bo'"
              @click="addTab()"
            >新增上传</el-button>
            </div>
    </div>
    <div v-else> -->
      <!-- {{typeDataAll}} -->
      <!-- <div style="text-align:right;margin-bottom:12px">
        <el-button size="small" type="primary" :disabled="isediting" v-if="system=='bo'" @click="addTab()">新增上传
        </el-button>
      </div> -->
      <!-- {{isInited}} -->
      <!-- {{prevUpload}} -->
      <!-- {{selectTableIndex}} -->
      <!-- {{servicecode}} -->
      <!-- {{docupData.typename}} -->
      <el-button-group style="margin-top: 20px;margin-bottom: 15px;" size="small" class="buttonTabs"
        v-if="system=='bo'&&!prevUpload">
        <el-button v-for="(item,index) in firstLevelTab" :key="index" style="height: 32px;"
          :style="{border:index==firstLevelIndex?'1px solid #0F649B':''}" :type="index==firstLevelIndex?'primary':''"
          @click="tabChange(index)">
          {{item}}
        </el-button>
      </el-button-group>
      <el-tabs type="border-card" @tab-click="tabclick" v-if="docList.length&&firstLevelIndex==0&&!prevUpload">
        <el-tab-pane :label="item.name" v-for="item in typeData" :key="item.name">
          <span slot="label">{{item.name}}
            <el-badge :value="(item.name=='总览'?docList.length:item.listlength)">
            </el-badge>
          </span>
          <span v-for="(list,index) in item.typelist" class="typelist" v-show="list.typename!='总览'" :key="index"
            :class="{checked:domindex==index}" @click="domindex=index;canceladd()">
            <el-badge :value="list.listlength">
              <small style="margin-right: 12px">{{list.typename}}</small>
            </el-badge>
          </span>
        </el-tab-pane>
      </el-tabs>
      <div style="margin:20px 0;position:relative">
        <div class="main">
          <div class="main-detail">
            <newFormCmpt v-if="isediting&&system=='bo'&&!prevUpload" :view-data.sync="docviewData"
              :model-data.sync="docupData" :pagetype="2"></newFormCmpt>
            <el-divider v-if="isediting&&!prevUpload"></el-divider>
            <div class="docdetail" style="display:flex;flex-wrap:wrap">
              <commonTable :head="tableHead" :tableData="docList" draggable style="width:100%" isMultiSelect
                v-show="!isediting&&!prevUpload">
                <template slot="operate" slot-scope="props">
                  <i class="el-icon-edit" @click="editInfo(props.data.row,props.data.index)"
                    v-if="checkedDocDom.autoupload!=1&&system=='bo'" :icondisabled="props.data.row.bgguid>0"
                    title="编辑此条进仓编号数据" style="margin-right:4px"></i>
                  <!-- <i class="el-icon-delete" @click="piliangDel(props.data.row.id)" title="删除" v-if="checkedDocDom.autoupload!=1"></i> -->
                  <i class="el-icon-download" title="下载" @click="piliangDownload(props.data.row.id)"></i>
                  <i @click="previewFileaddress=props.data.row.fileaddress;previewVisible=true"
                    :icondisabled="!props.data.row.canPreview" class="el-icon-view" title="预览"></i>
                </template>
              </commonTable>
              <!-- {{isediting}}
              {{editIndex}} -->
              <el-upload drag class="upload-demo" ref="upload" v-show="isediting&&editIndex==-1" multiple
                :action="$store.state.imageWebApi + 'api/RankDoc'" :data="newUpData" :show-file-list="true"
                :on-error="upImgError" :before-upload="beforeUpload" :file-list="fileList" :auto-upload="false"
                :on-change="waitUpload" :on-remove="waitUpload">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                  <template v-if="!prevUpload">
                    <p>
                      将文件拖到此处，或
                      <em>点击上传</em>;
                    </p>
                    <p>
                      选择文件后请点击
                      <strong @click="submitUpload">保存</strong>按钮
                    </p>
                  </template>
                  <p v-else>将文件拖到此处</p>

                </div>

              </el-upload>
              <!-- {{fileList}}
              {{newUpData}} -->
              <!-- {{pagetype}}
              {{docupData}}
              {{modelData}} -->
              <!-- {{sourceUpload}} -->
              <!-- {{modelData}} -->
              <div v-if="!prevUpload&&isediting&&editIndex==-1">
                <div style="height:190px"></div>
                <div>
                  <div v-for="item in waitUploadFiles">
                    <my-select title="文档类型" itemstyle="margin-bottom:0px;margin-top:3px" :clearable="false"
                      class="input-required" :value.sync="sourceUpload[item.uid]"
                      :options="docviewData.typename.options"></my-select>
                  </div>
                </div>
              </div>


            </div>


          </div>
        </div>

      </div>

      <div v-if="!prevUpload">
        <template v-if="showBtnGroup">
          <el-button style="margin-left: 10px;" size="small" type="primary" v-if="!isediting"
            @click="piliangDownload()">
            批量下载</el-button>
          <el-button style="margin-left: 10px;" size="small" type="primary" @click="piliangDel()"
            v-if="!isediting&&checkedDocDom.autoupload!=1&&system=='bo'">批量删除</el-button>
          <a :href="sendMail"
            style="width:76px;height:28px;text-align:center;line-height:28px;background:#0f5a8c;margin-left: 10px;display:inline-block;color:#fff;border-radius:3px;"
            v-if="!isediting&&checkedDocDom.autoupload!=1&&system=='bo'" @click="getMail">{{pagetype==1?'预发送':'发送'}}</a>
          <!-- <el-button style="margin-left: 10px;" size="small" type="primary" @click="send()"
              v-if="!isediting&&checkedDocDom.autoupload!=1&&system=='bo'">
              <a href="https://www.baidu.com/">预发送</a>
            </el-button> -->
        </template>

        <el-button style="margin-left: 10px;" size="small" type="primary" v-show="(isediting||editIndex!=-1)"
          @click="submitUpload">保存</el-button>
        <el-button style="margin-left: 10px;" size="small" type="primary" v-show="isediting&&!isadd&&firstLevelIndex==0"
          @click="canceladd()">
          取消编辑</el-button>
        <!-- </div> -->
      </div>
    </el-dialog>

    <el-dialog v-if="previewVisible&&previewFileaddress" title="文档预览" center :visible.sync="previewVisible" width="80%"
      top="2%" append-to-body>
      <embed :src="previewFileaddress" style="width:100%"
        :style="{height:(previewFileaddress.includes('pdf')||previewFileaddress.includes('txt'))?'800px':'100%'}">
    </el-dialog>

  </div>
</template>
<script>
  export default {
    props: {
      selectTableIndex: {//传入-1时默认显示上传面板
        type: [Number, String],
        default: ''
      },
      dialogShow: {
        type: Boolean,
        default: false,
      },
      pagetype: {
        type: [Number, String],
        default: 1, //1文档管理 2 订单详细
      },
      modelData: {//外面列表传入的选中行的数据或者详细修改页面的详细订单信息
        type: Object,
        default: () => {
          return { batchno: "", khjcno: "", mawb: "", hawb: "", bggys: "", sjr: "", kdnumber: "", typename: '', ready01: '', fid: '', gid: '', jydw: '', customername: '' };
        },
      },
      dialogPosition: {//弹窗的定位
        type: Object,
        default: () => { }
      },
      system: {//系统
        type: String,
        default: 'bo' //bo 或者 out外网 
      },
      defaultFunc: {
        type: Boolean,
        default: false,
      },
      prevUpload: {//是否是预上传，通过拖拽文件到查询列表，此时只显示拖拽上传的框
        type: Boolean,
        default: false,
      },
      jcnoList: {//进仓编号数组
        type: Array,
        default() {
          return []
        }
      },
      servicecode: {
        type: String,
        default: ''//详细页面点击服务的servicecode，据此选择相应的文档所属
      },
      imgdocCheckedList: {//文档数据
        type: Array,
        default: () => []
      },
      deleteIds: {//被删除文件的id
        type: Array,
        default: () => []
      },
      showBtnGroup: {//是否显示按钮组
        type: Boolean,
        default: true
      }
    },
    components: {},
    data() {
      return {
        typeDataAll: [],//全部的文档类型
        // typeData: [],//有文档的，需要显示的
        sourceindex: 0,
        domindex: 0,
        isadd: false,      //是否是直接新增
        firstLevelTab: ['文档预览', '文档上传'],
        firstLevelIndex: 0,
        docviewData: {
          ready01: {
            required: true,
            type: 4,
            title: "文档所属",
            options: [
            ],
            hidden: true,
            initialField: 'typename'
          },
          typename: {
            // required: true,
            type: 4,
            title: "文档类型",
            options: [
            ],
            hidden: true
          },
          mawb: {
            title: '总运单号',
            type: 1,
            required: true,
            hidden: true
          },
          khjcno: {
            //required: true,
            required: false,
            type: 33,
            title: "进仓编号",
            idStyle: { width: "100%" },
            options: [

            ]
          },
          jydw: {
            type: 1,
            title: "经营单位",
            hidden: true
          },
          bggys: { title: "报关供应商", type: 20, pagetype: 3, hidden: true,required: false },
          sjr: {
            title: "快递收件人",
            type: 20,
            pagetype: 9,
          },
          kdnumber: {
            type: 1,
            title: "快递单号",
          },
          fid: {
            title: "委托客户",
            type: 11,
            linkage: "gid",
            hidden: true,
            required: false
          },
          gid: {
            title: "项目",
            type: 10,
            contentStyle: {
              display: "flex"
            },
            showCustomerRel: false,
            required: false,
            hidden: true
          },
          customername: {
            type: 1,
            title: "客服负责人",
            disabled: true,
            hidden: true
          },

        },
        docupData: {
          batchno: '',
          khjcno: "",
          bggys: "",
          sjr: "",
          kdnumber: "",
          typename: '',
          ready01: "",
          fid: '',
          gid: '',
          jydw: '',
          customername: ''
        },
        fileList: [],
        docList: [],
        ifNeedRefresh: false,
        editableTabsValue: "-1",
        editableTabs: [
          // {
          //   title: '正在编辑',
          //   name: '1'
          // }
        ],
        tabIndex: 1,
        isediting: false, //是否正在编辑
        editIndex: -1,
        //  khjcnoList:['正在编辑'],
        tableHead: [
          { title: '操作', field: 'operate' },
          { title: '文档批次号', field: 'batchno' },
          { title: '文档名', field: 'rel_filename' },
          { title: '文档所属', field: 'ready01' },
          { title: '文档类型', field: 'typename' },
          { title: '客户进仓编号', field: 'khjcno' },
          { title: '总运单号', field: 'mawb' },
          { title: '分运单号', field: 'hawb' },
          { title: '报关供应商', field: 'bggysname' },
          { title: '快递收件人', field: 'sjr' },
          { title: '快递单号', field: 'kdnumber' },
          { title: '创建人', field: 'addman' },
          { title: '创建时间', field: 'adddate', formatType: 1, format: 'yyyy-MM-dd hh:mm' },
        ],
        previewVisible: false,
        previewFileaddress: '',
        peihuoKhjcno: [],
        waitUploadFiles: [],//已选中准备上传的文档列表
        sourceUpload: {},
        sendMail: 'javascript:void(0)',//outlook地址
        isInited: false,//是否已经初始化，用于使initFunc方法只执行一次
      };
    },
    methods: {
      initFunc() {
        if (this.isInited) return;
        this.getJiedianInfo().then(() => {
          this.$watch(
            () => {
              return this.docupData.ready01
            }, (val) => {
              if (val) {
                let typelist = this.typeDataAll.filter(i => i.name == val)[0].typelist;
                this.docviewData.typename.options = typelist.filter(i => !this.autouploadArr.includes(i.typename)).map(i => { return { label: i.typename, value: i.typename, servicecode: i.servicecode } });
                ['bggys', 'fid', 'gid', 'jydw', 'customername'].forEach(i => {
                  this.docviewData[i].hidden = this.docupData.ready01 != '报关'
                })

                if(val=='报关'){
                   ['khjcno','bggys','fid','gid'].forEach(i=>{
                  this.docviewData[i].required = true
                })
                }
                // ['khjcno','bggys','fid'].forEach(i=>{
                //   this.docviewData[i].required = this.docupData.ready01 == '报关'
                // })
                if (this.docviewData.typename.options.length == 1) {
                  this.docupData.typename = this.docviewData.typename.options[0].value
                }
                if (this.servicecode) {
                  let arr = this.docviewData.typename.options.filter(i => i.servicecode == this.servicecode);
                  if (arr.length == 1) {
                    this.docupData.typename = arr[0].value
                  }
                }
              }
            }, { immediate: true })

          this.$watch(
            () => {
              return this.docupData.fid + this.docupData.gid
            }, (val) => {
              if (!this.docupData.fid || !this.docupData.gid) {
                this.docupData.customername = ""
              } else {
                this.$axios({
                  method: "get",
                  params: { sid: this.docupData.gid, system: '空出', timestamp: 0, relarea: this.orderArea, area: this.orderArea },
                  url: this.$store.state.publicWebApi + "api/PubCustomRel",
                  loading: false,
                  tip: false,
                  nofield: true,
                }).then((results) => {
                  this.docupData.customername = results.data.filter(i => i.lxrtitle == "客服" && i.lxrss == 1).length ? results.data.filter(i => i.lxrtitle == "客服" && i.lxrss == 1)[0]['name'] : ''
                  //console.log(results.data)
                });
              }
            })


          this.$watch(() => {
            return this.docupData.typename
          }, (val) => {
            //if(val){
            //      let groupid = ''
            // let ready01 = this.docupData.ready01 && this.docupData.typename && this.typeDataAll.filter(i => i.name == this.docupData.ready01)
            // if (this.docupData.ready01 && this.docupData.typename && ready01.length) {
            //   let typename = ready01[0].typelist.filter(i => i.typename == this.docupData.typename)
            //   groupid = typename.length && typename[0].groupid || ''
            // }

            Object.keys(this.sourceUpload).forEach(i => {
              console.log(i)
              // if(!this.sourceUpload[i]){
              this.sourceUpload[i] = val
              // this.sourceUpload.groupid = groupid
              // }
            })
            // }
          })
        });


        this.$watch(
          () => {
            return this.sourceindex + this.domindex + this.docList
          }, () => {
            // this.docviewData.bggys.hidden=this.checkedDocDom.typename!=='报关资料'
            this.docList.forEach(i => {
              i.thisListHide = true;
              if (this.checkedDocDom.typename == '总览') {
                i.thisListHide = false
              } else {
                if (i.typename == this.checkedDocDom.typename) {
                  i.thisListHide = false
                }
              }
            }
            )
          }, { immediate: true, deep: true })

        if (this.pagetype == 2) {
          this.getPeihuoInfo()
        }

        this.isInited = true;
      },
      tabChange(index) {
        this.firstLevelIndex = index;
        if (index == 0) {
          this.canceladd()
        } else {
          this.addTab()
        }
      },
      getMail() {
        if (!this.getIds()) {
          this.sendMail = 'javascript:void(0)'
          return
        } else {
          let datatype = this.pagetype == 1 ? '配单预发送' : '本票文档'
          this.sendMail = `mailpro:[{datatype:'${datatype}',docid:'${this.getIds()}',czman:'${localStorage.usrname}',boguid:'${this.modelData.boguid?this.modelData.boguid:'-1'}'}]`
        }
      },
      addTab(type = 1) {
        //type=1 新增 2编辑
        this.isediting = true;
        this.docupData = { ...this.modelData }
        this.docviewData.ready01.hidden = type == 2
        this.docviewData.typename.hidden = type == 2

      },
      selectReady01() {//根据服务选择文档所属
        if (this.servicecode) {
          this.typeDataAll.forEach(i => {
            i.typelist.forEach(e => {
              if (e.servicecode == this.servicecode) {
                this.docupData.ready01 = i.name
              }
            })
          })
        }
      },
      canceladd(index) {
        if (!this.defaultFunc) {
          this.isediting = false;
          this.docList.forEach(i => i.checked = false)
          this.editIndex = -1;
          this.docupData = {}
        } else {
          this.dialogClose();
          this.$emit('update:dialogShow', false)
        }

      },
      editInfo(item, index) {
        this.addTab(2)
        this.editIndex = index
        this.docList.forEach((i, k) => i.checked = k == index)
        this.docupData = { ...item }
      },
      removeTab(targetName) {
        let tabs = this.editableTabs;
        let activeName = this.editableTabsValue;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }

        this.editableTabsValue = activeName;
        this.editableTabs = tabs.filter((tab) => tab.name !== targetName);
      },
      dialogClose() {
        this.$emit('update:prevUpload', false)
        this.$emit('close', true)

        if (this.ifNeedRefresh) {
          this.$emit("success", true);
        }

      },
      upImgSuccess(response, file, fileList) {
        // console.log(response)
        // console.log(file)
        // console.log(fileList)

        this.$message.success("上传成功！");
        this.$emit("success", true);
        this.fileList = [];
        this.ifNeedRefresh = true;
        this.isadd = false
        setTimeout(() => {
          this.getDocList();
        }, 150);
      },
      upImgError(err, file, fileList) {
        this.$message.error("上传失败！");
      },
      /**
      * 自定义上传文件
      * @param fileList 文件列表
      * @param data 上传时附带的额外参数
      * @param url 上传的URL地址
      * @param success 成功回调
      * @param error 失败回调
      */
      uploadFiles({ uploadFiles, headers, data, action, success, error }) {
        let form = new FormData()
        // 文件对象
        console.log(uploadFiles)
        uploadFiles.map(file => form.append("filedatas", file.raw))
        // 附件参数
        for (let key in data) {
          form.append(key, data[key])
        }
        console.log(form)
        let xhr = new XMLHttpRequest()
        // 异步请求
        xhr.open("post", action, true)
        // 设置请求头
        // xhr.setRequestHeader("Authorization", getToken());
        xhr.onreadystatechange = function () {
          if (xhr.readyState == 4) {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
              success && success(xhr.responseText)
            } else {
              error && error(xhr.status)
            }
          }
        }
        xhr.send(form)
      },
      submitUpload() {
        if(this.docupData.ready01=='报关'&&(!this.docupData.khjcno||!this.docupData.bggys||!this.docupData.fid||!this.docupData.gid)){
          return this.$message.info('请完善上传信息')
        }
        // for (let item of this.waitUploadFiles) {
        //   if (!this.sourceUpload[item.uid]) {
        //     return this.$message.error(`请选择“${item.name}”的文档类型！`);
        //   }
        // }

        // if (this.$refs.upload.uploadFiles.length) {
        //   this.$refs.upload.submit();
        // } else {
        // if (this.docList.filter(i => i.checked).length == 0) {
        //   return this.$message.error('请先上传文档或选择要编辑的文档！');
        // }
        // let data = new FormData();

        if (this.docupData.id && this.docupData.batchno) {//修改
          //console.log('2')
          this.$axios({
            method: "put",
            url: this.$store.state.imageWebApi + "api/RankDoc",
            data: this.docupData,
            loading: true,
            tip: false,
          }).then(response => {
            console.log(typeof response)
            console.log(response.data)
            if (response.data.resultstatus == 0) {
              this.upImgSuccess()
            } else {
              this.$message.error(response.data.resultmessage)
            }
          })
        } else {//新增
//console.log('1')
          let { uploadFiles, action, data } = this.$refs.upload
          console.log(uploadFiles);


          if (uploadFiles.length == 0) {
            return this.$message.error("请选择上传文件！");
          }

          // if (!this.docupData.khjcno) {
          //   return this.$message.error("请填写进仓编号！");
          // }

          this.newUpData.ids = this.docList.filter(i => i.checked).map(i => i.id).toString()


          let ready01 = this.typeDataAll.filter(i => i.name == this.docupData.ready01)

          for (let i of uploadFiles) {
            let source = this.sourceUpload[i.uid] || this.newUpData.source;
            i.source = source;
            // console.log(source)
            if (ready01.length) {
              let typename = ready01[0].typelist.filter(i => i.typename == source)
              i.groupid = typename.length && typename[0].groupid || ''
            }
            if (!i.source) {
              return this.$message.error(`请选择“${i.name}”的文档类型！`);
            }
          }



          data.uploadFiles = JSON.stringify(uploadFiles.map(i => {
            return {
              name: i.name,
              groupid: i.groupid,
              source: i.source
            }
          }));
          if(data.khjcno==undefined){
            data.khjcno=''
          }
          console.log(data)
          this.$store.state.showloading = true;
          this.uploadFiles({
            uploadFiles,
            data,
            action,
            success: (response) => {
              // console.log(111111)
              // console.log(response)
              // 上传成功后，将里面的内容删除
              // this.$refs.upload.clearFiles();
              // this.$refs.uploadPicture.clearFiles();
              // console.log(response)
              // console.log(typeof response)
              // console.log(JSON.parse(response))
              // console.log(JSON.parse(response).resultno)
              response = response && JSON.parse(response) || {}
              this.docupData.batchno = response.resultno;
              if (response.resultstatus == 0) {
                this.upImgSuccess()
              } else {
                this.$message.error(response.resultmessage)
              }
              this.$store.state.showloading = false
            },
            error: (error) => {
              this.$store.state.showloading = false
              console.log('失败了', error);
            }
          })
        }

      },
      /* 
            submitUpload() {
      
              // if (!this.$store.state.systemCheck || this.$store.state.systemCheck.includes(",")) {
              //   return this.$message.error('请选择有且仅有一个系统！');
              // }
              //  if (!this.docupData.typename) {
              //   return this.$message.error("请选择文档类型！");
              // }
              if (!this.docupData.khjcno) {
                return this.$message.error("请填写进仓编号！");
              }
              for (let item of this.waitUploadFiles) {
                if (!this.sourceUpload[item.uid]) {
                  return this.$message.error(`请选择“${item.name}”的文档类型！`);
                }
              }
      
              if (this.$refs.upload.uploadFiles.length) {
                this.$refs.upload.submit();
              } else {
                if (this.docList.filter(i => i.checked).length == 0) {
                  return this.$message.error('请先上传文档或选择要编辑的文档！');
                }
                let data = new FormData();
                this.newUpData.ids = this.docList.filter(i => i.checked).map(i => i.id).toString()
                this.newUpData.timestamp=new Date().getTime()
                Object.keys(this.newUpData).forEach((i) => {
                  data.append(i, this.newUpData[i]);
                });
                //  console.log(data);
                //  return
                this.$axios({
                  method: "POST",
                  headers: {
                    "Content-Type":
                      "multipart/form-data; boundary=----WebKitFormBoundaryYfJNBhectl6o0cJf",
                  },
                  data,
                  url: this.$store.state.imageWebApi + "api/RankDoc",
                  loading: true,
                  tip: false,
                  nofield: true,
                }).then((results) => {
                  if (results.data.resultstatus == 0) {
                    this.$message.success(results.data.resultmessage);
                    this.ifNeedRefresh = true;
                    if (this.pagetype == 1) {
                      // this.$emit('update:modelData',this.docupData)
        
                       setTimeout(() => {
                        this.getDocList();
                      }, 400);
                    }
      
                  } else {
                    this.$message.error(results.data.resultmessage);
                  }
                });
              }
            }, */
      getPeihuoInfo() {
        //配货查询预报信息及其已配货的信息
        if (this.pagetype != 2 || this.system == 'out') return;

        this.$axios({
          method: "get",
          url: this.$store.state.webApi + "api/Store/GetYbList",
          params: { hpoid: this.modelData.guid, area: this.orderArea },
          noarea: true,
          loading: true,
          tip: false
        }).then(results => {
          // console.log(1111)
          // console.log(results.data)
          this.docviewData.khjcno.type = 4;
          // this.peihuoKhjcno=results.data
          let arr = []
          results.data.forEach(i => {
            arr.push(i.khjcno)
            arr.push(i.autoMapRealList.map(e => e.khjcno))
            arr.push(i.realList.map(e => e.khjcno))
          })
          arr = [...new Set(arr.flat())].filter(i => !!i);

          this.docviewData.khjcno.options = arr.map(i => { return { label: i, value: i } })


        })
      },
      tabclick(e) {
        //  this.sourceindex = this.typeData.findIndex(i=>i.name==e.label);
        this.sourceindex = e.index;
        this.domindex = 0;
        this.canceladd()
      },

      async getJiedianInfo() {
        //获取节点
        await this.$axios({
          method: "get",
          url: this.$store.state.imageWebApi + "api/RankDoc",
          params: {},
          loading: true,
          tip: false,
        }).then((res) => {
          // console.log(res);
          this.typeDataAll = res.data;
          this.docviewData.ready01.options = res.data.map(i => { return { label: i.name, value: i.name, servicecode: i.servicecode } })
          this.selectReady01()
          if (!this.prevUpload) {
            this.getDocList();
          } else {
            this.$emit("update:prevUpload", false)
          }
        });
      },
      getDocList() {
        //获取文档列表
        setTimeout(() => {
          this.fileList = [];
          this.waitUploadFiles = []
          this.sourceUpload = {}
          let json = {};
          if (this.pagetype == 2) {
            json.pono = this.modelData.pono;
          } else {
            // json.khjcno = this.docupData.khjcno || this.modelData.khjcno;
            json.batchno = this.docupData.batchno || this.modelData.batchno;

          }
          // console.log(json)
          this.getRankDoc(json).then(data => {
            let docList = []
            docList = data;
            if (data.length && !this.isadd) {
              this.canceladd()
            } else {
              // this.isadd=true
              // this.addTab()
            }
            docList.forEach(i => {
              i.checked = false;
              this.$set(i, 'thisListHide', false)
              i.style = i.id == this.modelData.id ? { fontWeight: "bold" } : ''
              i.filenameSuffix = i.rel_filename && i.rel_filename.split('.')[1]//文档后缀
              i.canPreview = ['pdf', 'txt', 'jpg', 'png', 'jpeg', 'tif', 'gif', 'pcx', 'tga', 'exif', 'fpx', 'svg'].includes(i.filenameSuffix)//文档是否可预览
              i.autoupload = !this.autouploadArr.includes(i.typename)
              i.checkboxdisable = !i.autoupload && !this.system == 'out'
            });
            this.docList = docList
            this.isadd = false;
            this.updateList()

          })

        }, 200);

      },
      updateList() {
        this.$emit("update:imgdocCheckedList", this.docList)
      },
      async getRankDoc(json) {
        // console.log(json)
        // "api/RankDoc" 
        if (json.batchno || json.pono) {
          return await this.$axios({
            method: "get",
            url: this.$store.state.imageWebApi + "api/RankDoc",
            params: json,
            loading: true,
            tip: false,
          }).then((res) => {
            return res.data
          })
        } else {
          if (this.pagetype == 1 && this.modelData.rel_filename) {
            return [this.modelData];
          } else {
            return []
          }
        }

      },
      getIds(id) {
        let ids = "";
        if (!id) {
          ids = this.docList
            .filter((i) => i.checked)
            .map((i) => i.id)
            .toString();
          if (!ids) {
            this.$message.error("请先选择文件!");
            return false;
          }
        } else {
          ids = id;
        }
        return ids
      },
      piliangDel(id) {
        if (!this.getIds(id)) return;
        this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.$axios({
            method: "delete",
            url: this.$store.state.imageWebApi + "api/RankDoc",
            data: { ids: this.getIds(id) },
            loading: true,
            tip: false,
            noarea: true
          }).then((results) => {
            this.ifNeedRefresh = true;
            if (results.data.resultstatus == 0) {
              this.$message.success(results.data.resultmessage);
              //this.getDocList();
              this.docList = this.docList.filter(i => !i.checked)
            } else {
              this.$message.error(results.data.resultmessage);
            }
          });
        });
      },
      piliangDownload(id) {
        if (!this.getIds(id)) return;
        window.open(
          `${this.$store.state.imageWebApi}api/DownLoad?ids=${this.getIds(id)}`,
          "_blank"
        );
      },
      send(id) {
        if (!this.getIds(id)) return;
        this.$axios({
          method: "POST",
          data: { czman: localStorage.usrname, ids: this.getIds(id) },
          url: this.$store.state.webApi + "api/PdMailPre",
          loading: true,
          tip: false,
          nofield: true,
        }).then((results) => {
          if (results.data.resultstatus == 0) {
            this.$message.success(results.data.resultmessage);
          } else {
            this.$message.error(results.data.resultmessage);
          }
        });
      },
      waitUpload() {
        //如果同时上传多个文件，会触发多次此方法
        if (this.typeDataAll.length == 0) {//在预上传时，初始数据是在拖入文件后去取；正常上传是在created里面取；要避免多次初始化
          this.initFunc();
        }
        this.waitUploadFiles = this.$refs.upload && this.$refs.upload.uploadFiles;
        this.waitUploadFiles.forEach(i => {
          this.$set(this.sourceUpload, i.uid, this.sourceUpload[i.uid] || this.docupData.typename || '')
        })
      },
      beforeUpload(file) {//每个文档上传的时候修改source
        //  console.log(file)
        if (file.uid) {
          this.newUpData.source = this.sourceUpload[file.uid] || this.newUpData.source
          // console.log(this.newUpData)
          let groupid = ''
          let ready01 = this.typeDataAll.filter(i => i.name == this.docupData.ready01)
          if (ready01.length) {
            let typename = ready01[0].typelist.filter(i => i.typename == this.newUpData.source)
            groupid = typename.length && typename[0].groupid || ''
          }
          this.newUpData.groupid = groupid
        }
      }
    },
    watch: {
      // domindex:{
      //    handler(){
      //      alert(this.checkedDocDom.typename)
      //      if(this.checkedDocDom.typename){
      //       this.docList.forEach(i=>i.thisListHide=i.typename!=this.checkedDocDom.typename)
      //      }
      //    },immediate:true
      // }
      isediting(val) {
        if (val == false) {
          this.firstLevelIndex = 0;
        }
      },
      servicecode: {
        handler() {
          this.selectReady01()
        }, immediate: true
      },
      deleteIds(val) {
        if (val.length) {
          this.docList = this.docList.filter(i => !val.includes(String(i.id)))
          this.updateList()
        }
      }

    },
    created() {

      this.isadd = this.selectTableIndex == -1

      if (this.isadd) {
        this.sourceindex = 1
        this.firstLevelIndex = 1
        this.addTab()
      }
      if (this.modelData) {
        ['batchno', 'khjcno', 'bggys', 'sjr', 'kdnumber', 'fid', 'gid', 'jydw', 'customername'].forEach(i => {
          // this.docupData[i] = this.modelData[i];
          this.$set(this.docupData, i, this.modelData[i])
        })
      }
      if (this.defaultFunc) {
        this.addTab()
        this.docupData.ready01 = '报关'
        this.docviewData.khjcno.type = 4
        this.jcnoList.forEach(i => {
          this.docviewData.khjcno.options.push({ label: i, value: i })
        })
        //console.log(this.docviewData.khjcno)
        // this.docupData.typename = '报关资料'
      }

      if (!this.prevUpload) {
        this.initFunc()
      }

    },
    computed: {
      orderArea() {
        return this.area || this.modelData.area || this.$store.state.areaState
      },
      dialogTitle() {
        return this.prevUpload ? `${this.modelData.shipperno}` : "文档操作"
      },
      dialogStyle() {
        if (this.prevUpload) {
          return {
            height: '400px',
            width: '430px',
            left: this.dialogPosition.x + 'px',
            top: this.dialogPosition.y + 'px',
          }
        } else {
          return {
            'min-height': '600px',
          }
        }
      },
      typeData() {//有文档的，需要显示的
        let obj = []
        let typename = [...new Set(this.docList.map(i => i.typename))]
        let num = 0;
        // console.log(typename)
        if (typename.length) {
          this.typeDataAll.forEach((i, k) => {
            let ready01length = this.docList.filter(e => e.ready01 == i.name)
            if (ready01length.length) {
              obj.push({ name: i.name, typelist: [], listlength: ready01length.length });
              let typelist = this.typeDataAll[k].typelist
              typelist.forEach(n => {
                let arr = this.docList.filter(e => e.typename == n.typename)
                if (arr.length) {
                  n.listlength = arr.length
                  obj[num].typelist.push(n)
                }
              })
              num += 1;
            }
          })
        }
        return [{ name: '总览', typelist: [{ typename: "总览", groupid: '' }], listlength: this.docList.length }, ...obj]
      },
      khjcnoList() {
        let arr = [];
        let list = this.pagetype == 1 ? this.docList : this.peihuoKhjcno
        arr = [...new Set(list.filter(i => i.khjcno).map(i => i.khjcno))];
        this.docviewData.khjcno.options = arr.map(i => { return { label: i, value: i } })
        return [...arr, '正在编辑']
      },
      autouploadArr() {
        let arr = []
        // this.typeDataAll.forEach(i=>{
        //   i.typelist.forEach(e=>{
        //      if(e.autoupload==1){
        //        arr.push(e.typename)
        //      }
        //   })
        // })
        return arr
      },
      visible: {
        get() {
          return this.dialogShow;
        },
        set(val) {
          this.$emit("update:dialogShow", false);
        },
      },
      checkedDocDom() {
        return this.typeData.length && this.typeData[this.sourceindex]
          ? this.typeData[this.sourceindex].typelist[this.domindex]
          : { groupid: '', typename: "", autoupload: 2 };
        //autoupload 是否自动上传，1自动 2手动
      },
      newUpData() {
        //console.log(this.checkedDocDom)
        let groupid = ''
        let ready01 = this.docupData.ready01 && this.docupData.typename && this.typeDataAll.filter(i => i.name == this.docupData.ready01)
        if (this.docupData.ready01 && this.docupData.typename && ready01.length) {
          let typename = ready01[0].typelist.filter(i => i.typename == this.docupData.typename)
          groupid = typename.length && typename[0].groupid || ''
        }

        let bggysname = ''
        if (this.docupData.bggys > 0) {
          bggysname = getxmdata('gysxm').filter(i => i.id == this.docupData.bggys)[0].usr_name
        }
        let kdnumber = this.docupData.kdnumber || ""
        let fid = this.docupData.fid || ""
        let gid = this.docupData.gid || ""
        let jydw = this.docupData.jydw || ""
        let customername = this.docupData.customername || ""
        let bggys = this.docupData.bggys || ''
        let sjr = this.docupData.sjr || ''
        let source = this.docupData.typename || ""
        let area = this.$store.state.areaState;
        let system = this.$store.state.systemCheck;

        let obj = {
          jobno: "",
          batchno: this.docupData.batchno || '',
          khjcno: this.docupData.khjcno,
          bggys,
          bggysname: bggysname,
          sjr,
          kdnumber,
          fid,
          gid,
          jydw,
          customername,
          area,
          system,
          mawb: this.modelData.mawb || "",
          addman: localStorage.usrname || "",
          dom: "kcdoc",
          ids: "",
          source,
          hawb: this.modelData.hawb || "",
          groupid: groupid || "",
          belong: this.docupData.ready01 || ''
        };
        obj.jobno = this.pagetype == 1 ? '' : this.modelData.pono
        return obj
      },
    },
  };
</script>


<style scoped lang="less">
  .main {
    border: 1px solid #e8e8e8;
    padding: 14px;
  }

  .main-title {
    height: 40px;
    display: flex;
    align-items: center;
    background: #F2F2F2;
    border-bottom: 1px solid #e8e8e8;

    span {
      display: flex;
      height: 40px;
      min-width: 120px;
      padding: 0 10px;
      align-items: center;
      justify-content: center;
      border-right: 1px solid #e8e8e8;
      margin-bottom: -1px;
      color: #256a94;
      font-weight: 600;
      cursor: pointer;
    }

    span.checked {
      background: #fff;
    }
  }

  .main-detail {
    padding-top: 15px;
  }

  .docdetail {
    margin-bottom: 20px;

    // border: 1px solid #e8e8e8;
    &:last-child {
      margin-bottom: 0;
    }

    .detail-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 32px;
      text-indent: 8px;
      font-size: 14px;
      font-weight: bolder;
      color: #0f5a8c;
      background: #f8f8f8;
      border-bottom: 1px solid #e8e8e8;
    }

    .detail-c {
      padding: 20px;
    }

    .detail-items {
      width: 220px;
      margin-right: 15px;
      height: 180px;
      margin-bottom: 15px;
      display: grid;
      justify-content: center;
      align-items: center;
      border: 1px dashed #d9d9d9;
      padding: 20px 0px;
      position: relative;

      span.rel_filename {
        display: inline-flex;
        max-width: 160px;
        text-align: center;
      }

      .fileIcno {
        display: block;
        font-size: 18px;
        position: absolute;
        background: #606266;
        color: #fff;
        font-weight: 600;
        left: 55px;
        top: 34px;
        width: 50px;
      }

      p {
        cursor: pointer;
        height: 100%;
        display: grid;
        align-items: center;
      }
    }

    .detail-items:hover {
      border-color: #409eff;
    }
  }

  .typelist {
    display: inline-flex;
    min-width: 100px;
    padding: 0 12px;
    border-radius: 210px;
    border: 1px solid #e8e8e8;
    align-items: center;
    justify-content: center;
    color: #666;
    height: 28px;
    margin-right: 15px;
    cursor: pointer;
  }

  .checked {
    background: #0e5a8c;
    color: #fff;
  }

  .radioCheckbox {
    /deep/ span {
      border-radius: 50%;
    }
  }

  a:hover {
    background: #0d4c77 !important
  }
</style>