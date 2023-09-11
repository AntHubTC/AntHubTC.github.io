package com.xinchao.common.async;

import com.alibaba.fastjson.JSONObject;
import com.xinchao.common.dto.RespData;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author XC16775
 */
@Api("异步接口-状态轮训")
@RestController
@RequestMapping("/async")
public class AsyncDataController {

    @Autowired
    private AsyncRequestDataService asyncRequestDataService;

    @ApiOperation("轮询状态 1：执行中 2：成功 3：失败")
    @GetMapping("/status/{requestId}")
    public RespData getStatus(@ApiParam("任务ID") @PathVariable("requestId") String requestId) {
        Integer status = asyncRequestDataService.getStatus(requestId);
        JSONObject json = new JSONObject();
        json.put("status", status);
        return RespData.news(json);
    }

    @ApiOperation("获取成功数据,成功状态返回数据，其他状态返回报错。获取成功后后端进行清理，无法重复获取")
    @GetMapping("/data/{requestId}")
    public RespData<AsyncReqData> getData(@ApiParam("任务ID") @PathVariable("requestId") String requestId) {
        return RespData.news(asyncRequestDataService.getData(requestId));
    }
}
