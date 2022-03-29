<template>
  <div style="display:inline">
    <el-popover placement="left" width="440" trigger="click">
      <div style="padding:20px 8px">
        <p style="font-size:16px;font-weight:600">说明</p>

        <template v-if="projectIsWecan">
          <div style="font-size:12px;margin:15px 0px">费用状态</div>
          <div style="display:inline">
            <span style="margin-right:8px;">
              <i class="el-icon-shenhebohui" style="margin-right:4px" :style="setBhiconColor(-1)"></i>
              {{setBhiconColor(-1,2)}}
            </span>
            <span style="margin-right:8px;">
              <i class="el-icon-shenhebohui" style="margin-right:4px" :style="setBhiconColor(100)"></i>
              {{setBhiconColor(100,2)}}
            </span>
            <span style="margin-right:8px;">
              <i class="el-icon-shenhebohui" style="margin-right:4px" :style="setBhiconColor(200)"></i>
              {{setBhiconColor(200,2)}}
            </span>
            <span style="margin-right:8px;">
              <i class="el-icon-shenhebohui" style="margin-right:4px" :style="setBhiconColor(500)"></i>
              {{setBhiconColor(500,2)}}
            </span>
              <!-- <span style="margin-right:8px">
              <i class="el-icon-shenhebohui" style="margin-right:4px;margin-top:14px" :style="setBhiconColor(800)"></i>
              {{setBhiconColor(800,2)}}
            </span> -->
          </div>
          <el-divider></el-divider>
        </template>

        <div style="font-size:12px;margin:15px 0px">操作状态</div>
        <div>
          <span
            style="display:inline-block;width:10px;height:10px;background:#fff;margin-right:3px;border:1px solid #ccc"
          ></span>
          <span style="margin-right:3px;">手动添加费用</span>
          <span
            style="display:inline-block;width:10px;height:10px;background:#87dfff;margin-left:10px;"
          ></span>
          <span style="margin-right:3px;">系统建议费用</span>
          <span
            style="display:inline-block;width:10px;height:10px;background:#ccc;margin-left:10px;"
          ></span>
          <span style="margin-right:3px;">合并及分摊费用</span>
        </div>

        <template v-if="projectIsWecan">
          <el-divider></el-divider>
        <div style="font-size:12px;margin:15px 0px">费用申请状态</div>
        <div>
          <span
            style="display:inline-block;width:10px;height:10px;background:#5CC85C;margin-right:3px;border:1px solid #ccc"
          ></span>
          <span style="margin-right:3px;">修改过的内容</span>
          <span
            style="display:inline-block;width:10px;height:10px;background:#F7A6A6;margin-left:10px;"
          ></span>
          <span style="margin-right:3px;">新增的内容</span>
          <span
            style="display:inline-block;width:10px;height:10px;background:#BABABA;margin-left:10px;"
          ></span>
          <span style="margin-right:3px;">删除的内容</span>
        </div>
      </template>

      </div>

      <i class="el-icon-shuoming" style="cursor:pointer;color:#275A87;font-size:16px;transform:translateY(3px);margin:0 8px" title="状态说明" slot="reference"></i>
    </el-popover>
  </div>
</template>
<script>
import { setBhiconColorMixin } from "@/common/detailPagesMixin";
export default {
  mixins: [setBhiconColorMixin]
};
</script>