<template>
  <div style="padding:0 10px;">
    <!-- {{imgList}} -->
    <div v-if="imgList.length==0" style="text-align:center">
      <svg t="1599471618624" class="icon" viewBox="0 0 1658 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
        p-id="2716" width="500" height="500">
        <path
          d="M116.303139 786.479504c0 112.412717 308.981404 203.530494 690.447511 203.735253 381.466107 0 690.857029-91.117776 691.061788-203.530494v-0.204759c0-112.412717-309.186163-203.530494-690.65227-203.530494-381.466107-0.204759-690.857029 90.913017-690.857029 203.530494z"
          fill="#EDE6D6" p-id="2717"></path>
        <path
          d="M0 706.418716c0 12.080784 26.004399 21.909218 58.15157 21.909218s58.15157-9.828434 58.151569-21.909218c0-12.080784-26.004399-21.909218-58.151569-21.909218S0 694.542691 0 706.418716z m1512.35033 123.674465c0 15.971206 32.556689 29.075785 72.689462 29.075785s72.689462-12.89982 72.689462-29.075785c0-15.971206-32.556689-29.075785-72.689462-29.075784s-72.689462 12.89982-72.689462 29.075784z"
          fill="#EFEAD5" p-id="2718"></path>
        <path
          d="M247.144171 227.896821v535.240152c0 17.814037 14.128374 33.170966 33.990002 37.061387l524.797441 103.40332V290.34833c-372.456709-47.29934-558.787443-68.184763-558.787443-62.451509z"
          fill="#FBE8D7" p-id="2719"></path>
        <path
          d="M1358.576285 227.896821v535.240152c0 17.609278-14.128374 32.966207-33.785243 37.061387l-519.064187 103.608079-5.938013-613.458109c372.661468-47.29934 558.787443-68.184763 558.787443-62.451509z"
          fill="#E8C3A0" p-id="2720"></path>
        <path
          d="M101.765247 426.308338l148.245551-211.925615 556.125575 67.980004-129.612478 253.082184-574.758648-109.136573z"
          fill="#FEF6EF" p-id="2721"></path>
        <path
          d="M793.236553 278.472306L929.606079 532.987802l572.711058-116.917416-137.188563-203.735253L799.379324 278.472306h-6.142771z"
          fill="#F9DBC0" p-id="2722"></path>
        <path
          d="M750.237153 159.09778h-32.556689c-44.023195 0-79.65127-35.628074-79.65127-79.651269C638.029194 35.628074 673.657269 0 717.680464 0h363.242551c44.023195 0 79.65127 35.628074 79.65127 79.65127s-35.628074 79.65127-79.65127 79.651269H827.226555"
          fill="#2878FF" opacity=".5" p-id="2723"></path>
        <path
          d="M739.384923 108.727055c-15.971206 0.204759-29.280544-12.490302-29.690062-28.461508s12.490302-29.280544 28.461508-29.690062c15.971206-0.204759 29.280544 12.490302 29.485303 28.666267 0.409518 15.971206-12.285543 29.075785-28.256749 29.485303z m159.916817 0c-15.971206 0.204759-29.280544-12.490302-29.690062-28.461508s12.490302-29.280544 28.461507-29.690062c15.971206-0.204759 29.280544 12.490302 29.485303 28.666267 0.409518 15.971206-12.285543 29.075785-28.256748 29.485303z m159.916816 0c-15.971206 0-29.075785-13.104579-29.075785-29.075785s13.104579-29.075785 29.075785-29.075785c15.971206 0 29.075785 13.104579 29.075785 29.075785 0 15.971206-13.104579 29.075785-29.075785 29.075785z"
          fill="#FFFFFF" p-id="2724"></path>
        <path
          d="M1042.428314 486.302739l2.661868-11.466506s-18.837832-15.561688-17.609278-33.170966c1.433313-17.609278 12.89982-28.256749 12.89982-28.256749h35.013797l-5.323735 59.380124 0.614277 10.033194-28.256749 3.480903z m43.20416 508.416717l0.614277 8.804639h12.080783l-2.04759-11.466507-10.64747 2.661868z"
          fill="#F6D0C3" p-id="2725"></path>
        <path
          d="M1058.604279 1011.714457s1.433313-8.804639 7.371326-9.418916c5.323735-0.614277 26.413917 0.614277 32.351929 1.433313 0.614277 0 2.04759 0.614277 2.047591 2.047591v6.757048c0 1.433313-0.614277 2.04759-2.047591 2.047591H1058.604279v-2.866627z"
          fill="#333333" p-id="2726"></path>
        <path d="M1021.542891 1004.138372l0.614278 8.804639h11.466506l-1.433313-11.466506-10.647471 2.661867z"
          fill="#F6D0C3" p-id="2727"></path>
        <path
          d="M994.514697 1021.133373s1.433313-8.804639 7.371326-9.418916c5.323735-0.614277 26.413917 0.614277 32.351929 1.433313 0.614277 0 2.04759 0.614277 2.047591 2.047591v6.757049c0 1.433313-0.614277 2.04759-2.047591 2.04759h-39.928014v-2.866627z m89.889222-25.594881h13.514097l5.323736-143.126574c0-7.371326 1.433313-14.128374 2.661867-20.885423 6.757049-27.642472 21.704459-106.679464 17.609278-142.512298l-12.080783-20.885423-74.327535 4.095181s9.418916 87.022595 20.271146 121.422116c2.04759 6.757049 4.095181 13.514097 4.709458 20.271146l22.318736 181.621275z"
          fill="#333333" p-id="2728"></path>
        <path
          d="M982.433913 663.214557l37.061388 342.971406h14.94741l7.371326-140.464707c0.614277-8.190362 2.04759-16.380724 4.095181-24.366327 8.190362-31.123375 30.304339-108.112777 28.256749-154.593081l-91.732054-23.547291z"
          fill="#3A3A3A" p-id="2729"></path>
        <path
          d="M1144.39832 557.354129s12.080784 39.108978 10.85223 55.284943c-1.433313 14.128374-10.033193 51.394521-33.170966 56.103979l-0.614277-87.841631 21.704459-22.933014 1.228554-0.614277z m-180.802239 2.661868s-12.080784 39.108978-10.85223 55.284943c1.433313 14.128374 10.033193 51.394521 33.170966 56.103979l0.614277-87.841632-21.704459-22.933013-1.228554-0.614277z m74.122775-128.998201s6.142771-6.142771 10.85223-4.095181c5.323735 2.04759 6.142771 12.89982 3.276145 27.028195-2.661868 14.128374-15.561688-9.418916-15.561688-9.418916l1.433313-13.514098z"
          fill="#F6D0C3" p-id="2730"></path>
        <path
          d="M1043.861628 427.741652c-4.095181 0.614277-8.804639-0.614277-11.466507-4.095181-4.095181-5.323735-8.804639-13.514097-4.095181-19.656869 7.371326-10.033193 27.642472-17.609278 45.866027-7.371326 18.223555 10.033193 20.271146 33.170966 20.271146 33.170966s-1.433313 41.770846-25.594881 41.770846h-6.142772c-2.661868 0-5.323735-2.04759-6.142771-4.095181-3.276145-8.804639-4.709458-18.223555-4.095181-27.642471v-6.142772c-0.614277-5.938012-4.504699-6.757049-8.59988-5.938012z"
          fill="#333333" p-id="2731"></path>
        <path
          d="M1146.445911 557.968406c-16.995001-35.013797-46.480304-59.175365-60.813437-69.413317-3.890422-3.071386-6.961808-4.914217-8.190362-5.528494-4.709458-2.04759-27.642472 0-37.061388 2.04759-1.842831 0.409518-4.914217 2.25235-8.804639 4.709458-14.742651 8.59988-52.623075 33.170966-70.846631 70.846631l22.318736 36.447111 0.204759-0.20476-0.819036 73.918017c0 4.095181 2.04759 8.190362 5.323735 8.804639 71.665667 34.39952 121.422116 16.790242 134.321936 10.852229 2.04759-0.614277 4.095181-2.661868 4.095181-4.709458 3.685663-24.571086 3.071386-62.45151 1.023795-95.008198l19.247351-32.761448z"
          fill="#2878FF" p-id="2732"></path>
        <path d="M250.010798 214.382723l466.85063 71.05139v-118.760248l-4.29994-0.409518z" fill="#E0BC9C" p-id="2733">
        </path>
        <path d="M785.865227 289.119776l579.468106-76.784643L712.561488 166.264347V284.615077l73.303739 4.504699z"
          fill="#FBECDA" p-id="2734"></path>
      </svg>
    </div>
    <!-- <el-drawer
  title="新建上传"
  :visible.sync="drawer"
  direction="ltr"
  size="600"
  >
  <div style="padding:0 15px;" v-if="pagetype!=2">
    <h4 style="">请选择照片类型：</h4>
    <div v-for="(item,index) in jiedianinfo" :key="item.name" style="margin-bottom:10px;">{{item.name}}：&nbsp;
        <el-radio-group v-model="newModularName" @change="newJiedianIndex=index;newLevelThreeIndex=0" >
            <el-radio :label="v.name" v-for="(v,index2) in item.nodeList" :key="v.name" @change="newModularIndex=index2" v-if="v.name!='车牌照片'">{{v.name}}</el-radio>
          </el-radio-group>

          <div style="padding-left:88px;" v-if="newJiedianIndex==index&&threeLevelModular[newModularName].length>0">
           <el-radio-group v-model="newLevelThreeIndex" style="margin-top:12px;font-size:12px;">
            <el-radio :label="i" v-for="(n,i) in threeLevelModular[newModularName]" :key='i'>{{n[n.filter]}}</el-radio>
          </el-radio-group>
          </div>

    </div>

    <el-upload
    style="display:inline-flex;margin-top:15px;margin-right:15px;"
  class="upload-demo"
  :action="$store.state.imageWebApi + 'api/RankImg'"
  :data='newUpImgData'
  :show-file-list="false"
  multiple
  :file-list="fileList"
  :on-success="upImgSuccess"
  :on-error="upImgError">
  <el-button size="small" type="primary">点击上传</el-button>
</el-upload>
  <el-button size="small" type="default" @click="drawer=false">返回</el-button>
  </div>
</el-drawer> -->

    <!-- <div style="margin-top:12px;">
  <el-button @click="drawer=true" size="small" style="margin-right:15px;" type="primary" v-if="pagetype!=2">新建上传</el-button>
    <el-upload
    style="display:inline-flex;"
  class="upload-demo"
  :action="$store.state.imageWebApi + 'api/RankImg'"
  :data='upImgData'
  :show-file-list="false"
  multiple
  :file-list="fileList"
  :on-success="upImgSuccess"
  :on-error="upImgError">
  <el-button size="small" type="primary" title="根据当前查看照片的节点直接上传！">快捷上传</el-button>
</el-upload>
</div> -->
    <div v-else>
      <h3 style="margin:10px 0;">{{mawb}}<span v-if="hawb">,{{hawb}}</span>照片数量({{imgList.length}})</h3>
      <!-- {{threeLevelModular}} -->
      <!-- {{imgList}} -->
      <!-- {{modularName}}
          {{imgList}} -->
      <!-- {{checkImgBox}} -->
      <!-- {{upImgData}}
      {{levelThreeIndex}} -->
      <!-- {{jiedianinfo}}
      {{jiedianIndex}} -->
      <div class="top">
        <div class="left" v-if="pagetype!=2" style="display:none">
          <h4>照片模式</h4>
          <div class="danhao">
            <!-- <div style="padding-left:6px;" v-if="mawb" @click="danhaoChecked=mawb" :class='{danhaoChecked:danhaoChecked==mawb}'> -->
            <div style="padding-left:6px;" v-if="mawb" @click="danhaoChecked=mawb">
              <input type="checkbox" @click="checkedImg($event,'mawb',mawb,2)">
              <span style="width:114px;">{{mawb}}</span>
              <span style="margin-left:6px;">({{imgList.filter(i=>i.mawb==mawb).length}})</span>
            </div>
            <!-- <div v-for="item in fendanData" :class='{danhaoChecked:danhaoChecked==item}' > -->
            <div v-for="item in fendanData" :key="item">
              <input type="checkbox" @click="checkedImg($event,'hawb',item,2)">
              <span style="width:114px;" @click.self="danhaoChecked=item">{{item}}</span>
              <span style="margin-left:6px;">({{imgList.filter(i=>i.hawb==item).length}})</span>
            </div>
          </div>

        </div>
        <div class="right">
          <!-- {{jiedianinfo}} -->
          <!-- {{imgList}} -->
          <div class="main">
            <div class="main-title">
              <span v-for="(item,index) in jiedianinfo"
                v-show="(jcno?index==0:true)&&imgList.filter(i=>i.dom.toUpperCase()==item.enName.toUpperCase()).length"
                :key="item.name" :class="{checked:index==jiedianIndex}"
                @click="jiedianIndex=index,modularIndex=0,modularName=item.nodeList[0].name,levelThreeIndex=0">{{item.name}}
                <el-badge :value="imgList.filter(i=>i.dom.toUpperCase()==item.enName.toUpperCase()).length">
                </el-badge>
              </span>


            </div>
            <div class="main-detail" style="padding:20px">
              <div class="jiedianModular">
                <template v-if="jiedianinfo[jiedianIndex]">
                  <div v-for="(item,index) in jiedianinfo[jiedianIndex].nodeList" :key="item.name"
                    v-show="item.name!='车牌照片'&&imgList.filter(i=>i.source==item.name).length"
                    :class="[index==modularIndex?'modularChecked':'modularNormal']"
                    @click="modularIndex=index,modularName=item.name,levelThreeIndex=0">
                    <el-badge :value="imgList.filter(i=>i.source==item.name).length">
                      <span>{{item.name}}</span>
                    </el-badge>
                    <!-- <span>({{imgList.filter(i=>i.source==item.name).length}})</span> -->
                  </div>
                </template>
              </div>
              <!-- {{checkImgBox}} -->
              <div class="imglist" style="margin-top:20px">
                <div v-for="(item,index) in threeLevelModular[modularName]"
                  :class="{imglistChecked:index==levelThreeIndex}" :key="item.id"
                  v-show="imgList.filter(i=>i.source==modularName&&i[item.filter]==item[item.filter]).length">
                  <span class='el-icon-s-tools' v-if="pagetype==2" @click="modifyPmcnoFunc(index)"></span>
                  <!-- <input type="checkbox" v-model="checkImgBox" :value="modularName+'@'+index" :filter="item.filter"
                    @click="checkedImg($event,item.filter,item[item.filter],1)" v-show="levelThreeIndex==index" /> -->
                  <span @click="levelThreeIndex=index">{{item[item.filter]}}</span>
                  <span
                    style="margin-left:6px;">({{imgList.filter(i=>i.source==modularName&&i[item.filter]==item[item.filter]).length}})</span>
                </div>
              </div>

            </div>
          </div>

          <!-- 
              <div class="jiedianType">
                <div
                  v-for="(item,index) in jiedianinfo"
                  v-show="jcno?index==0:true"
                  :key="item.name"
                  :class="{typeChecked:index==jiedianIndex}"
                  @click="jiedianIndex=index,modularIndex=0,modularName=item.nodeList[0].name,levelThreeIndex=0"
                >{{item.name}}</div>
              </div>
              <div class="jiedianModular"  v-if="pagetype!=2">
                <template v-if="jiedianinfo[jiedianIndex]">
                  <div
                    v-for="(item,index) in jiedianinfo[jiedianIndex].nodeList"
                    :key="item.name"
                    v-show="item.name!='车牌照片'"
                    :class="[index==modularIndex?'modularChecked':'modularNormal']"
                    @click="modularIndex=index,modularName=item.name,levelThreeIndex=0"
                  >
                    <span>{{item.name}}</span>
                    <span>({{imgList.filter(i=>i.source==item.name).length}})</span>
                  </div>
                </template>
              </div> -->
          <!-- <h4 v-if="pagetype!=2" style="margin-bottom:12px;">照片列表</h4> -->
          <!-- <div class="imglist">
                <div
                  v-for="(item,index) in threeLevelModular[modularName]"
                  :class="{imglistChecked:index==levelThreeIndex}"
                  :key="item.id"
                >
                <span class='el-icon-s-tools' v-if="pagetype==2" @click="modifyPmcnoFunc(index)"></span>
                  <input type="checkbox" v-model="checkImgBox" :value="modularName+'@'+index" :filter="item.filter" @click="checkedImg($event,item.filter,item[item.filter],1)"/><span @click="levelThreeIndex=index">{{item[item.filter]}}</span>
                  <span style="margin-left:6px;">({{imgList.filter(i=>i.source==modularName&&i[item.filter]==item[item.filter]).length}})</span>
                </div>
              </div> -->



        </div>
      </div>
      <div class=center>
        <div>
          <viewer :options="options" :images="images" @inited="inited" class="viewer" ref="viewer">
            <template slot-scope="scope">
              <el-carousel :interval="5000" arrow="always" type="card">
                <el-carousel-item v-for="(item,index) in scope.images" :key="item.id">
                    <div class="rePosition" :style="{'z-index':9999+Number(index)}">
                         <img :src="item.src" :id="item.id" v-mydrag >
                         <i class="el-icon-success" @click.stop="changeChecked(item)" :style="{color:imgList.filter(i=>i.id==item.id)[0]['checked']?'#14AE00':'#fff'}"></i>
                    </div>
                      
               
                  
                </el-carousel-item>
              </el-carousel>
            </template>
          </viewer>
        </div>
        
        <div style="text-align: right;margin-bottom: 10px;" v-for="(item,index) in threeLevelModular[modularName]"
          :class="{imglistChecked:index==levelThreeIndex}" :key="item.id"
          v-show="imgList.filter(i=>i.source==modularName&&i[item.filter]==item[item.filter]).length">
          <label>
           
            <input type="checkbox" v-model="checkImgBox" :value="modularName+'@'+index" :filter="item.filter"
              @click="checkedImg($event,item.filter,item[item.filter],1)" v-show="levelThreeIndex==index" style="opacity:0"/>
            <span class="mybutton"
              v-show="levelThreeIndex==index">{{(checkImgBox.includes(modularName+'@'+index))?"取消全选":"全选"}}</span>
            <span style="margin-left:-6px;"
              v-show="levelThreeIndex==index">({{getSourceImgLength(item,modularName+'@'+index)}})</span>
          </label>
        </div>

      </div>

      <!-- <div class="center">
                  <viewer :options="options" :images="images"
                  @inited="inited"
                  class="viewer" ref="viewer"
          >
            <template slot-scope="scope">
              <img v-for="src in scope.images" :src="src" :key="src">
            </template>
          </viewer>
          </div> -->
      <!-- {{checkImgBox}} -->
      <template v-if="!src">
        <div class="checklist">
          <p style="font-size:12px;margin-bottom:2px">选中照片列表：</p>
          <!-- <div class="mainfotter">
          <div class="thumbnailDiv" v-for="(item,index) in imgList" v-show="item.checked" :key="item.id">
            <el-image :src="item.fileaddress" fit="contain"></el-image>
            <span class='el-icon-circle-close mainfotterSpan' @click="item.checked=false"></span>
          </div>
        </div> -->
          <div class="mytable" v-mydrag="dragEnd">
            <div class="mytable-row" style="font-weight: bold;">
              <div>操作</div>
              <div>文档名</div>
              <div>文档类型</div>
              <div>进仓编号</div>
              <div>上榜工作号</div>
              <div>总运单号</div>
              <div>分运单号</div>
              <div>创建人</div>
              <div>创建时间</div>
            </div>
            <div class="mytable-row" v-for="(item,index) in imgList" v-if="item.checked" :key="item.id">
              <div>
                <i class="el-icon-delete tdi" title="删除,取消选中" @click="item.checked=false"></i>
                <i class="el-icon-view tdi" title="预览"
                  @click="previewFileaddress=item.fileaddress;previewVisible=true"></i>
              </div>
              <div>{{item.filename||'--'}}</div>
              <div>{{item.source||'--'}}</div>
              <div>{{item.jcno||'--'}}</div>
              <div>{{item.jobno||'--'}}</div>
              <div>{{item.mawb||'--'}}</div>
              <div>{{item.hawb||'--'}}</div>
              <div>{{item.addman||'--'}}</div>
              <div>{{item.adddate||'--'}}</div>
            </div>
          </div>


        </div>

        <div class="bottomgroup" style="text-align:right;padding:12px;margin-bottom: 30px;">
          <el-button @click="checkImgBox=[];imgList.forEach(i=>i.checked=false)" type="primary" size="small">清空选中
          </el-button>
          <el-button @click="piliangDel" type="primary" size="small" v-if="system=='bo'">批量删除</el-button>
          <a :href="sendMail" type="primary" class="mybutton" @click="getMail">批量发送</a>
          <el-button @click="piliangDownload" size="small" type="primary">批量下载</el-button>
        </div>




        <el-dialog v-if="previewVisible&&previewFileaddress" center :visible.sync="previewVisible" width="80%" top="2%"
          append-to-body>
          <embed :src="previewFileaddress" style="width:100%"
            :style="{height:(previewFileaddress.includes('pdf')||previewFileaddress.includes('txt'))?'800px':'100%'}">
        </el-dialog>
      </template>


    </div>
  </div>
</template>

<script>
  import 'viewerjs/dist/viewer.css'
  import Viewer from "v-viewer/src/component.vue"
  import {
    Message,
    Loading
  } from 'element-ui';
  export default {
    name: "index",
    props: {
      src: {//作为html时的文档地址,如果存在代表是作为.vue组件使用的
        type: String,
        default: ''
      },
      imgdocCheckedList: {//图片数据
        type: Array,
        default: () => []
      },
      InputModelsystem:{
        type:String,
        default:'空出'
      }
    },
    data() {
      return {
        jiedianinfo: [], //一级节点数据

        jiedianIndex: 0, //一级选中
        modularIndex: 0, //二级选中索引
        modularName: "", //二级选中名称
        levelThreeIndex: 0,//三级选中的节点索引

        newJiedianIndex: 0, //一级选中 新建上传
        newModularIndex: 0, //二级选中索引 新建上传
        newModularName: "", //二级选中名称 新建上传
        newLevelThreeIndex: 0,//三级选中的节点索引 新建上传

        imgList: [], //全部照片
        sourceData: [], //垫仓板数据
        chepaiData: [],//车牌
        banhaoData: [],//板号
        fendanData: [],//分单号
        jcno: '',
        mawb: '',
        pagetype: 1,//页面类型，1是普通照片页面 2是舱位照片页面
        system: 'bo', //bo 或者wff 外网
        pmconList: [],
        uploadButton: '',
        danhaoChecked: this.mawb,
        options: {},//图片预览插件配置项
        checkImgBox: [],//三级选中的多选框，用@分割二级和三级索引，[ "入库@0", "仓库称重@1" ]
        loadingOptions: {
          fullscreen: true,
          lock: true,
          spinner: 'el-icon-loading',
          text: 'Loading',
          background: 'rgba(0, 0, 0, 0.7)'
        }//loading配置
        ,
        fileList: [],//已上传文件列表
        drawer: false,//新建上传抽屉
        sendMail: '',
        previewVisible: false,//预览弹窗
        previewFileaddress: '',//预览地址
        deleteIds: {//被删除文件的id
          type: Array,
          default: () => []
        }
      };
    },
    components: { Viewer },
    mounted() {
      // console.log(this.getRequest.id)
      this.jobno = this.getRequest.jobno || "";
      this.mawb = this.getRequest.mawb || "";
      this.sid = this.getRequest.sid || "";
      this.cwid = this.getRequest.cwid || "";
      this.username = this.getRequest.username || "admin";
      this.mawbtype = this.getRequest.mawbtype || "";
      this.uploadButton = this.getRequest.uploadButton;
      this.jcno = this.getRequest.jcno || "";
      this.danhaoChecked = this.mawb
      this.pagetype = this.getRequest.pagetype || 1
      this.system = this.getRequest.system || "bo"
      this.boguid = this.getRequest.boguid || ""
      this.orderSystem=this.getRequest.orderSystem
      this.hawb=this.getRequest.hawb
      if (this.pagetype != 2) {
        this.getChepai();
      }
      if (this.cwid && this.pagetype == 2) {
        this.getShipaceInfo()
      }






    },
    // directives: {
    //   drag: (el, binding) => {
    //     let self = this;
    //     let ev = el; //获取当前元素
    //     console.log(el)
    //     console.log(binding)
    //     el.ondragstart = ev => {
    //        console.log(ev)
    //       ev.dataTransfer.setData(
    //         "Text",
    //         ev.target.id
    //       );
    //     };
    //     el.ondragover = ev => {
    //       ev.preventDefault();
    //     };
    //     el.ondrop = ev => {
    //       ev.preventDefault();
    //       let data = ev.dataTransfer.getData("Text");
    //       binding.value(ev, data);
    //     };
    //   }

    // },
    methods: {
      changeChecked(item){
        this.imgList.filter(i=>i.id==item.id)[0]['checked']=!this.imgList.filter(i=>i.id==item.id)[0]['checked']
        // this.checkImgBox.push('入库@0')
        // console.log(this.checkImgBox)
        // console.log(item)
        // console.log(this.modularName)
        // console.log(this.levelThreeIndex)
      },
      dragEnd(ev, innerText) {//拖拽事件
        //  console.log(ev)
        let pclass = ev.target.parentNode.className
        //  console.log(pclass)
        //  console.log(innerText)
        if (pclass == 'mytable-row' || pclass == 'checklist') {
          this.imgList.forEach(i => {
            if (i.id == innerText) {
              // console.log(1111111111)
              i.checked = true
            }
          })
        }
        //  console.log(innerText)
      },
      getSourceImgLength(item, name) {
        let all = this.imgList.filter(i => i.source == this.modularName && (i[item.filter] == item[item.filter]))
        let len = all.filter(i => i.checked).length
        if (len == 0 && this.checkImgBox) {
          let index = this.checkImgBox.findIndex((i) => {
            return i == name
          })
          // console.log(index)
          if (index >= 0) {
            this.checkImgBox.splice(index, 1)
          }
        }
        if (len > 0 && len == all.length) {
          if (!this.checkImgBox.includes(name)) {
            this.checkImgBox.push(name)
          }
        }
        return len;

      },
      getMail() {
        var ids = this.imgList.filter(i => i.checked).map(i => i.id).toString()

        if (!ids) {
          this.sendMail = 'javascript:void(0)';
          this.$message.error('请先选择照片！');
          return
        } else {
          this.sendMail = `mailpro:[{datatype:'本票照片',docid:'${ids}',czman:'${this.username}',boguid:'${this.boguid}'}]`
        }
      },
      upImgSuccess(response, file, fileList) {
        this.$message.success('上传成功！');
        this.getImageInfo()
      },
      upImgError(err, file, fileList) {
        this.$message.error('上传失败！');
      },
      inited(viewer) {
        this.$viewer = viewer
      },
      show() {
        this.$viewer.show()
      },
      checkedImg(e, filter, val, type) {
        //   console.log(e.target.checked)
        let checked = e.target.checked
        this.imgList.forEach(v => {
          if (type == 1) {
            if (v.source == this.modularName && v[filter] == val) {
              v.checked = checked
            }
          } else {
            if (v[filter] == val) {
              v.checked = checked
            }
          }

        })
        // console.log(this.imgList)
      },
      getGroupid() {
        this.$axios({
          method: "get",
          url: this.$store.state.publicWebApi + "api/PubTypeCode",
          params: { groupid: "22,53,158,160,161" },
          loading: false,
          tip: false
        }).then(res => {
          localStorage.setItem("groupType", JSON.stringify(res.data));

          var groupTypeCode = {};
          res.data.forEach(i => {
            let item = {
              ready01: i.ready01,
              typename: i.typename,
              ready02: i.ready02,
              ready03: i.ready03,
              ready04: i.ready04
            };
            if (!groupTypeCode[i.groupid]) {
              groupTypeCode[i.groupid] = [item];
            } else {
              groupTypeCode[i.groupid].push(item);
            }
          });
        });
      },
      modifyPmcnoFunc(index) {
        this.$prompt('请输入新的舱位版号', '修改版号', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /\S{1}/,
          inputErrorMessage: '不能为空'
        }).then(({ value }) => {

          this.$axios({
            method: "put",
            url: this.$store.state.imageWebApi + "api/ShipaceImg",
            data: { cwid: this.cwid, oldpmc: this.pmconList[index], newpmc: value.toUpperCase(), czman: this.username, logExtraData: 'PC' },
            loading: true,
            tip: false
          }).then(results => {
            if (results.data.resultstatus == 0) {
              this.$message.success(results.data.resultmessage);
              this.getShipaceInfo()
            } else {
              this.$message.error(results.data.resultmessage);
            }



          });

        }).catch(() => {

        });
      },
      getJiedianInfo() {
        //获取节点
        this.$axios({
          method: "get",
          url: this.$store.state.imageWebApi + "api/RankImg",
          params: { nodeName: "",system:this.orderSystem?decodeURIComponent(this.orderSystem):this.InputModelsystem},
          loading: true,
          tip: false
        }).then(res => {
          //console.log(res.data);
          var results=res.data
          // if(this.InputModelsystem=='空进'){
          //   this.jiedianinfo=results.filter(i=>i.name=='仓库照片');
          //   this.jiedianinfo.nodeList=results.filter(i=>i.name=='仓库照片')[0].nodeList.filter(i=>i.name=='入库')
          // }else{
            this.jiedianinfo=results
          // }
          this.modularName = this.jiedianinfo[0].nodeList[0].name;
          this.newModularName = this.jiedianinfo[0].nodeList[0].name;
        });
      },
      getImageInfo() {
        //获取图片
        if (this.cwid && this.pagetype == 2) {
          this.getShipaceInfo(); return
        }
        // if(window.$){
        //   $('.danhao').find("input:checkbox").prop("checked",false);
        // }
        this.checkImgBox = []
        this.imgList = [];
        var imgList = [];
        var data = {};

        if (this.jcno) {
          data = {
            jcno: this.jcno
          };
          // $('.ie7Hei').css({visibility: 'hidden'})
        } else {
          if(this.cwid){
            data = {
              jobno: this.jobno,
              mawb: this.mawb,
              cwid: this.cwid
            };
          }else{//入库货物监控页面
            data = {
              hawb: this.hawb,
              mawb: this.mawb
            };
          }
          
        }
        let loadingInstance = Loading.service(this.loadingOptions);

        this.$axios({
          method: "get",
          url: this.$store.state.imageWebApi + "api/RankImg",
          params: data,
          loading: true,
          tip: false
        }).then(res => {
          loadingInstance.close()
          // console.log(res);
          res.data.forEach(i => {
            imgList = imgList.concat(i.hawbList);
          });
          imgList.forEach(i => {
            i.checked = false;
          })
          this.imgList = imgList;
          this.updateList()
        });
      },
      updateList() {
        this.$emit("update:imgdocCheckedList", this.imgList)
      },
      getShipaceInfo() {
        //舱位信息
        this.$axios({
          method: "get",
          url: this.$store.state.imageWebApi + "api/ShipaceImg",
          params: { cwid: this.cwid },
          loading: true,
          tip: false
        }).then(res => {
          console.log(res.data)
          this.jiedianinfo = [{
            enName: 'KcWc',
            name: '板位照片',
            nodeList: [{ name: '交接', parentName: '板位照片' }]
          }]
          this.modularName = this.jiedianinfo[0].nodeList[0].name;
          let imgList = []
          let pmconList = []
          res.data.forEach(i => {
            imgList = imgList.concat(i.list);
            pmconList.push(i.pmcno)
          });
          imgList.forEach(i => {
            i.checked = false;
          })
          this.imgList = imgList;
          this.pmconList = pmconList
        });
      },
      getChepai() {
        let loadingInstance = Loading.service(this.loadingOptions);
        //获取车牌号
        this.$axios({
          method: "get",
          url: this.$store.state.imageWebApi + "api/RankImgExpand",
          params: { jobno: this.jobno },
          loading: true,
          tip: false
        }).then(results => {
          //   console.log(results);
          loadingInstance.close()
          if (!results.data) {
            return
          }

          let data = results.data
          // data.hawblist=["SHAAQN020098","SHAAQN020099","SHAAQN020107","SHAAQN020110","SHAAQN020113"]
          //this.sourceData=res.data

          //车牌
          this.chepaiData = data.trucklist;
          //板号
          this.banhaoData = data.pmclist.length > 0 ? data.pmclist.map(i => i.toUpperCase()) : [];

          //垫仓板
          if (data.jcdcblist && data.jcdcblist[0]) {
            this.sourceData = data.jcdcblist;
          }
          if (this.jcno) {
            this.sourceData = [];
          }

          this.fendanData = data.hawblist

          this.getJiedianInfo();
          this.getImageInfo();

        });
      },

      piliangDel() {

        var ids = this.imgList.filter(i => i.checked).map(i => i.id).toString()

        if (!ids) {
          this.$message.error("请先选择文件!");
          return false;
        }
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios({
            method: "delete",
            url: this.$store.state.imageWebApi + "api/RankImg",
            data: { ids: ids },
            loading: true,
            tip: false
          }).then(results => {
            if (results.data.resultstatus == 0) {
              this.$message.success(results.data.resultmessage);
              this.getImageInfo()
            } else {
              this.$message.error(results.data.resultmessage);
            }
          })

        })

      },
      piliangDownload() {
        var ids = this.imgList.filter(i => i.checked).map(i => i.id).toString()

        if (!ids) {
          this.$message.error("请先选择文件!");
          return false;
        }

        window.open(
          `${this.$store.state.imageWebApi
          }api/DownLoad?ids=${ids}`,
          "_blank"
        );


      },
    },
    computed: {
      getRequest() {
        //var url = location.search; //获取url中"?"符后的字串
        var url = this.src && this.src.substr(this.src.indexOf('?')) || location.search || this.$route.fullPath.substr(this.$route.fullPath.indexOf('?'));

        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
          var str = url.substr(1);
          let strs = str.split("&");
          for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = strs[i].split("=")[1];
          }
        }
        return theRequest;
      },
      threeLevelModular() {//根据二级节点显示三级节点
        let obj = {}
        if (this.pagetype != 2) {



          obj['入库'] = obj['仓库称重'] = obj['异常'] = obj['唛头'] = obj['出库'] = obj['异常'] = obj['整车照片'] = obj['车牌照片'] = obj['海关查验'] = obj['收货'] = obj['交接'] = obj['安检'] = []
          let mawbArr = [{ filter: 'mawb', mawb: this.mawb, guanLianHawb: this.mawb }]
          let results = this.sourceData
          if (this.jcno) {
            results = [{
              "hawb": this.jcno,
              "jcno": this.jcno
            }]
          }
          let arr1 = []
          let arr2 = []
          let arr3 = []
          results.forEach((v, k) => {
            if (this.jcno) {
              arr1.push({ filter: 'jcno', jcno: v.jcno, guanLianHawb: v.hawb })
            } else {
              arr1.push({ filter: 'jcno', jcno: v.jcno, guanLianHawb: v.hawb })
              v.dcbno.forEach((val, key) => {
                if (arr2.filter(n => n.dcbno == val).length == 0) {
                  arr2.push({ filter: 'dcbno', dcbno: val, guanLianHawb: v.hawb })
                }
              })
              if (arr3.filter(n => n.khjcno == v.khjcno).length == 0) {
                arr3.push({ filter: 'khjcno', khjcno: v.khjcno, guanLianHawb: v.hawb })
              }
            }
          })

          if (this.jcno) {
            obj['入库'] = obj['仓库称重'] = obj['异常'] = obj['唛头'] = obj['出库'] = arr1
          } else {
            obj['入库'] = obj['唛头'] = obj['出库'] = arr1.concat(arr3)
            obj['仓库称重'] = obj['异常'] = arr2
            obj['出库'] = obj['出库'].concat(mawbArr)
          }

          this.chepaiData.forEach(v => {
            obj['整车照片'] = obj['整车照片'].concat([{ filter: 'truckno', truckno: v }])
          })
          //  if(this.system=='wff') {
          obj['整车照片'] = obj['整车照片'].concat(mawbArr)
          //  }

          obj['收货'] = obj['安检'] = mawbArr

          if (this.fendanData.length == 0) {
            obj['海关查验'] = mawbArr
          } else {
            this.fendanData.forEach(v => {
              obj['海关查验'] = obj['海关查验'].concat([{ filter: 'hawb', hawb: v, guanLianHawb: v }])
            })
          }
          this.banhaoData.forEach(v => {
            obj['交接'] = obj['交接'].concat([{ filter: 'pmcno', pmcno: v }])
          })
          obj['交接'] = obj['交接'].concat(mawbArr)
        } else {
          obj['交接'] = []
          this.pmconList.forEach(v => {
            obj['交接'] = obj['交接'].concat([{ filter: 'pmcno', pmcno: v }])
          })
        }
        return obj
      },
      images() {//当前显示的图片
        if (this.threeLevelModular[this.modularName]&&((this.InputModelsystem!='空进'&&!this.orderSystem)||(this.orderSystem&&decodeURIComponent(this.orderSystem)!='空进'))) {
          let item = this.threeLevelModular[this.modularName][this.levelThreeIndex]
          if (item) {
            return this.imgList.filter(i => i.source == this.modularName && i[item.filter] == item[item.filter]).map(i => {
              return { src: i.fileaddress, id: i.id }
            })
          }

        }else if(this.InputModelsystem=='空进'||decodeURIComponent(this.orderSystem)=='空进'){//进口 @@进口更改
          return this.imgList.filter(i => i.source == this.modularName).map(i => {
              return { src: i.fileaddress, id: i.id }
          })
        }

      },
      upImgData() {
        if (this.threeLevelModular && this.modularName) {
          return {
            "jobno": this.jobno || '',
            "mawb": this.mawb || '',
            "addman": this.username || '',
            "filedom": "10",
            "dom": this.jiedianinfo[this.jiedianIndex].enName,
            "source": this.modularName || '',
            "hawb": this.threeLevelModular[this.modularName][this.levelThreeIndex] && this.threeLevelModular[this.modularName][this.levelThreeIndex].guanLianHawb || '',
            "khjcno": this.threeLevelModular[this.modularName][this.levelThreeIndex] && this.threeLevelModular[this.modularName][this.levelThreeIndex].khjcno || '',
            "dcbno": this.threeLevelModular[this.modularName][this.levelThreeIndex] && this.threeLevelModular[this.modularName][this.levelThreeIndex].dcbno || '',
            "pmcno": this.threeLevelModular[this.modularName][this.levelThreeIndex] && this.threeLevelModular[this.modularName][this.levelThreeIndex].pmcno || '',
            "jcno": this.threeLevelModular[this.modularName][this.levelThreeIndex] && this.threeLevelModular[this.modularName][this.levelThreeIndex].jcno || '',
            'cwid': this.cwid || ''
          }
        }
      },
      newUpImgData() {
        if (this.threeLevelModular && this.newModularName) {
          return {
            "jobno": this.jobno || '',
            "mawb": this.mawb || '',
            "addman": this.username || '',
            "filedom": "10",
            "dom": this.jiedianinfo[this.newJiedianIndex].enName,
            "source": this.newModularName || '',
            "hawb": this.threeLevelModular[this.newModularName][this.newLevelThreeIndex] && this.threeLevelModular[this.newModularName][this.newLevelThreeIndex].guanLianHawb || '',
            "khjcno": this.threeLevelModular[this.newModularName][this.newLevelThreeIndex] && this.threeLevelModular[this.newModularName][this.newLevelThreeIndex].khjcno || '',
            "dcbno": this.threeLevelModular[this.newModularName][this.newLevelThreeIndex] && this.threeLevelModular[this.newModularName][this.newLevelThreeIndex].dcbno || '',
            "pmcno": this.threeLevelModular[this.newModularName][this.newLevelThreeIndex] && this.threeLevelModular[this.newModularName][this.newLevelThreeIndex].pmcno || '',
            "jcno": this.threeLevelModular[this.newModularName][this.newLevelThreeIndex] && this.threeLevelModular[this.newModularName][this.newLevelThreeIndex].jcno || '',
            'cwid': this.cwid || ''
          }
        }
      },

    },
    watch: {
      deleteIds(val) {
        if (val.length) {
          this.imgList = this.imgList.filter(i => !val.includes(String(i.id)));
          this.updateList()
        }
      }
    }
  };
</script>
<style scoped lang='less'>
  @border: 1px solid #f0f0f0;

  .modul {
    font-size: 12px;
    display: inline-flex;
    height: 24px;
    min-width: 86px;
    align-items: center;
    justify-content: center;
    border-radius: 14px;
    margin-right: 20px;
    cursor: pointer;
  }

  .danhao {
    display: flex;
    flex-direction: column;
    max-height: 220px;
    overflow: scroll;
    overflow-x: hidden;
    overflow-y: auto;

    div {
      font-size: 12px;
      display: inline-flex;
      width: 180px;
      height: 26px;
      cursor: pointer;
      background-color: #eee;
      margin-top: 8px;
      align-items: center;
      box-sizing: border-box;
      border-radius: 4px;
      flex-shrink: 0;
      padding-left: 6px;
    }
  }

  .danhaoChecked {
    background-color: #E6A23C !important;
    color: #fff !important;
  }

  .top {
    display: flex;
    border: @border;
    min-height: 110px;
  }

  .left {
    width: 200px;
    border-right: @border;
    padding: 12px 10px;
  }

  .right {
    flex: 1;
    padding: 12px 10px;

    .jiedianType,
    .jiedianModular {
      margin-bottom: 15px;
      ;

      div {
        .modul;

        :first-child {
          margin-right: 8px;
        }
      }
    }

    .jiedianType>div {
      justify-content: start;
      margin-right: 0px;

    }

    .jiedianModular>div {
      padding: 0 6px;
      font-size: 14px;
    }
  }

  h4 {
    margin: 0px;
    margin-bottom: 12px;
  }

  .modularChecked {
    // background-color: #0069fc;
    background: #0e5a8c;
    color: #fff;
  }

  .modularNormal {
    background: #f8f8f8;
    color: #333;
    border: 1px solid #e8e8e8;
  }

  .typeChecked {
    color: rgb(14, 105, 248);
    // color:#0F5A8C;
    font-weight: 700;
  }

  .imglist {
    margin: 6px 0px;

    div {
      .modul;
      height: 24px;
      padding: 0 12px;
      background: #EAEAEA;
      margin-bottom: 12px;
    }

    .imglistChecked {
      background: #0078c8;
      color: #fff;
    }
  }

  .center {
    border: @border;
    margin-top: 15px;
    padding: 5px;
  }

  .viewer {
    width: 900px;
    margin: 0 auto;
    .el-carousel__item--card.is-in-stage{
      z-index:2;
      background:none
    }
    .el-carousel__mask{
      background:none
    }

    //height:400px;
    //  overflow: scroll;
    //  overflow-x:auto;
    //  overflow-y: hidden;
    // display: flex;
    // flex-wrap: nowrap;
    // justify-content: center;
    // padding-bottom: 6px;
    >div {
      width: 100%;
    }
    .rePosition{
      position:relative;
      height:100%;
      width:100%;
      img {
        max-width: 100%;
        max-height: 100%;
        flex-shrink: 1;
      }
      i{
        position:absolute;
        top:14px;
        left:14px;
        font-size:22px;
        color:#fff;
      }
    }

  }

  .mainfotter {
    //min-height: 80px;
    border: @border;
    margin-top: 2px;
    padding: 5px 10px;
    overflow: scroll;
    overflow-x: auto;
    overflow-y: hidden;
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
  }

  .thumbnailDiv {
    width: 62px;
    // height: 75px;
    // line-height: 75px;
    display: inline-block;
    margin-right: 1px;
    //  border: 1px solid #51C4B0;
    position: relative;
    text-align: center;

  }

  .thumbnailDiv img {
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    vertical-align: middle;
  }

  .mainfotterSpan {
    position: absolute;
    display: inline-block;
    width: 16px;
    height: 16px;
    top: 0px;
    cursor: pointer;
    right: 0px;
  }

  .el-carousel__container {
    height: 380px;
  }

  .main {
    border: 1px solid #e8e8e8;
    //padding:14px;
  }

  .main-title {
    height: 40px;
    display: flex;
    align-items: center;
    //background: #F2F2F2;
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
      color: #303133;
      font-weight: 500;
      font-size: 14px;
      cursor: pointer;
    }

    span.checked {
      background: #fff;
      color: rgb(15, 90, 140);
      ;
    }
  }

  .main-detail {
    padding-top: 15px;
  }

  .mybutton {
    width: 76px;
    height: 28px;
    text-align: center;
    line-height: 28px;
    background: #0F5A8C;
    margin-left: 10px;
    margin-right: 12px;
    cursor: pointer;
    display: inline-block;
    color: #fff;
    border-radius: 3px;
    text-decoration: none;
    user-select: none;
  }

  .mytable {
    padding: 10px;
    min-height: 126px;
  }

  .mytable-row {
    display: grid;
    grid-template-columns: 150px minmax(300px, 3fr) repeat(7, 1fr);
  }

  .mytable-row div {
    height: 34px;
    line-height: 34px;
    border-left: 1px solid #ddd;
    border-top: 1px solid #ddd;
    text-align: center;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;

  }

  .mytable .mytable-row:last-child {
    border-bottom: 1px solid #ddd;
  }

  .mytable .mytable-row div:last-child {
    border-right: 1px solid #ddd;
  }

  .tdi {
    font-size: 16px;
    cursor: pointer;
    margin: 0 6px;
  }
  /deep/.el-button--primary{
    background: #0f5a8c;
    border: none;
    color: #fff;
    &:hover{
    background: #0d4c77;
    border: none;
    color: #fff;
    }
  }
</style>