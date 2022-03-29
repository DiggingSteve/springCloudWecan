

import axios from '@/common/http'
import store from "@/store/index.js"



/**
 * @description:  获取
 * @param {*} id 订单id
 * @return {*}
 */
export async function getOrderInfo(id){
    return await axios({
        method: "get",
        url: store.state.webApi + "api/ExHpoAxpline",
        params: { boguid:id},
        loading: false,
        tip: false
      })
}