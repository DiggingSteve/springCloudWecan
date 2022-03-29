package com.wecan.file.service;

import com.wecan.commonutils.commonClass.exception.BusinessException;
import com.wecan.commonutils.commonClass.lock.ResourceManage;
import com.wecan.file.utils.FileUtils;
import com.wecan.file.utils.FtpClientPoolSingleton;
import com.wecan.modelview.model.vo.file.output.UploadStatus;
import lombok.var;
import org.apache.commons.net.ftp.FTPClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.text.NumberFormat;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 文件上传服务
 */
@Service
public class FileService {

    @Value("${FTP.host}")
    private String ftpaddress;


    @Value("${HTTP.address}")
    private String fileaddress;


    // 用于控制并发写入同名文件的线程数 用map加信号量实现 信号量只给1个信号
    final static ConcurrentHashMap<String, ResourceManage> rmap = new ConcurrentHashMap();
    private Object lock;

    public FileService() {
        this.lock = this;
    }

    //public final String head="\\\\192.168.0.113\\Images\\Images\\test\\";
    public final String head = "d:\\";

    public void uploadChunck(MultipartFile file, String fileName, int currentChunk, int chunkCount) throws IOException, BusinessException {
        String tempFilename = head + fileName;
        //文件上传完毕则抛出异常
        if (currentChunk == 0) {
            delExistFile(fileName, head);
        }
        FileUtils.writeAppend(tempFilename, file.getInputStream());
    }

    /**
     * @param stream
     * @param filename
     * @param path
     * @param currentChunk
     * @param chunkCount
     * @description: ftp 分片上传
     * @return: void
     * @author: yaodui
     */
    public UploadStatus uploadChnckFtp(InputStream stream, String filename, String path, int currentChunk, int chunkCount, int chunkSize) throws Exception {
        String key = path + filename;//同一文件同时只能有一处上传 但是目前只有单机有效 如果 支持多节点部署需要分布式锁
        ResourceManage rm = null;
        synchronized (lock) {
            if (rmap.containsKey(key)) rm = rmap.get(key);
            else {
                rm = new ResourceManage(1);
                rmap.put(key, rm);
            }
        }

        try {
            rm.useResource((d) -> {
                var pool = FtpClientPoolSingleton.getPool();
                var client = pool.borrowObject();
                moveToDirectory(client, path);
                client.setRestartOffset(currentChunk * chunkSize);
                if (currentChunk == 0) {
                    delExistFtpFile(client, new String(filename.getBytes("utf-8"), "iso-8859-1"));
                }
                // 一定要按此编码打开文件流
                OutputStream os = client.appendFileStream(new String(filename.getBytes("GBK"), "iso-8859-1"));

                if (os == null && client.getReplyCode() == 550) {
                    // 不存在文件时 要用 storeFileStream 以上代码存在 并发同文件名读写冲突需要加锁
                    os = client.storeFileStream(new String(filename.getBytes("GBK"), "iso-8859-1"));
                }
                System.out.println(os);
                if (os == null) {
                    var errorMsg  = "ftp异常请尝试重试";
                    throw new BusinessException(errorMsg);
                }
                FileUtils.writeAppend(os, stream);

                var flag = client.completePendingCommand();
                pool.returnObject(client);
            });
        } catch (Exception e) {
            throw e;
        } finally {
            rm.returnResource();
            rmap.remove(key);
        }

        return createUploadStatus(currentChunk, chunkCount, filename, path);
    }

    /**
     * @param path
     * @param filename
     * @description:判断是否同名文件在该目录下已经上传完毕
     * @return: java.lang.Boolean
     * @author: yaodui
     */
    private void delExistFile(String filename, String path) {
        File f = new File(path + filename);
        if (f.exists()) {
            f.delete();
        }
    }

    private UploadStatus createUploadStatus(int currentChunk, int chunkCount, String filename, String path) {
        var status = new UploadStatus();
        NumberFormat numberFormat = NumberFormat.getInstance();
// 设置精确到小数点后2位
        numberFormat.setMaximumFractionDigits(2);
        var percent = Math.round(((float) (currentChunk + 1)
                /
                (float) chunkCount)
                * 100);
        status.setPercent(percent);

        var fileArr = new String[]{"http:", "", fileaddress, path, filename};
        var ftpArr = new String[]{"ftp:", "", ftpaddress, path, filename};
        status.setFileaddress(String.join("/", fileArr));
        status.setFtpaddress(String.join("/", ftpArr));
        return status;
    }

    private void delExistFtpFile(FTPClient client, String fielname) throws IOException {
        client.deleteFile(fielname);
    }

    /**
     * @param path eg. Images/aaa/java/test
     * @description: 移动到对应ftp目录
     * @return:
     * @author: yaodui
     */
    private void moveToDirectory(FTPClient client, String path) throws IOException {
        String[] dirs = path.split("/");
        for (String dir : dirs) {
            boolean isExistsDir = client.changeWorkingDirectory(dir);
            if (!isExistsDir) {
                client.makeDirectory(dir);
                client.changeWorkingDirectory(dir);
            }
        }
    }
}
