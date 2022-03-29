package com.wecan.commonutils.commonClass.http;

import com.wecan.commonutils.commonClass.format.DataTypeConversion;
import lombok.var;
import org.apache.http.client.methods.*;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.springframework.http.HttpMethod;

import java.io.IOException;
import java.nio.charset.Charset;

public class HttpClient {


    public static String getDataByUrl(String url, Object data) {
        return dataByUrl(url, data, HttpMethod.GET);
    }

    public static String postDataByUrl(String url, Object data) {

        return dataByUrl(url, data, HttpMethod.POST);
    }

    public static String putDataByUrl(String url, Object data) {

        return dataByUrl(url, data, HttpMethod.PUT);
    }

    public static String deleteDataByUrl(String url, Object data) {

        return dataByUrl(url, data, HttpMethod.DELETE);
    }


    private static String dataByUrl(String url, Object data, HttpMethod method) {
        var strResult = "";
        var httpclient = HttpClients.createDefault();

        try {
            var response = executeResponse(url, data, method, httpclient);
            var httpEntity = response.getEntity();
            strResult = EntityUtils.toString(httpEntity);

        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                httpclient.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return strResult;
    }

    private static CloseableHttpResponse executeResponse(String url, Object data, HttpMethod method, CloseableHttpClient httpclient) throws IOException {

        switch (method) {
            case POST:
                var httpPost = new HttpPost(url);
                httpPost.setHeader("Content-Type", "application/json; charset=utf-8");
                httpPost.setHeader("Accept", "application/json");
                if (data != null) {
                    var jsonStr = DataTypeConversion.objectToString(data);
                    var stringEntity = new StringEntity(jsonStr, Charset.forName("UTF-8"));
                    stringEntity.setContentEncoding("UTF-8");
                    httpPost.setEntity(stringEntity);
                }
                return httpclient.execute(httpPost);
            case PUT:
                var httpPut = new HttpPut(url);
                httpPut.setHeader("Content-Type", "application/json; charset=utf-8");
                httpPut.setHeader("Accept", "application/json");
                if (data != null) {
                    var jsonStr = DataTypeConversion.objectToString(data);
                    var stringEntity = new StringEntity(jsonStr, Charset.forName("UTF-8"));
                    stringEntity.setContentEncoding("UTF-8");
                    httpPut.setEntity(stringEntity);
                }
                return httpclient.execute(httpPut);
            case DELETE:
                var httpDelete = new HttpDeleteWithBody(url);
                httpDelete.setHeader("Content-Type", "application/json; charset=utf-8");
                httpDelete.setHeader("Accept", "application/json");
                if (data != null) {
                    var jsonStr = DataTypeConversion.objectToString(data);
                    var stringEntity = new StringEntity(jsonStr, Charset.forName("UTF-8"));
                    stringEntity.setContentEncoding("UTF-8");
                    httpDelete.setEntity(stringEntity);
                }
                return httpclient.execute(httpDelete);

            default:
                var httpGet = new HttpGet(url);
                httpGet.setHeader("Connection", "keep-alive");
                httpGet.setHeader("Content-Type", "application/json; charset=UTF-8");
                httpGet.setHeader("Accept", "application/json");
                return httpclient.execute(httpGet);
        }
    }
}
