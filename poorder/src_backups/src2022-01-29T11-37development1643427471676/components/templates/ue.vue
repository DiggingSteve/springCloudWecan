<template>

	<div>
		
 
          <div style="width:1100px;margin-bottom:20px;">
          	<span class="spanFirstEdit">标题:</span>
   
          	<el-input v-model="infoForm.title" style="width:1000px" placeholder="请使用[]符号,并在其中输入所属系统"></el-input>
          
          </div>

          <div style="width:1100px;" class="secondRow">
            <span class="spanFirstEdit">版本:</span>
            <el-input v-model="infoForm.version" style="width:500px"></el-input>

            <span class="spanFirstEdit">系统:</span>
             <el-select v-model="system"  placeholder="请选择系统"  clearable style="width:210px;border-radius:28px;"  @visible-change="modelHeight" >
                    <el-option-group
                      v-for="group in systemArr"
                      :key="group.value"
                      :label="group.label"
                      class="modelHeight"
                      >
                      <el-option
                        v-for="item in group.options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        style="width:204px;"
                        >
                      </el-option>
                    </el-option-group>
              </el-select>
          </div>

          <div style="margin-top:20px;">
           <span style="vertical-align:top" class="spanFirstEdit">详细:</span> 
           <div class="edit_container" style="display:inline-block;width:1000px">
              <quill-editor v-model="infoForm.content"
                            ref="myQuillEditor"
                            class="editer"
                            :options="editorOption" 
                             @change="onEditorChange($event)"
                             @ready="onEditorReady($event)"
                            >
              </quill-editor>
            </div>
          </div>

      
            <el-button type="button" @click="onSubmit" style="margin-left:40px;margin-top:20px;">提交</el-button>
            <el-button type="button" @click="modifyDel=true" style="margin-left:20px;margin-top:20px;">编辑</el-button>
          
         
    
  <el-dialog width="400"
  top="4%"
  append-to-body
  center
  :visible.sync="modifyDel"
  v-if="modifyDel"
  >
   
   <commonTable class="commonTable" :head="updateRecorderHead" :table-data="resultUpdate">
      
      <template slot="operation" slot-scope="props">
      <!-- <i class="el-icon-setting" @click="modifyEdit"></i> -->
      <i class="el-icon-delete" @click="delEdit(props.data.row.id,props.data.index)"></i>
      </template>

  </commonTable>
  </el-dialog>



	</div>



</template>

<script>
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import { quillEditor } from 'vue-quill-editor';

const toolbarOptions = [
 [{'align': []}],
  [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
   [{'color': []}, {'background': []}],          // dropdown with defaults from theme
  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  ['blockquote', 'code-block'],
  [{'header': 1}, {'header': 2}],               // custom button values
  [{'list': 'ordered'}, {'list': 'bullet'}],
  // [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
  // [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
  // [{'direction': 'rtl'}],                         // text direction
  [{'header': [1, 2, 3, 4, 5, 6, false]}],
  [{'font': []}],
  ['link', 'image', 'video'],
  ['clean']                                         // remove formatting button
]


    export default {
         data(){
         	return{
               system:'',
         		infoForm:{
          		  title:'',
          	    version:'',
          	    content:'',
          	    //system:'空运出口订单系统'
                },
               editorOption:{//富文本编辑框
          	     placeholder:'',
          	     theme:'snow',
          	     modules:{
          		    toolbar:{
          			  container:toolbarOptions,
          		 }
          	    }
               },
              modifyDel:false,
              resultUpdate:[],//已有内容
              updateRecorderHead:[
          	     {field: 'operation', title: '编辑'},
                 {field: "title", title: "标题"},
		         {field: "version", title: "版本号"},

              ],
              systemArr:[]  
            }
        
         },
          components: {
            quillEditor
        },
        methods:{
        	onSubmit(){

        		if(!this.infoForm.title){
        			this.$message.error('请填写标题');
        			return false
        		}
            this.infoForm.system=this.system
        		//this.infoForm.system="空运出口订单系统弄"
        		this.$axios({method:'post',url:this.$store.state.publicWebApi+'api/PubUpdateNoticeLog',data:this.infoForm,loading:true,tip:true,noarea:1})
        		.then((results)=>{
                    //console.log(results.data)
                    this.searchAllBanben()
        		})
        		.catch(error=>{
                   
        		})
        	},
        	// 修改
        	modifyEdit(){

        	},
                //设置高度
            modelHeight:function(){
      //console.log('1')
        $('.modelHeight').parent().parent('.el-scrollbar__wrap').css('max-height','720px')
    },
        	//删除
            delEdit(id,index){
              this.$axios({method:'delete',url:this.$store.state.publicWebApi+'api/PubUpdateNoticeLog',data:{id:id},loading:false,tip:true,noarea:1})
          .then(results=>{
          	this.resultUpdate.splice(index,1)
              //this.resultUpdate=results.data
          })
          .catch(error=>{

          })
            },
            //搜索所有版本列表
            searchAllBanben(){
            	this.$axios({method:'get',url:this.$store.state.publicWebApi+'api/PubUpdateNoticeLog',params:{system:'空运出口订单系统'},loading:false,tip:false,noarea:1})
          .then(results=>{
              this.resultUpdate=results.data
          })
          .catch(error=>{

          })
            },
            getSysyemArr(){
              var systemArr=[]
              let systemArrList=JSON.parse(localStorage.getItem('groupType'))
              systemArrList.filter(i => i.groupid == '136').forEach(item => {
           // console.log(item)
               if(!systemArr.includes(item.ready04)){
                  systemArr.push(item.ready04);
                  this.systemArr.push({ label:item.ready04,options:[{ 'value': (item.typename.split('丨'))[0], 'label': item.typename }] })
                }else{
                  let len=systemArr.indexOf(item.ready04)

                  this.systemArr[len].options[this.systemArr[len].options.length] = { 'value': (item.typename.split('丨'))[0], 'label': item.typename }
                }
          })

            },

        	onEditorChange(editor){
              
        	},
        	onEditorReady(editor){

        	}


        },
        created(){
          this.searchAllBanben()
          this.getSysyemArr()
        },

        }

 

</script>
	<style>
.ql-container {
    min-height: 400px;
}

.ql-snow .ql-tooltip {
    transform: translateX(117.5px) translateY(10px) !important;
}

.editor-btn {
    margin-top: 20px;
}
.spanFirstEdit{font-size:14px;width:40px;display:inline-block}
.ql-toolbar.ql-snow{position:sticky;top:0;z-index:99999;background:#fff;}
.secondRow{
  /deep/.el-input{
     /deep/.el-input__inner{
    height:28px!important;
  }
  }
 
}


	</style>



