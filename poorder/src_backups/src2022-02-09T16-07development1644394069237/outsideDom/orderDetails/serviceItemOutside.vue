<template>
  <div class="serviceItem">
    <!-- {{servicedata}} -->
    <slot></slot>
    <el-checkbox class="checkbox" :value="servicedata.model" @input="change" :disabled="servicedata.disabled"
      style="width:100px">
      <p class="serviceTitle" :title="servicedata.remark">
        <explainTooltip :text="servicedata.remark" v-if="servicedata.remark&&!servicedata.guid"></explainTooltip>
        {{ servicedata.title }}
      </p>
    </el-checkbox>
    <slot name="exBtn"></slot>
    <div class="oprequest">
      <!-- <p style="cursor:pointer" v-if="!['AA0510','AA0410'].includes(servicedata.servicecode)"
        @click.stop="showtextarea = !showtextarea">
        <i class="el-icon-edit" :style="{color:servicedata.oprequest?'red':''}"></i></p> -->
      <p style="width:68px;overflow:hidden;text-overflow:ellipsis;" @click.stop="showtextarea = !showtextarea"
        v-if="servicedata.model&&servicedata.oprequest">
        {{servicedata.oprequest}}</p>
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
    props: ['servicedata'],
    data() {
      return {
        showtextarea: false
      }
    },
    methods: {
      change(val) {
        // console.log(val)
        // if (val && ['AA0510', 'AA0410'].includes(this.servicedata.servicecode)) {
        if (val && ['AA0510'].includes(this.servicedata.servicecode)) {
          this.$parent.exInfo(true, this.servicedata.servicecode)
        } else {
          this.servicedata.model = val
          // this.servicedata.oprequest = ''
          // this.servicedata.yqfinishdate = ''
          // changeCount用来记录最后一个修改过的servicedata
          // this.servicedata.changeCount = ++changeCount
        }



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
    min-width: 170px;

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
        width: 300px;
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