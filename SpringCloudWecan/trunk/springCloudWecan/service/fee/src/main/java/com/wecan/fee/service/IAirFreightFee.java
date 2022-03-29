package com.wecan.fee.service;

import com.wecan.modeldbo.airfreight.fee.FreightFee;
import com.wecan.modelview.model.vo.fee.input.InputAirFreightFee;
import com.wecan.modelview.model.vo.fee.input.InputApprovalRecord;
import com.wecan.modelview.model.vo.fee.output.OutputFreightFeeList;
import com.wecan.modelview.model.vo.fee.output.OutputFreightRouting;
import org.springframework.stereotype.Service;


import java.util.HashMap;
import java.util.List;


/**
 * 空运费业务接口
 * **/
@Service
public interface IAirFreightFee extends IBaseService{
    /**
     *
     *
     * @description:
     * @param data
     * @return:
     * @author: yaodui

     */
    void saveFee(InputAirFreightFee data);

    /**
     *
     *
     * @description:
     * @param data
     * @return:
     * @author: yaodui

     */
    void editFee(InputAirFreightFee data);

    /**
     *
     *
     * @description: 删除费用
     * @param feeid 费用id
     * @return:
     * @author: yaodui

     */
    void deleteFee(Long feeid);

    /**
     *
     *
     * @description: 删除费用
     * @param json 条件json
     * @return:
     * @author: yaodui

     */
    void deleteFee(String json);

    /**
     *
     *
     * @description:
     * @param json 前端解析json
     * @return: 外部查询列表
     * @author: yaodui

     */
    List<OutputFreightFeeList> getList(String json);

    /**
     *
     *
     * @description:
     * @param json 前端解析json
     * @param pageType 区分查询页面来源 客户运费还是公布运费
     * @return: 外部查询列表
     * @author: yaodui

     */
    List<OutputFreightFeeList> getList(String json,String pageType);

    /**
     *
     *
     * @description: 根据sfg mdg zzg 获取相关费用信息
     * @param json 包含sfg mdg zzg
     * @return:
     * @author: yaodui

     */
   HashMap<Long,HashMap<String,Object>>getDetail(String json);

   /**
    *
    *
    * @description: 获取最后一条直达费用 如果不存在则抛异常出去
    * @param json
    * @return:
    * @author: yaodui

    */
   FreightFee getDirectFee(String json);


   /**
    *
    *
    * @description: 获得Bo查询费用路线
    * @param json
    * @return:
    * @author: yaodui

    */
   List<OutputFreightRouting>getRouting(String json);

   // 发送消息更新 myc价格
  Boolean sendMsgToUpdateMyc(String sfg,String mdg,String area,String threeCode,String twoCode);

    /**
     * 审批
     * @param data
     * @return
     */
  Boolean approve(InputApprovalRecord data);

}
