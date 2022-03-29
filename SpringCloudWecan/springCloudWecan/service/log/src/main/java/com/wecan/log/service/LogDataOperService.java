package com.wecan.log.service;

import com.wecan.commonutils.commonClass.result.ReturnResult;
import com.wecan.modelview.logger.LogData;

public interface LogDataOperService {
   // ReturnResult insertLogToDb(LogData logData);
    ReturnResult insertLogToMongoDb(LogData logData);
}
