<template>
  <div class="serviceItem">
   <!--  <slot></slot>
    <el-checkbox class="checkbox" :value="servicedata.model" @input="change" :disabled="servicedata.disabled" style="width:220px">
      <p class="serviceTitle">{{ servicedata.title }}</p>
    </el-checkbox> -->
    <div class="oprequest" style="flex-grow:1">
      <p @click="showtextarea = !showtextarea" style="cursor:pointer;font-weight:500;color:#333">操作要求：
          <i class="el-icon-edit" :style="{color:oprequest?'red':''}"></i></p>
          <p style="width:100px;overflow:hidden;text-overflow:ellipsis;top:3px;margin-left:10px;">{{oprequest}}</p>

      <el-collapse-transition>
        <el-input
          @click.native.stop=";"
          type="textarea"
          class="oprequest-text"
          :rows="2"
          v-show="showtextarea"
          v-model="oprequest">
        </el-input>
      </el-collapse-transition>
    </div>
  </div>
</template>

<script>
let changeCount = 0

export default {
  name: 'serviceItem',
  props:{
     text:String
  },
  data () {
    return {
      showtextarea: false,

    }
  },
  computed: {
    oprequest:{
      get(){
      return  this.text
      },
      set(val){
            this.$emit('update:text',val)
      }
    }
  },
  methods: {
    change (val) {
      this.servicedata.model = val
      // changeCount用来记录最后一个修改过的servicedata
      this.servicedata.changeCount = ++changeCount
    },
    closetextarea () {
      this.showtextarea = false
    }
  },
  watch: {
    showtextarea (val) {
      if (val) {
        document.body.addEventListener('click', this.closetextarea)
      } else {
        document.body.removeEventListener('click', this.closetextarea)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.serviceItem {
  display: flex;
 // margin: 8px 10px 10px 10px;
 align-items: center;
 font-weight: normal;
 margin-left:30px;
 font-size:12px;
  line-height: 16px;
  .serviceTitle {
    display: inline-block;
   // width: 230px;
    margin-left: 20px;
    text-align: left;
    & ~ .checkbox {
      float: left;
      width: 14px;
      height: 14px;
    }
  }
  .oprequest,
  .oprequest p {
    position: relative;
    display: inline-block;
    user-select: none;
    .oprequest-text {
      position: absolute;
      top: 0;
      left: 90px;
      width: 300px;
      height: 70px;
      z-index: 1000;
    /deep/  textarea{
        height: 100px;
      }
    }
  }
  .operating {
    width: 145px;
    height: 28px;
    margin-bottom: 10px;
    span {
      position: relative;
      font-size: 14px;
      font-weight: bolder;
      color: #0f5a8c;
      &::after {
        content: ' ';
        display: block;
        position: absolute;
        top: 7px;
        right: -15px;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #c8c8c8;
      }
    }
  }
}
</style>
