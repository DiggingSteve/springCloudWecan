/**
 * @description:
 * @author: yaodui
 * @time: 2021/10/25 17:42
 */
package com.wecan.modelview.model.vo.fee.view;

import com.wecan.modeldbo.airfreight.fee.TruckFee;
import lombok.Data;

import java.util.Objects;

@Data
public class ViewTruckFee {

    public Long feeid;

    public String mdg;

    public String ddg;

    public String twocode;

    public Integer wageinout;

    @Override
    public int hashCode() {
        return Objects.hash(this.feeid);
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null) return false;
        if (obj instanceof TruckFee) {
            TruckFee d = (TruckFee) obj;
            return Objects.equals(this.feeid, d.getGuid());
        }
        return false;


    }
}
