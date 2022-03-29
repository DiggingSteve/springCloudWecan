package com.wecan.fee.service;

import com.wecan.modeldbo.airfreight.fee.TruckFee;
import com.wecan.modelview.model.vo.fee.input.InputTruckFee;
import com.wecan.modelview.model.vo.fee.output.OutputTruckDetail;
import com.wecan.modelview.model.vo.fee.output.OutputTruckFee;

import java.util.List;

public interface ITruckFee extends IBaseService{

    List<TruckFee> saveFee(List<InputTruckFee> data,Boolean isSync);

    void syncToWagein(List<InputTruckFee>data);

    List<TruckFee> editFee(List<InputTruckFee> data,Boolean isSync);

    void delFee(List<InputTruckFee> data);

    List<OutputTruckFee>getList(String json);


    OutputTruckDetail getFeeDetail(String json);
}
