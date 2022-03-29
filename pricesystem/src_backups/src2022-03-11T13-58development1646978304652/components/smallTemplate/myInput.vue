<template>

  <div>
    <div class="input-item">
      <div class="input-title" v-show="title">{{title}}</div>
      <div class="input-content">
        <input type="input" :disabled="disabled" ref="input" class="selfInput" v-bind:value="value"
          v-on:input="updateValue($event.target.value)">
        <span @click="updateValue('')" class="selfSpan el-icon-error" v-if="clear&&value"></span>
      </div>
    </div>

  </div>


</template>
<script>




  export default {
    props: {
      title: {
        type: String,
        default: ""
      }, //标题
      value: String,//绑定的值
      clear: {
        type: Boolean,
        default: false
      }//是否有清空按钮
      ,
      disabled: {
        type: Boolean,
        default: false
      }
    },
    components: {

    },
    data() {
      return {

      }

    },
    methods: {
      updateValue: function (value) {
        this.$emit('input', value)
        if (!value) {
          this.focus()
        }
      }
      , focus() {
        (this.$refs.input || this.$refs.textarea).focus();
      },
    }
    , created() {

    },
    computed: {

    },
    mounted() {

    },
    watch: {


    }

  }


</script>
<style lang="less" scoped>
  @import 'small.css';

  .input-content .selfInput {
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    height: 28px;
    line-height: 28px;
    outline: 0;
    padding: 0 15px;
    -webkit-transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
    transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
    width: 100%;
  }

  .input-content .selfInput:hover {
    border: 1px solid #C6C9D1;
  }

  .input-content .selfInput:focus {
    border: 1px solid #409EFF;
  }

  .input-content .el-select {
    width: 100%;
  }

  .input-content:hover .selfSpan {
    display: block;
  }

  .input-content .selfSpan {
    display: inline-flex;
    justify-content: center;
    position: absolute;
    right: 7px;
    top: 8px;
    display: none;
    cursor: pointer;
    width: 12px;
    height: 12px;
    line-height: 12px;
    color: #B1B5BD;
  }
</style>