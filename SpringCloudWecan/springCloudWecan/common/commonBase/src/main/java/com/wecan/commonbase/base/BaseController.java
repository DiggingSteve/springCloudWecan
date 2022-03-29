package com.wecan.commonbase.base;

import com.wecan.commonutils.commonClass.format.DataTypeConversion;
import com.wecan.modelview.user.UserData;
import org.springframework.web.bind.annotation.ModelAttribute;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class BaseController {

    private HttpServletRequest request;

    private HttpServletResponse response;

    public UserData userData;

    @ModelAttribute
    public void init(HttpServletRequest request, HttpServletResponse response) {
        this.request = request;
        this.response = response;
        setUserData();
        //allowCrossDomainAccess();
    }

    private void setUserData() {
        String userInfoStr = request.getHeader("token");
        if (userInfoStr == null) {
            userData = new UserData();
            return;
        }
        userData = DataTypeConversion.stringToViewModel(userInfoStr, UserData.class);
    }
}
