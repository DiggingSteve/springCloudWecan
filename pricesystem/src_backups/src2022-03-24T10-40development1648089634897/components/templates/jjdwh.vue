<template>
<div style="display:inline-flex;height:28px;align-items:center;vertical-align:-4px">

  <i class="el-icon-edit-outline" title="交接地维护" @click="jjdDialogFunc" style="font-size:20px;color:#30C76C;cursor:pointer"></i><i class="el-icon-refresh" title="刷新" @click="getJjd" style="font-size:20px;;color:#30C76C;cursor:pointer;margin-left:12px;"></i>
 <el-dialog :visible.sync="dialogDoc"  v-if="dialogDoc"  width="1300px" append-to-body  top="4%">
<iframe :src="docUrl"  frameborder="0" allowtransparency="true" style="width: 100%; height: 700px; border: 0px none;" ></iframe>
</el-dialog>
</div>
</template>

<script>
export default {
  props:{
    sfg:{
      type:String,
      default:''
    },
     area:{
      type:String,
      default:''
    }
  },
  data () {
    return {
    dialogDoc:false,
    docUrl:''
    }
  },
  methods: {
    jjdDialogFunc(){
      this.docUrl=`${this.$store.state.imgWebApi}wffbasic/basic/frmJjdAdd.aspx?addman=${localStorage.usrname}&sfg=${this.sfg}&area=${this.area}`
       this.dialogDoc=true;
    },
    getJjd(){
         this.$axios({method:'get',url:this.$store.state.publicWebApi+'api/PubTjjd',params:{area:""},loading:true,tip:false}).then(res=>{
          localStorage.setItem("jjd",JSON.stringify(res.data))
          layer.msg('刷新成功！');
          this.$emit('success',true)
        })

    }

  },
  computed:{

  }

}
</script>

<style lang="less" scoped>
.dialogImgDoc{
 /deep/ .el-dialog__body{
   padding:0px;
    height: calc(100% - 40px);
  }
}
</style>
