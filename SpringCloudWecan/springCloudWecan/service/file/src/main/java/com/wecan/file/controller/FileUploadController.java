package com.wecan.file.controller;

import com.wecan.commonutils.commonClass.aop.response.ResponseResultBody;
import com.wecan.commonutils.commonClass.lock.ResourceManage;
import com.wecan.file.service.FileService;
import com.wecan.file.utils.FtpUtils;
import com.wecan.modelview.model.vo.file.output.UploadStatus;
import lombok.var;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.util.concurrent.CountDownLatch;

/**
 * 文件上传
 */
@RestController
@RequestMapping("/File")
@CrossOrigin(origins = "*")

@ResponseResultBody
public class FileUploadController {

    @Autowired
    FileService fileService;

    @PostMapping(value = "/", headers = "content-type=multipart/form-data")
    public void upload(String name, MultipartFile file) throws IOException {
        try {
            FtpUtils.Upload("Images/java/test/aaa", file.getInputStream());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @PostMapping(value = "/upload", headers = "content-type=multipart/form-data")
    public UploadStatus up(MultipartFile file, String fileName, int currentChunk, int chunkCount, int chunkSize) throws Exception {
        return fileService.uploadChnckFtp(file.getInputStream(), fileName, "Images/java/test/aaa", currentChunk, chunkCount, chunkSize);
    }

    @PostMapping(value = "/uploadFilePath", headers = "content-type=multipart/form-data")
    public UploadStatus up(@RequestPart("file") MultipartFile file, @RequestParam("fileName") String fileName, @RequestParam("path") String path, @RequestParam("currentChunk") int currentChunk, @RequestParam("chunkCount") int chunkCount, @RequestParam("chunkSize") int chunkSize) throws Exception {

        System.out.println("处理中:" + path + fileName + +currentChunk + "/" + chunkCount);
        var result = fileService.uploadChnckFtp(file.getInputStream(), fileName, path, currentChunk, chunkCount, chunkSize);
        System.out.println(result);
        return result;
    }

    ResourceManage resourceManage = new ResourceManage(10);
    CountDownLatch countDownLatch = new CountDownLatch(1);

    @GetMapping(value = "/test")
    public String getTestSemaphore() throws InterruptedException {
        for (int i = 1; i <= 30; i++) {
            new Thread(new SemaphoreTest(resourceManage, i, countDownLatch)).start(); // 创建多个资源使用者
        }

        countDownLatch.countDown();

        // 主线程阻塞，防止jvm提早退出
        Thread.sleep(150000);
        return "";
    }


}