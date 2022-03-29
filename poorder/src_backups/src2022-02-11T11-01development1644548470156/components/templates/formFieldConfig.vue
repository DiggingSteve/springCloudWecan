<template>
  <div>
    <div class="tableFieldConfig">

      <el-select v-model="selectedJsondata" placeholder="可自定义查询条件显示字段" style="width:220px;">
        <el-option v-for="item in tmpArr" @click.native="defaultActive(item)" :key="item.value" :label="item.name" :value="item.jsondata">
          <span style="float: left">{{ item.name }}</span>

          <i class="el-icon-circle-close" style="float: right;color:#F56C6C;margin-left:3px;margin-top:8px;"
            @click.stop="delTemp(item)"></i>

        </el-option>

      </el-select>

      <el-button type="primary" @click="dialogTableVisible = true">查询模板</el-button>
    </div>

    <!-- 传送框 -->
    <el-dialog
      :title="curTempName ? `查询模板 （当前模板：${curTempName}）` : '查询模板'"
      :visible.sync="dialogTableVisible"
      class="tableConfig"
      v-if="dialogTableVisible"
      top="4%"
      append-to-body
      width="1100px">

      <div class="field-container">
        <div class="show-field">
          <div>
            <h3 class="title">
              显示字段
              <span class="tip">建议最多选择25个选项</span>
            </h3>
            <el-checkbox :indeterminate="valueTransLength" v-model="valueTransLength" @change="clearValueTrans" style="float:right;">取消选择</el-checkbox>
          </div>
          <div class="checkbox-row" @dragover="$event.preventDefault()" @drop="checkboxDrop($event)">
            <div class="checkbox-group-wrapper">
              <div class="checkboxgroup">
                <!-- 固定字段 -->
                <el-checkbox-group v-model="formFieldArr[0]">
                  <el-checkbox
                    :class="['checkbox-item', 'disabled',item]"
                    v-for="(item, index) in formFieldArr[0]"
                    :key="index"
                    :disabled="true"
                    :label="item">
                    <span class="number">{{ String(index+1).padStart(2, '0') }}</span>
                    {{ idToTitle[item] }}
                  </el-checkbox>
                </el-checkbox-group>

                <!-- 选择字段 -->
                <el-checkbox-group v-model="valueTrans">
                  <el-checkbox
                    class="checkbox-item"
                    draggable="true"
                    v-for="(item, index) in [...valueTrans.slice(0, 20-formFieldArr[0].length)]"
                    @dragstart.native="dragStart($event, item)"
                    :data-item="item"
                    :key="index"
                    :label="item">
                    <span class="number">{{ String(formFieldArr[0].length+index+1).padStart(2, '0') }}</span>
                    {{ idToTitle[item] }}
                  </el-checkbox>

                </el-checkbox-group>

              </div>

              <!-- 将第一列和后面的列分开，防止因为第一列加入了固定字段导致后续的字段位置出错 -->
              <div class="checkboxgroup" v-for="row_index in Math.ceil((formFieldArr[0].length + valueTrans.length)/20 || 1) - 1" :key="row_index">

                <el-checkbox-group v-model="valueTrans">
                  <el-checkbox
                    class="checkbox-item"
                    draggable="true"
                    v-for="(item, index) in [...valueTrans.slice((row_index)*20-formFieldArr[0].length, (row_index+1)*20-formFieldArr[0].length)]"
                    @dragstart.native="dragStart($event, item)"
                    :data-item="item"
                    :key="index"
                    :label="item">
                    <span class="number">{{ String((row_index)*20+index+1).padStart(2, '0') }}</span>
                    {{ idToTitle[item] }}
                  </el-checkbox>

                </el-checkbox-group>

              </div>
            </div>

          </div>

          <div class="trans-icon"></div>
        </div>

        <div class="sort-field">
          <h3 class="sort-title-c">
            <h3 :class="['sort-title',{active: activeLib == '3'}]" @click="activeLib = '3';highlightFieldIndex = ''">订单层</h3>
            <h3 :class="['sort-title',{active: activeLib == '1'}]" @click="activeLib = '1';highlightFieldIndex = ''">出口业务层</h3>
            <h3 :class="['sort-title',{active: activeLib == '2'}]" @click="activeLib = '2';highlightFieldIndex = ''">国内业务层</h3>
            <div :class="['field-search-select-c', { 'hidden': !showFieldSearchSelect }]">
              <el-select class="search-select" v-model="fieldSearchIndex" clearable filterable :filter-method="fieldSearchFunc" placeholder="请输入进行搜索">
                <template slot="prefix">
                  <i @click.stop="showFieldSearchSelect = !showFieldSearchSelect" class="el-icon-search"></i>
                </template>
                <template v-if="fieldSearchOptions.length > 0">
                  <el-option
                    v-for="(item, index) of fieldSearchOptions"
                    :key="item.title + item.activeLib + item.fieldtype"
                    :label="item.title"
                    :value="index + ',' + item.title">
                    <div
                      class="option-content"
                      style="display: flex;justify-content: space-between;">
                      <span class="title" style="margin-right: 5px;">{{ item.title }}</span>
                      <span class="lib" style="font-size: 12px;color: #C0C4CC;">
                        {{ activeLibNameObj[item.activeLib] }}
                      </span>
                    </div>
                  </el-option>
                </template>
              </el-select>
            </div>
          </h3>
          <div :class="['sort-subtitle-wrapper', {'showList': showFieldTypeList}]" tabindex="0" @blur="showFieldTypeList = false">
            <i
              class="el-icon-caret-left"
              @click="showFieldTypeList = !showFieldTypeList"
              v-if="activeLib == '2'">
            </i>
            <ul class="sort-subtitle-c" :style="{top: FieldTypeListTop}" ref="fieldTypeUlRef">
              <li
                v-for="(field, index) in fieldTypeArr"
                :class="['title',{active: index == curFieldTypeIndex},{setWidth: activeLib == '2'}]"
                :style="{color: index == curFieldTypeIndex ? sortFieldBackgroundArr[curFieldTypeIndex%6][1]: ''}"
                :key="index"
                @click="curFieldTypeIndex = index">
                {{ field.title }}
              </li>
            </ul>
          </div>
          <div class="checkbox-row" :style="sortFieldBackground" ref="fieldCheckboxRow">
            <el-checkbox-group v-model="valueTrans" class="checkboxgroup">
              <el-checkbox
                v-for="(item, key, index) in activeAllViewData"
                :key="key"
                :label="key"
                :title="item.title"
                :disabled="!basicField[1].includes(key)"
                :class="[key, { 'highlight': index === highlightFieldIndex }]">
                {{ item.title }}
              </el-checkbox>
            </el-checkbox-group>
          </div>

          <div class="background-text">
            {{ fieldTypeArr[curFieldTypeIndex].title }}
          </div>
        </div>
      </div>

      <div class="btn-c">
        <el-button type="primary" @click="showSavetemp=!showSavetemp">保存模板</el-button>
        <el-button type="primary" @click="setTemporaryTemp" title="应用为临时模板">应用</el-button>
      </div>

      <div class="savetemp-c" v-show="showSavetemp">
        <el-input v-model="tableTemName" placeholder="请输入模板名称" class="input-required" ref="tableTemNameInput"></el-input>
        <!-- <el-button type="primary" @click="saveTemp()">保存</el-button> -->
        <el-button @click="saveTemp('2')" type="primary" v-if="curTempID !== ''">修改当前模板</el-button>
        <el-button @click="saveTemp('1')" type="primary">保存为新模板</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>

//模板类型  type 0表格基础模板,20父级表格自定义模板 40子表格基础模板 60子表格自定义模板 80新增页服务模板 100查询条件自定义模板  110用户设置
// import { request,reLogin } from '../../api/request'

export default {
  props:{
    name:String,
    showZiConfig:{
      type:Boolean,
      default:false
    },
    pagetype:{
      type:[String,Number],
      default:1
    },
    allViewData:Object, // 出口业务层所有查询字段数据
    allViewData2:Object, // 国内业务层所有查询字段数据
    allViewData3:Object, // 订单层
    viewData:Object,  // 当前页面显示的字段数据
    formFieldArr:{
      type:Array,
      default:''
    },
    basicField:{
      type:Array,
      default(){
        return []
      }
    }
  },
  data(){
    return {
      type:100,//查询条件类型值
      checkAll: false,
      isIndeterminate: true,
      tmpArr:[],  //父模板选择数组
      selectedJsondata:"", //父下拉框的value
      dialogTableVisible: false, //全屏弹窗
      showSavetemp: false,//保存模板的输入框
      valueTrans:[],//选中的字段
      curTempID: '',//当前模板id
      curTempName: '',//当前模板名称
      tableTemName:'',//模板新名称
      tem:'1',//新增还是修改模板
      muban:'',//被替换模板名称
      isactivate:-1,

      activeLib: '1',   // 显示的字段库

      showFieldTypeList: false,   // 显示国内订单下面的分类的下拉
      FieldTypeListTop: '0px',      // 分类下拉的ul的top值，做动画切换用

      curFieldTypeIndex: 0,
      fieldTypeArr1: [      // 空出订单分类
        {title:'订单类',type:3},
        {title:'单号类',type:1},
        {title:'操作类',type:4},
        {title:'状态类',type:5},
        {title:'日期类',type:6},
        {title:'费用类',type:2},
      ],
      fieldTypeArr2: [    // 国内订单分类
        {title: '基本信息', type: 17},
        {title: '入仓', type: 1},
        {title: '提货', type: 2},
        {title: '报关', type: 3},
        {title: '制作总单', type: 4},
        {title: '制作分单', type: 5},
        {title: '制作Manifest', type: 6},
        {title: '制作总标签', type: 7},
        {title: '制作分标签', type: 8},
        {title: '安检', type: 9},
        {title: '交单', type: 10},
        {title: '快递', type: 11},
        {title: '磁检', type: 12},
        {title: '改包装', type: 13},
        {title: '化工鉴定', type: 14},
        {title: '挂衣', type: 15},
        {title: '贴签', type: 16},
        {title: '材料', type: 18},
        {title: '大件装卸', type: 19},
      ],

      sameTableHeadCompArr: [],

      sortFieldBackgroundArr: [
        ['#93b9ee', '#7b9ece'],
        ['#efa298', '#db877c'],
        ['#59b9c0', '#4ba0a7'],
        ['#f1b65b', '#dfa548'],
        ['#8aca91', '#80bb87'],
        ['#b78cdb', '#a575c9']
      ],

      showFieldSearchSelect: false,
      fieldSearchIndex: '',
      fieldSearchOptions: [],
      highlightFieldIndex: '',
    }
  },
  computed:{
    activeLibNameObj () {
      return {
        '1': '出口业务层',
        '2': '国内业务层',
        '3': '订单层'
      }
    },
    activeAllViewData() {
      // 过滤出当前字段库和分类下的所有字段
      if (this.activeLib == '1') {
        return Object.keys(this.allViewData).reduce((p, key) => {
          if (this.allViewData[key].fieldtype == this.curFieldType.type) {
            p[key] = this.allViewData[key]
          }
          return p
        }, {})
      } else if(this.activeLib == '2') {
        return this.allViewData2['fieldtype' + this.curFieldType.type] || {}
      } else if (this.activeLib === '3') {
        return Object.keys(this.allViewData3).reduce((p, key) => {
          if (this.allViewData3[key].fieldtype == this.curFieldType.type) {
            p[key] = this.allViewData3[key]
          }
          return p
        }, {})
      }
    },
    fieldTypeArr() {
      let num = ''
      if (this.activeLib === '1' || this.activeLib === '3') {
        num = '1'
      } else {
        num = '2'
      }
      return this['fieldTypeArr' + num]
    },
    curFieldType () {
      return this.fieldTypeArr[this.curFieldTypeIndex]
    },
    idToTitle() {
      let obj = {}
      Object.keys(this.allViewData).forEach(key => {
        obj[key] = this.allViewData[key].title
      })
      Object.keys(this.allViewData3).forEach(key => {
        obj[key] = this.allViewData3[key].title
      })
      Object.keys(this.allViewData2).forEach(key => {
        Object.keys(this.allViewData2[key]).forEach(subkey => {
          obj[subkey] = this.allViewData2[key][subkey].title
        })
      })
      return obj
    },
    // 当前表格是否需要同步模板
    isSameTableHeadComp() {
      let same = false;
      for (let item of this.$store.state.sameTableHeadComp) {
        if ( item.includes(this.name) ) {
          same = true;
          this.sameTableHeadCompArr = item;
          break;
        }
      }
      return same;
    },
    sortFieldBackground() {
      let index = this.curFieldTypeIndex % 6
      return {
        background: `linear-gradient(${this.sortFieldBackgroundArr[index][0]}, ${this.sortFieldBackgroundArr[index][1]})`
      }
    },
    valueTransLength: {
      get() {
        return this.valueTrans.length > 0
      },
      set() {}
    },
    allSearchField () {
      let searchField = []
      Object.keys(this.allViewData).forEach(key => {
        let value = this.allViewData[key]
        searchField.push({
          key,
          activeLib: '1',
          title: value.title,
          fieldtype: value.fieldtype
        })
      })
      Object.keys(this.allViewData3).forEach(key => {
        let value = this.allViewData3[key]
        searchField.push({
          key,
          activeLib: '3',
          title: value.title,
          fieldtype: value.fieldtype
        })
      })
      Object.values(this.allViewData2).forEach(fieldtypeValue => {
        Object.keys(fieldtypeValue).forEach(key => {
          let value = fieldtypeValue[key]
          searchField.push({
            key,
            activeLib: '2',
            title: value.title,
            fieldtype: value.fieldtype
          })
        })
      })
      return searchField
    }
  },
  watch:{
    activeLib() {
      this.curFieldTypeIndex = 0
      this.FieldTypeListTop = '0px'
    },
    showFieldTypeList(val) {
      if (val) {
        this.FieldTypeListTop = '0px'
      } else {
        let offsetTop = $(this.$refs.fieldTypeUlRef).find('.active')[0].offsetTop
        this.FieldTypeListTop = `-${offsetTop}px`
      }
    },
    '$store.state.tableTmpAll'() {
      this.setTmpArr()
    },
    'formFieldArr':{
      handler(){
        this.valueTrans=this.formFieldArr[1]
      },
      immediate:true
    },
    selectedJsondata(jsondata) {
      // 设置临时模板时selectedJsondata的值会被设为空，不进行后续的更新字段操作
      if (!jsondata) return
      this.valueTrans = JSON.parse(jsondata)
      this.$emit('update:formFieldArr',[this.formFieldArr[0], this.valueTrans])
    },
    dialogTableVisible(visible) {
      if (visible) {
        this.tmpArr.forEach(i=>{
          if(i.jsondata == this.selectedJsondata){
            this.curTempID = i.id
            this.curTempName = i.name
          }
        })
        this.valueTrans = Object.keys(this.viewData).filter(i => !this.formFieldArr[0].includes(i))
        this.tableTemName = this.curTempName
        this.activeLib = '3'
      } else {
        this.tableTemName = ''
        this.showSavetemp = false
      }
    },
    fieldSearchIndex (index) {
      if (index === '') {
        this.highlightFieldIndex = ''
        return
      }
      index = index.split(',')[0]
      let { activeLib, fieldtype, key } = this.fieldSearchOptions[index]
      this.activeLib = activeLib
      this.$nextTick(() => {
        if (activeLib === '1' || activeLib === '3') {
          this.curFieldTypeIndex = this.fieldTypeArr1.findIndex(i => i.type == fieldtype)
        } else if (activeLib === '2') {
          this.curFieldTypeIndex = this.fieldTypeArr2.findIndex(i => i.type == fieldtype)
        }
  
        // 滚动到搜索的字段位置并高亮显示
        Object.keys(this.activeAllViewData).forEach((viewDataKey, index) => {
          if (viewDataKey === key) {
            this.highlightFieldIndex = index
          }
        })
        this.$nextTick(() => {
          this.$refs.fieldCheckboxRow.scrollTo(0, this.highlightFieldIndex * 25)

          let offsetTop = $(this.$refs.fieldTypeUlRef).find('.active')[0].offsetTop
          this.FieldTypeListTop = `-${offsetTop}px`
        })
      })
    },
    showFieldSearchSelect (val) {
      if (!val) {
        this.fieldSearchIndex = ''
        this.fieldSearchOptions = []
      }
    }
  },
  methods:{
    clearValueTrans() {
      this.valueTrans.splice(0, this.valueTrans.length)
    },
    setTmpArr() {
      let tmpArr = [], activeTmp = null, systemDefaultTemp = null
      for (let tmp of this.$store.state.tableTmpAll) {
        if (this.name == tmp.url && this.type == tmp.type) {
          if (!tmp.name) {
            // 系统默认模板
            systemDefaultTemp = tmp.jsondata
          } else {
            tmpArr.push(tmp)
            if (tmp.isactivate == 1) {
              activeTmp = tmp.jsondata
            }
          }
        }
      }
      if (activeTmp) {
        this.selectedJsondata = activeTmp
      } else {
        this.selectedJsondata = ''
        if (systemDefaultTemp) {
          this.$emit('update:formFieldArr',[this.formFieldArr[0], JSON.parse(systemDefaultTemp)])
        } else {
          this.$emit('update:formFieldArr',[this.formFieldArr[0], this.formFieldArr[1]])
        }
      }
      this.tmpArr = tmpArr
    },
    getTemp(){
      this.tmpArr=[]
      this.$axios({method:'get',url:this.$store.state.publicWebApi+'api/UserTemplet',params:{logname:localStorage.getItem('usrname'),project:'bomanagement'},loading:false,tip:false}).then(results=>{

        this.$store.commit("setTableTmpAll", results.data)
        this.setTmpArr()
      })
    },
    // 保存和修改模板
    // type: 1.保存为新模板 2.修改当前模板
    async saveTemp(type){
      let method='post'
      let jsonValueTrans = JSON.stringify(this.valueTrans)

      if(this.valueTrans.length==0){
        this.$message.error('请选择显示字段');return;
      }
      if(!this.tableTemName){
        this.$message.error('请选择或输入模板名称');return;
      }

      if (type === '1') {
        if (this.tmpArr.filter(i => i.name==this.tableTemName).length > 0) {
          this.$refs.tableTemNameInput.select()
          return this.$message.error('模板名称重复')
        }
        for (let item of this.tmpArr) {
          if (item.jsondata == jsonValueTrans) {
            this.$message.error("存在相同模板请重新选择或排序")
            return
          }
        }
      } else {
        method = 'put'
        for (let item of this.tmpArr) {
          if (item.id !== this.curTempID && item.jsondata == jsonValueTrans) {
            this.$message.error("存在相同模板请重新选择或排序");
            return
          }
        }
      }

      let json = []
      let comp = []
      if (this.isSameTableHeadComp) {
        comp = this.sameTableHeadCompArr
      } else {
        comp.push(this.name)
      }

      if (method == 'post') {
        comp.forEach(url => {
          json.push({
            czman: localStorage.getItem('usrname'),
            isactivate: url == this.name ? 1 : 2,
            jsondata: jsonValueTrans,
            logname: localStorage.getItem("usrname"),
            name: this.tableTemName,
            type: this.type,
            url: url,
            project: "bomanagement",
            logExtraData: this.logExtraDataForBuild
          })
        })
      } else if (method == 'put') {
        comp.forEach(url => {
          this.$store.state.tableTmpAll.forEach(tmp => {
            if (tmp.url == url && tmp.name == this.curTempName && tmp.type == this.type) {
              json.push({
                czman: localStorage.getItem('usrname'),
                id: tmp.id,
                isactivate: tmp.isactivate,
                jsondata: jsonValueTrans,
                logname: localStorage.getItem("usrname"),
                name: this.tableTemName,
                type: this.type,
                url: url,
                project: "bomanagement",
                logExtraData: this.logExtraDataForBuild
              })
            }
          })
        })
      }

      this.$axios({method:method,url:this.$store.state.publicWebApi+'api/UserTempletList', data:json,noarea:true,loading:false,tip:true})
      .then(async (results)=>{
        if(results.data.resultstatus==0){
          await this.getTemp()
          this.dialogTableVisible=false
        }else{
          this.$message.error(results.data.resultmessage)
        }
      })
    },
    delTemp(item){
      let that = this

      this.$confirm('您将删除本模板, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        callback: action => {
          if(action=='confirm'){
            delFn()
          }else if(action=='cancel'){
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          }
        }
      })

      function delFn() {
        let data = []
        let comp = []

        if (that.isSameTableHeadComp) {
          comp = that.sameTableHeadCompArr
        } else {
          data.push({ id: item.id, logname: localStorage.getItem('usrname'), logExtraData:that.logExtraDataForBuild })
        }

        comp.forEach(url => {
          that.$store.state.tableTmpAll.forEach(tmp => {
            if (tmp.url == url && tmp.name == item.name && tmp.type == that.type) {
              data.push({
                id: tmp.id,
                logname: localStorage.getItem('usrname'),
                logExtraData: that.logExtraDataForBuild
              })
            }
          })
        })

        that.$axios({method:'delete',url:that.$store.state.publicWebApi+'api/UserTempletList',data,noarea:true,loading:false,tip:true})
        .then(results=>{
          if(results.data.resultstatus!=0){

          }else{
            that.selectedJsondata=''
            that.getTemp()
          }
        })
      }
    },
    defaultActive(item){  //默认模板
      let data = [{
        ...item,
        czman: localStorage.getItem('usrname'),
        dom: '出口部',
        isactivate:1,
        logname: localStorage.getItem("usrname"),
        project: "bomanagement",
        logExtraData:this.logExtraDataForBuild
      }]
      this.$axios({method:'put',url:this.$store.state.publicWebApi+'api/UserTempletList',data,noarea:1})
      .then(results=>{
        if(results.data.resultstatus==0){
          this.getTemp()
        }
      })
      .catch(error=>{
        this.$message.error('请求失败')
      })
    },
    setTemporaryTemp(){
      if(this.valueTrans.length>0){
        this.selectedJsondata = ''
        this.$emit('update:formFieldArr',[this.formFieldArr[0], this.valueTrans])
      }else{
        this.$message.error('请选择显示字段');return
      }
      this.dialogTableVisible=false
    },
    checkboxDrop(ev){
      function getDropItem(el) {
        if (el.nodeName == 'DIV') return null
        if (el.nodeName == "LABEL" && el.className.indexOf("el-checkbox") !== -1) {
          return el.attributes["data-item"].value
        } else {
          return getDropItem(el.parentNode)
        }
      }

      var targetItem = getDropItem(ev.target)
      if(targetItem){
        var field=ev.dataTransfer.getData("field")

        let index1=this.valueTrans.indexOf(field)
        let index2=this.valueTrans.indexOf(targetItem)

        this.valueTrans.splice(index1, 1)
        this.valueTrans.splice(index2, 0, field)
      }
    },
    dragStart(ev,item){
      ev.dataTransfer.setData("field",item);
    },
    fieldSearchFunc (searchText) {
      this.fieldSearchOptions = []
      if (!searchText) return
      this.allSearchField.forEach(item => {
        if (item.title.includes(searchText)) {
          this.fieldSearchOptions.push({
            ...item
          })
        }
      })
    }
  },
  mounted(){
    if(this.$store.state.tableTmpAll.length>0){
      this.setTmpArr()
    }else{
      this.getTemp()
    }
  }
}
</script>
<style lang="less" scoped>
    .dragItem{
      width:100%;
      padding-left:10px;
      padding-top:6px;
      font-size:14px;
      color:#409EFF;
      cursor: move;
    }
  .tableSetMuban{
    display: inline-block;
    min-width: 70px;
    height: 28px;
    line-height: 28px;
    color: #444;
    margin: 0px;
    text-align: center;
    background: #F8F8F8;
    border: 1px solid #ccc;
    cursor: pointer;
    margin-right: 5px;
    text-decoration: none;
  }
  .jihuo{
    float:right; color:#8492a6;width:13px;height:13px;border-radius:13px;margin-top:12px;
  }
.tableTem .el-dialog--small{min-width: 0}

.tableConfig /deep/ .el-dialog__body{margin:0 auto;width:auto !important;}
.tableConfig /deep/ .el-button{padding:8px 16px;}

.tableConfig {
  /deep/ .el-dialog__header {
    padding: 20px 30px 10px;
  }
  /deep/ .el-dialog__body {
    padding: 0px 30px 30px;
    .field-container {
      display:flex;
      padding:20px 0;
      height: 646px;
      .show-field {
        margin-right:80px;
        display:flex;
        flex-direction:column;
        height:100%;
        position: relative;
        .trans-icon {
          position: absolute;
          top: 300px;
          right: -55px;
          width: 32px;
          height: 32px;
          background: url('../../../boStatic/images/searchFieldDialogTransIcon.png') no-repeat 0 0;
        }
        .title {
          float: left;
          margin-bottom: 10px;
          .tip {
            margin-left: 8px;
            font-size: 12px;
            color: #ababab;
          }
        }
        .checkbox-row {
          border-radius: 4px;
          border:1px solid #e8e8e8;
          width: 654px; // 三列checkbox
          height: 575px;  // 20行字段
          flex:1;
          padding: 11px 0;
          overflow-x: auto;
          .checkbox-group-wrapper {
            white-space: nowrap;
          }
          .checkboxgroup {
            display: inline-block;
            vertical-align: top;
            width: 218px; // 每列218宽度
            padding: 0 15px;
            border-right: 1px solid #e8e8e8;
            &:last-child {
              border-right: none;
            }
            .checkbox-item {
              position: relative;
              display: block;
              width: 100%;
              height: 24px;
              line-height: 24px;
              margin: 3px 0;
              padding-left: 25px;
              border-radius: 4px;
              &:hover {
                box-shadow: 0px 0px 10px #999;
              }
              &.disabled {
                box-shadow: none;
              }
              .number {
                position: absolute;
                left: 3px;
                top: 4px;
                font-family: Arial, Helvetica, sans-serif;
                color: #c5c5c5;
                font-style: italic;
              }
            }
          }
        }
      }
      .sort-field {
        height: 100%;
        flex:1;
        display:flex;
        flex-direction:column;
        position: relative;
        // width: 256px;
        .sort-title-c {
          border-bottom: 1px solid #e8e8e8;
          .sort-title {
            float: left;
            font-size: 14px;
            height: 30px;
            line-height: 30px;
            margin-right: 10px;
            margin-bottom: 0;
            color: #606266;
            cursor: pointer;
            &.active {
              color: #0f5a8c;
              font-weight: bold;
            }
          }
          .field-search-select-c {
            flex: 1;
            display: flex;
            justify-content: flex-end;
            .search-select {
              transition: .3s width;
              width: 100%;
              .el-input__inner {
                transition: .3s padding;
                padding: 0 30px;
              }
              .el-icon-search {
                width: 28px;
                line-height: 28px;
                cursor: pointer;
              }
            }
            &.hidden {
              .search-select {
                width: 28px;
                .el-input__inner {
                  padding: 0;
                  &::placeholder {
                    opacity: 0;
                  }
                }
                .el-input__prefix {
                  left: 0;
                }
                .el-input__suffix {
                  display: none;
                }
              }
            }
          }
        }
        .sort-subtitle-wrapper {
          overflow: hidden;
          position: relative;
          width: 100%;
          height: 29px;
          background: white;
          transition: .5s all;
          z-index: 12;
          &.showList {
            height: 220px;
            // box-shadow: 0 10px 16px -10px #000;
            .el-icon-caret-left{
              transform: rotate(-90deg);
              right: 0;
            }
          }
          .el-icon-caret-left {
            position: absolute;
            top: 2px;
            right: -6px;
            font-size: 20px;
            cursor: pointer;
            transition: .5s all;
            z-index: 13;
          }
          .sort-subtitle-c {
            // width: 1000px;
            // white-space: nowrap;
            overflow: hidden;
            position: relative;
            transition: .5s all;
            .title {
              display: inline-block;
              font-size: 14px;
              font-weight: bold;
              width: 16%;
              height: 30px;
              line-height: 30px;
              cursor: pointer;
              &.setWidth {
                width: 32%;
              }
              &:last-child {
                margin-right: 0px;
              }
            }
          }
        }
        .checkbox-row {
          flex: 1;
          border-radius: 4px;
          height: 544px;
          overflow: auto;
          &::-webkit-scrollbar-thumb {
            background: rgba(0, 0, 0, 0.31);
          }
          &::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.18);
          }
          .checkboxgroup {
            width: 218px; // 每列218宽度
            float: left;
            padding: 0 10px;
            .el-checkbox {
              width: 100%;
              margin-left: 4px;
              height: 25px;
              line-height: 25px;
              padding-left: 6px;
              &.highlight {
                background: rgba(0,0,0,0.3);
              }
              .el-checkbox__inner {
                border-color: white;
                background: white;
                &::after {
                  border-color: #0f5a8c;
                }
              }
              .is-disabled .el-checkbox__inner::after {
                border-color: #b8d1e2;
              }
              .el-checkbox__label {
                color: white;
              }
              &.is-disabled {
                .el-checkbox__input {
                  opacity: 0;
                }
                .el-checkbox__label {
                  opacity: 0.5;
                }
              }
            }
          }
        }
        .background-text {
          position: absolute;
          right: 30px;
          bottom: 30px;
          font-weight: bold;
          width: 70px;
          font-size: 68px;
          line-height: 70px;
          color: #fff;
          opacity: 0.2;
          pointer-events: none;
          writing-mode: tb-rl;
        }
      }
    }
    .btn-c {
      margin-bottom: 20px;
    }
    .savetemp-c {
      .el-input {
        width: 200px;
        margin-right: 10px;
        margin-bottom: 10px;
      }
    }
  }
}

</style>

