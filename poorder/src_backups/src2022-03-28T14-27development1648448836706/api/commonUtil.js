import request from '@/utils/request'
import { MessageBox } from 'element-ui';
import { Message } from 'element-ui';


export const deleteTab = ({ url, data, callback }={}) => {
  MessageBox.confirm("是否确认删除?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      request({
        method: "delete",
        url,
        data,
        loading: true,
        noarea: true,
        tip: false
      }).then(results => {
        if (results.data.resultstatus == 0) {
          Message.success(results.data.resultmessage);
          callback&&callback();
        } else {
          Message.error(results.data.resultmessage);
        }
      });
    })
    .catch(() => { });
}
