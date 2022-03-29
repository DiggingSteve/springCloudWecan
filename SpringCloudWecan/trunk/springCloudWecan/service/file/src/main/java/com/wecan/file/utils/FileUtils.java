package com.wecan.file.utils;


import org.apache.commons.codec.binary.Hex;

import java.io.*;
import java.nio.ByteBuffer;
import java.nio.CharBuffer;
import java.nio.channels.FileChannel;
import java.nio.charset.Charset;
import java.nio.charset.CharsetDecoder;
import java.nio.charset.CharsetEncoder;
import java.security.MessageDigest;
import java.util.UUID;

/**
 * 文件操作工具类
 */
public class FileUtils {

    /**
     * 写入文件
     *
     * @param target
     * @param src
     * @throws IOException
     */
    public static void writeAppend(String target, InputStream src) throws IOException {
        FileOutputStream os = new FileOutputStream(target,true);// true 代表是append写入

        byte[] buf = new byte[1024];
        while (-1 != src.read(buf)) {
            os.write(buf);
        }
        os.flush();
        os.close();
        src.close();
    }

    public static void writeAppend(OutputStream os,InputStream src) throws IOException {
        byte[] buf = new byte[1024];
        while (-1 != src.read(buf)) {
            os.write(buf);
        }
        os.flush();
        os.close();
        src.close();
    }

    /**
     * 分块写入文件
     *
     * @param target
     * @param targetSize
     * @param src
     * @param srcSize
     * @param chunks
     * @param chunk
     * @throws IOException
     */
    public static void writeWithBlok(String target, Long targetSize, InputStream src, Long srcSize, Integer chunks, Integer chunk) throws IOException {
        RandomAccessFile randomAccessFile = new RandomAccessFile(target, "rw");
        randomAccessFile.setLength(targetSize);
        if (chunk == chunks - 1) {
            randomAccessFile.seek(targetSize - srcSize);
        } else {
            randomAccessFile.seek(chunk * srcSize);
        }
        byte[] buf = new byte[1024];
        int len;
        while (-1 != (len = src.read(buf))) {
            randomAccessFile.write(buf, 0, len);
        }
        randomAccessFile.close();
    }

    /**
     * 生成随机文件名
     *
     * @return
     */
    public static String generateFileName() {
        return UUID.randomUUID().toString();
    }

    public static final int BUFSIZE = 1024 * 8;
    public static void mergeFiles(String path,String fileName, String[] fileNames) {
        FileChannel outChannel = null;

        try {
            outChannel = new FileOutputStream(path+fileName).getChannel();
            for (String f : fileNames) {
                f=path+f;
                Charset charset = Charset.forName("utf-8");
                CharsetDecoder chdecoder = charset.newDecoder();
                CharsetEncoder chencoder = charset.newEncoder();
                FileChannel fc = new FileInputStream(f).getChannel();
                ByteBuffer bb = ByteBuffer.allocate(BUFSIZE);
                CharBuffer charBuffer = chdecoder.decode(bb);
                ByteBuffer nbuBuffer = chencoder.encode(charBuffer);
                while (fc.read(nbuBuffer) != -1) {
                    bb.flip();
                    nbuBuffer.flip();
                    outChannel.write(nbuBuffer);
                    bb.clear();
                    nbuBuffer.clear();
                }
                fc.close();
            }
            delFiles(path,fileNames);

        } catch (IOException ioe) {
            ioe.printStackTrace();
        } finally {
            try {
                if (outChannel != null) {
                    outChannel.close();
                }
            } catch (IOException ignore) {
            }
        }
    }

    public  static void delFiles(String path,String[] fileNames) throws FileNotFoundException {
        for (String f : fileNames) {
            f = path + f;
            File delFile=new File(f);
            delFile.delete();
        }
    }

    /**
     * 获取一个文件的md5值(可处理大文件)
     * @return md5 value
     */
    public static String getMD5(File file) {
        FileInputStream fileInputStream = null;
        try {
            MessageDigest MD5 = MessageDigest.getInstance("MD5");
            fileInputStream = new FileInputStream(file);
            byte[] buffer = new byte[8192];
            int length;
            while ((length = fileInputStream.read(buffer)) != -1) {
                MD5.update(buffer, 0, length);
            }
            return new String(Hex.encodeHex(MD5.digest()));
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        } finally {
            try {
                if (fileInputStream != null){
                    fileInputStream.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
