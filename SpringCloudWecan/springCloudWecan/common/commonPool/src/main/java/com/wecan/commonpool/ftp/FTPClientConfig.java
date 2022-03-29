package com.wecan.commonpool.ftp;

import lombok.Getter;
import lombok.Setter;
import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.pool2.impl.GenericObjectPoolConfig;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import javax.ws.rs.GET;

@Component("FTPClientConfig")
@Lazy
public class FTPClientConfig extends GenericObjectPoolConfig<FTPClient> {


    @Value("${FTP.host}")
    private String host;// 主机名
    private int port = 21;// 端口
    @Value("${FTP.username}")
    private String username;// 用户名
    @Value("${FTP.pwd}")
    private String password;// 密码
    @Value("${FTP.connectTimeOut}")
    private int connectTimeOut = 5000;// ftp 连接超时时间 毫秒

    @Getter
    @Setter
    @Value("${FTP.maxTotal}")
    private  int total; // 池最大数
    private String controlEncoding = "utf-8";
    private int bufferSize = 1024;// 缓冲区大小
    private int fileType = 2;// 传输数据格式 2表binary二进制数据
    private int dataTimeout = 3 * 1000;
    private boolean useEPSVwithIPv4 = false;
    private boolean passiveMode = true;// 是否启用被动模式
    private int threadNum=1;//开启线程数
    private int transferFileType=FTPClient.BINARY_FILE_TYPE;//传输文件类型
    private boolean renameUploaded=false;//是否上传文件重命名;
    private int retryTimes=3;//重试次数


    public String getHost() {

        return host;
    }

    public void setHost(String host) {

        this.host = host;
    }

    public int getPort() {

        return port;
    }

    public void setPort(int port) {

        this.port = port;
    }

    public String getUsername() {

        return username;
    }

    public void setUsername(String username) {

        this.username = username;
    }

    public String getPassword() {

        return password;
    }

    public void setPassword(String password) {

        this.password = password;
    }

    public int getConnectTimeOut() {

        return connectTimeOut;
    }

    public void setConnectTimeOut(int connectTimeOut) {

        this.connectTimeOut = connectTimeOut;
    }

    public String getControlEncoding() {

        return controlEncoding;
    }

    public void setControlEncoding(String controlEncoding) {

        this.controlEncoding = controlEncoding;
    }

    public int getBufferSize() {

        return bufferSize;
    }

    public void setBufferSize(int bufferSize) {

        this.bufferSize = bufferSize;
    }

    public int getFileType() {

        return fileType;
    }

    public void setFileType(int fileType) {

        this.fileType = fileType;
    }

    public int getDataTimeout() {

        return dataTimeout;
    }

    public void setDataTimeout(int dataTimeout) {

        this.dataTimeout = dataTimeout;
    }

    public boolean isUseEPSVwithIPv4() {

        return useEPSVwithIPv4;
    }

    public void setUseEPSVwithIPv4(boolean useEPSVwithIPv4) {

        this.useEPSVwithIPv4 = useEPSVwithIPv4;
    }

    public boolean isPassiveMode() {

        return passiveMode;
    }

    public void setPassiveMode(boolean passiveMode) {

        this.passiveMode = passiveMode;
    }

    public int getThreadNum() {

        return threadNum;
    }

    public void setThreadNum(int threadNum) {

        this.threadNum = threadNum;
    }

    public int getTransferFileType() {

        return transferFileType;
    }

    public void setTransferFileType(int transferFileType) {

        this.transferFileType = transferFileType;
    }

    public boolean isRenameUploaded() {

        return renameUploaded;
    }

    public void setRenameUploaded(boolean renameUploaded) {

        this.renameUploaded = renameUploaded;
    }

    public int getRetryTimes() {

        return retryTimes;
    }

    public void setRetryTimes(int retryTimes) {

        this.retryTimes = retryTimes;
    }


}
