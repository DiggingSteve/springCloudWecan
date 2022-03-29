<template>
  <div>
    <div class="btn-wrap">
      <slot name="select-btn" :choiceFile="choiceFile">
        <el-button type="primary" @click="choiceFile">选择文件</el-button>
      </slot>
      
      <input
        multiple
        ref="fileElem"
        style="display: none"
        type="file"
        muti
        @input="tirggerFile($event)"
      />
    </div>
    <div class="file-wrap">
      <div class="item" v-for="(item, index) in jobs">
        <div class="filename">
          <span v-if="!!jobs[index].option.file.name">{{
            jobs[index].option.file.name
          }}</span>
          <span class="percent">{{ jobs[index].percent }}%</span>
          <span class="delBtn" @click="delJob(index)"
            ><i class="el-icon-close"></i
          ></span>
        </div>

        <div class="progress">
          <div
            class="progress_inner"
            v-bind:class="{ active: jobs[index].percent == 100 ? true : false }"
            :style="{ width: jobs[index].percent + '%' }"
          ></div>
        </div>
      </div>
    </div>
    <div v-if="jobs.length > 0">
      <el-button type="primary" @click="upload()"> 上传</el-button>
    </div>
  </div>
</template>

<script>
import {
  FragmentUploadFile,
  upload,
  uploadStatus,
} from "../priceSystem/js/FragmentUploadFile";
export default {
  props: {
    url: "",
      afterUpload: {
      type: Function
    },
  },
  data() {
    return {
      percent: 0,
      jobs: [], // 发送任务列表
      lastInputValue: "",
   
    };
  },
  methods: {
    tirggerFile(event) {
      var files = event.target.files;
      this.lastInputValue = this.$refs.fileElem.value;
      this.jobs = this.jobs.length > 0 ? this.jobs : new Array();
      let currentJobIndex = this.jobs.length;
      var self = this;
      
      for (let i = 0; i < files.length; i++) {
        let o = new FragmentUploadFile(self);
        self.jobs.push(o);
        o.setOption({
          url: this.url,
          file: files[i],
        });
        o.setEvent({afterUpload:this.afterUpload});
        self.$set(self.jobs, currentJobIndex + i, o);
      }
    },
    choiceFile() {
      this.$refs.fileElem.dispatchEvent(new MouseEvent("click"));
    },

    upload() {
     for (let i = 0; i < this.jobs.length; i++) {
          let o = this.jobs[i];
          if(o.status!=uploadStatus.pending)continue;
          o.sendFile(true);
     }
    },
    delJob(index) {
      this.jobs[index].delJob();
      this.jobs.splice(index, 1);
      if (this.$refs.fileElem.value == this.lastInputValue) {
        this.setInputValueEmpty();
      }
    },
    // 解决选择同一文件不触发input事件问题
    setInputValueEmpty() {
      this.$refs.fileElem.value = "";
    },
  },
};
</script>
<style scoped lang="less">
@progressHeight: 3px;
.flex {
  display: flex;
  justify-content: flex-start;
}
.file-wrap {
  min-width: 300px;
  max-width: 500px;
  & .item {
    margin: 10px 2px;
  }
  & .filename {
    height: 30px;
    & .percent {
      float: right;
    }
    & .delBtn {
      float: right;
      display: none;
    }
    &:hover {
      background: #f5f7fa;
      cursor: pointer;
      .percent {
        display: none;
      }
      .delBtn {
        display: block;
      }
    }
  }
}
.progress {
  width: 100%;
  position: relative;
  height: @progressHeight;
  background-color: #ebeef5;
  overflow: hidden;

  & .progress_inner {
    position: absolute;
    width: 0%;
    height: @progressHeight;
    transition: width 0.3s linear;
    background: #409eff; /* Old browsers */
    text-align: center;
    color: #fff;
  }
}
</style>
