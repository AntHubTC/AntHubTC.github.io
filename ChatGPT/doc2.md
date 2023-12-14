# 使用ChatGPT辅助编程一

往往我们各人实力优先，但是要快速写出超出自身能力的程序出来，可以借助ChatGPT快速学习对应知识和生成对应的程序，在理解基础的程序后，你可以对程序修改，直到达到你想要的结果



## Wrk压测脚本生成

[性能测试工具 wrk](https://www.cnblogs.com/quanxiaoha/p/10661650.html)

### 不会安装？ChatGPT

![image-20231214143940073](img/doc2/image-20231214143940073.png)

### 不会写压测脚本？ChatGPT

![image-20231214141814650](img/doc2/image-20231214141814650.png)

test.lua文件：

```lua
wrk.method = "GET"
wrk.headers["Authorization"] = "Bearer 23a83f2b-4dec-432e-bec8-9aa3411f39a2"

request_url = "http://ec-biz-order.ec-test/fix/photoRequirement?projectId=1611653021000018"

wrk.path = request_url
```

命令执行：

```shell
wrk -t2 -c400 -d30s -s test.lua http://ec-biz-order.ec-test/fix/photoRequirement
```

![image-20231214142117614](img/doc2/image-20231214142117614.png)

找了一个公司ec-biz-order工程的查询接口进行压测，得到的QPS是94。

1核 2G  Intel(R) Xeon(R) Gold 6266C CPU @ 3.00GHz



## ChatGPT帮我写算法

一次开发中，需要写一个这样一个算法，当时这个算法对我有难度，然后求助的ChatGPT的。

> 需求是这样的，对于公司SSP系统中有楼盘-》单元-》点位的概念，一个单元有多个点位，梯外广告屏是以单元为售卖单元，要在一堆单元中找到点位数累计最接近或等于目标需求点位数，找出这些单元信息。

然后我根据这样的需求信息，转化了一个更通俗，大家容易理解的描述：

> *用java写一个算法，并添加详细代码注释，算法需求：查找数字数组中累加和最接近目标累加和的组合*

然后chatgpt就给了我对应代码，然后我就封装到了一个算法累中：

```java
package com.xinchao.trade.biz.service.splitproject;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * 算法工具包
 */
public class AlgorithmUtil {

    /**
     * 查找数字数组中累加和最接近目标累加和的组合
     * 
     * @param nums 数字数组
     * @param sum 目标累加和
     * @return 累加和最接近目标累加和的组合
     */
    public static List<Integer> findClosestSum(List<Integer> nums, int sum) {
        List<Integer> res = new ArrayList<>();
        int n = nums.size();
        // 对数字数组进行排序
        Collections.sort(nums);
        // 定义二维数组dp，dp[i][j]表示在前i个数字中，是否存在一种组合使得其累加和最接近j
        boolean[][] dp = new boolean[n+1][sum+1];
        // 初始化dp数组，dp[0][0]的值为true，其余值均为false
        dp[0][0] = true;
        // 更新dp数组
        for (int i = 1; i <= n; i++) {
            for (int j = 0; j <= sum; j++) {
                if (dp[i-1][j]) {
                    dp[i][j] = true;
                    if (j+nums.get(i-1) <= sum) {
                        dp[i][j+nums.get(i-1)] = true;
                    }
                }
            }
        }
        // 找到dp[n][sum]为true的最大j值，即为累加和最接近sum的组合
        int j = sum;
        while (j >= 0 && !dp[n][j]) {
            j--;
        }
        // 逆推出累加和最接近sum的组合
        int i = n;
        while (j > 0 && i > 0) {
            if (j-nums.get(i-1) >= 0 && dp[i-1][j-nums.get(i-1)]) {
                res.add(nums.get(i-1));
                j -= nums.get(i-1);
            }
            i--;
        }
        return res;
    }
}
```

然后使用的业务代码是这样的：

```java
/**
     * 动态规划分配单元点位信息
     * @param limitPointTotal 点位数上限
     * @param unitPointMap 单元点位情况
     * @param importUnitIds 导入的单元列表
     * @param unitPoints 最终分配使用的点位情况 ----------- (输出的分配结果)
     */
    private void dynamicProgrammingAllocationUnitPoint(Integer limitPointTotal,
                                                       Map<String, ImmutablePair<Long, List<String>>> unitPointMap,
                                                       List<String> importUnitIds,
                                                       List<UnitDismatlePointDto.UnitDismatleUnitPoint> unitPoints) {
        // 将每个单元的点位个数收集起来
        List<Integer> unitPointSizeList = unitPointMap.values().stream()
                .map(ImmutablePair::getRight)
                .filter(CollUtil::isNotEmpty)
                .map(List::size)
                .collect(Collectors.toList());
        List<Integer> closestPointSizeList = AlgorithmUtil.findClosestSum(unitPointSizeList, limitPointTotal);
        // 是否使用最佳组合对应位置的数
        boolean[] usedPointSizeFlags = new boolean[closestPointSizeList.size()];

        for (String importUnitId : importUnitIds) {
            ImmutablePair<Long, List<String>> pair = unitPointMap.getOrDefault(importUnitId, ImmutablePair.of(0L, Collections.emptyList()));
            Long premisesId = pair.getLeft();
            List<String> pointNumList = Optional.ofNullable(pair.right).orElse(Collections.emptyList());
            // 算法结果最佳组合是否有使用当前单元的点位编码
            boolean isUseCurUnitPoint = isUseCurUnitPoint(closestPointSizeList, usedPointSizeFlags, pointNumList);

            UnitDismatlePointDto.UnitDismatleUnitPoint unitDismatleUnitPoint = new UnitDismatlePointDto.UnitDismatleUnitPoint();
            unitDismatleUnitPoint.setPremisesId(String.valueOf(premisesId));
            unitDismatleUnitPoint.setUnitId(importUnitId);
            unitDismatleUnitPoint.setCodes(Collections.emptyList());
            unitDismatleUnitPoint.setErrMsg(null);
            if (isUseCurUnitPoint) {
                unitDismatleUnitPoint.setIsOk(Boolean.TRUE);
                unitDismatleUnitPoint.setCodes(pointNumList);
            } else {
                // 单元点位没有被使用，这种期刊就是超出当前方案刊播城市期望点位数量的单元没被选上
                unitDismatleUnitPoint.setIsOk(Boolean.FALSE);
                unitDismatleUnitPoint.setErrMsg("超出当前方案刊播城市的期望点位数量");
            }
            unitPoints.add(unitDismatleUnitPoint);
        }
    }

    /**
     * 算法结果最佳组合是否有使用当前单元的点位编码
     *
     * @param closestPointSizeList
     * @param usedPointSizeFlags
     * @param pointNumList
     * @return
     */
    private boolean isUseCurUnitPoint(List<Integer> closestPointSizeList, boolean[] usedPointSizeFlags, List<String> pointNumList) {
        boolean isUseCurUnitPoint = false;
        for (int i = 0; i < closestPointSizeList.size(); i++) {
            if (usedPointSizeFlags[i]) {
                // 已经使用的不再使用
                continue;
            }
            if (pointNumList.size() == closestPointSizeList.get(i)) {
                // 使用这个点位数量
                usedPointSizeFlags[i] = isUseCurUnitPoint = true;
                break;
            }
        }
        return isUseCurUnitPoint;
    }
```

