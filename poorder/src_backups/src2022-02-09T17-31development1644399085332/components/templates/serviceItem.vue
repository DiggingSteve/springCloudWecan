<template>
  <div class="serviceItem">
    <!-- {{czlx}} -->
    <span style="display:none">{{servicedata}}</span>
    <slot></slot>
    <el-checkbox v-if="servicedata.servicecode!='OA0010'||(servicedata.servicecode=='OA0010'&&type==1)" class="checkbox"
      :value="servicedata.model" @input="change" :disabled="servicedata.disabled">
      <p class="serviceTitle">{{ getTitle }}</p>
    </el-checkbox>
    <el-checkbox v-else class="checkbox" :value="!servicedata.model" @input="val=>change(val, 1)" :disabled="servicedata.disabled">
      <p class="serviceTitle">{{ getTitle }}</p>
    </el-checkbox>
    <div class="oprequest" style="flex-grow:1" @click.stop="showtextarea = !showtextarea">
      <p style="cursor:pointer">
        <i class="el-icon-edit" :style="{color:servicedata.oprequest?'red':''}"></i>
      </p>
      <p style="width:50px;overflow:hidden;text-overflow:ellipsis;">{{servicedata.oprequest}}</p>

      <el-collapse-transition>
        <el-input @click.native.stop=";" type="textarea" class="oprequest-text" :rows="2" v-show="showtextarea"
          v-model="servicedata.oprequest">
        </el-input>
      </el-collapse-transition>
    </div>
  </div>
</template>

<script>
  // let changeCount = 0

  export default {
    name: 'serviceItem',
    props: {
      servicedata: Object,
      czlx: String,
      type: [Number, String]
    },
    data() {
      return {
        showtextarea: false
      }
    },
    created() {

    },
    methods: {
      change(val, type) {
        // 出港操作主营与订舱操作联动
        this.servicedata.model = type?!val:val
        // changeCount用来记录最后一个修改过的servicedata
        // this.servicedata.changeCount = ++changeCount
      },
      closetextarea() {
        this.showtextarea = false
      }
    },
    watch: {
      showtextarea(val) {
        if (val) {
          document.body.addEventListener('click', this.closetextarea)
        } else {
          document.body.removeEventListener('click', this.closetextarea)
        }
      }
    },
    computed: {
      getTitle() {
        // console.log(this.type)
        if (this.servicedata.servicecode == 'OA0010') {
          if (this.type == 1) {
            return '唯凯配舱'
          } else {
            return '唯凯代操作'
          }
        }
        return this.servicedata.title.split(',')[0]
      }



    }
  }
</script>

<style lang="less" scoped>
  .oprequest {
    flex-grow: 1;
    flex-wrap: nowrap;
    display: inline-flex !important;
  }


  .serviceItem {
    display: flex;
    padding: 6px;
    max-width: 220px;

    .serviceTitle {
      display: inline-block;
      text-align: left;

      &~.checkbox {
        float: left;
        width: 14px;
        height: 14px;
      }
    }

    .el-checkbox {
      margin-right: 0px;
    }

    .oprequest,
    .oprequest p {
      position: relative;
      display: inline-block;
      height: 16px;
      line-height: 16px;

      .oprequest-text {
        position: absolute;
        top: 0;
        left: 18px;
        width: 240px;
        height: 70px;
        z-index: 1000;

        /deep/ textarea {
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