package com.minibyte.aop;

import com.alibaba.fastjson.JSON;
import com.xinchao.trade.api.exception.BizException;
import com.xinchao.trade.biz.service.RedisService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.concurrent.TimeUnit;

/**
 * @author
 */
@Component
@Slf4j
public class AsyncRequestDataService {

    @Resource
    private RedisService redisService;

    private static final String ASYNC_REQUEST_DATA_KEY = "async_request_data:";

    public AsyncReqData addTaskData(String requestId){
        log.info("新增异步请求任务"+requestId);
        AsyncReqData asyncReqData = new AsyncReqData();
        asyncReqData.setRequestId(requestId);
        asyncReqData.setStatus(1);
        asyncReqData.setTimestamp(System.currentTimeMillis());
        putToCache(requestId,asyncReqData);
        return asyncReqData;
    }

    public void success(String requestId, Object resp) {
        log.info(requestId+"-调用成功:{}", JSON.toJSONString(resp));
        AsyncReqData asyncReqData = getFromCache(requestId);
        asyncReqData.setRetData(resp);
        asyncReqData.setStatus(2);
        putToCache(requestId,asyncReqData);

    }

    public void failure(String requestId, Throwable throwable) {
        log.error(requestId+"-调用失败："+throwable.getMessage(),throwable);
        AsyncReqData asyncReqData = getFromCache(requestId);
        asyncReqData.setStatus(3);
        asyncReqData.setErrMsg(throwable.getMessage());
        putToCache(requestId,asyncReqData);

    }

    public Integer getStatus(String requestId) {
        AsyncReqData asyncReqData = getFromCache(requestId);
        return asyncReqData.getStatus();
    }

    public AsyncReqData getData(String requestId) {
        AsyncReqData asyncReqData = getFromCache(requestId);
        if(asyncReqData.getStatus()==1){
            throw new BizException("任务状态错误，状态值"+asyncReqData.getStatus());
        }
        delete(requestId);
        return asyncReqData;
    }

    public String getError(String requestId) {
        AsyncReqData asyncReqData = getFromCache(requestId);
        if(asyncReqData.getStatus()!=3){
            throw new BizException("任务状态错误，状态值"+asyncReqData.getStatus());
        }
        delete(requestId);
        return asyncReqData.getErrMsg();
    }

    public AsyncReqData getFromCache(String requestId) {
        String json = redisService.get(ASYNC_REQUEST_DATA_KEY + requestId);
        if(json == null){
            throw new BizException("请求不存在");
        }
        AsyncReqData asyncReqData = JSON.parseObject(json,AsyncReqData.class);
        return asyncReqData;
    }

    private void putToCache(String requestId,AsyncReqData data){
        redisService.set(ASYNC_REQUEST_DATA_KEY+requestId,JSON.toJSON(data));
    }

    private void delete(String requestId){
        redisService.expireKey(ASYNC_REQUEST_DATA_KEY+requestId,5,TimeUnit.SECONDS);
    }


}

