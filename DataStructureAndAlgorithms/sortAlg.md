# 排序算法

参考资料： 

[视频资料](https://www.bilibili.com/video/BV1nJ411V7bd?p=160)

https://www.runoob.com/w3cnote/radix-sort.html

## 基本概念和排序方法概述

## 插入排序

​	基本思想：每一步将一个待排序的对象，按其关键码的大小，插入到前面已经排好序的一组对象的适当位置上，直到对象全部插入为止。

​	基本操作：有序插入

- 在有序序列中插入一个元素，保持序列有序，有序长度不断增加。
- 起初，a[0]是长度为1的子序列。然后，逐一将a[1]至a[n-1]插入到有序子序列中。
- 在插入a[i]前，数组a的前半段(a[0]~a[i-1])是有序段，后半段(a[i]~a[n-1])是停留于输入次序的“无序段”。
- 插入a[i]使a[0]~a[i-1]有序，也就是要为a[i]找到有序位置j(0<=j<=i)，将a[i]插入在a[j]的位置上。

插入排序种类有：直接插入排序、二分插入排序、希尔排序等。

### 直接插入排序

​	顺序法定位插入位置。

​	[视频资料](https://www.bilibili.com/video/BV1nJ411V7bd?p=160)

![img](img/sortAlg/insertionSort.gif)

```java
public class Main {

    static int[] insertSort(int[] array) {
        for (int i = 1; i < array.length; i++) {
            int t = array[i], j;
            // 将比当前大的数往后面挪一位
            for (j = i - 1; j >= 0 && array[j] > t ; j--) {
                array[j + 1] = array[j];
            }
            // 将数据放在自己合适的位置上
            array[j + 1] = t;
        }
        return array;
    }
    
    public static void main(String[] args){
        int[] array={49,38,65,97,76,13,27,49,78,34,12,64,1};
        System.out.println("排序之前：");
        for(int i=0;i<array.length;i++){
            System.out.print(array[i]+" ");
        }

//       直接插入排序
        array = insertSort(array);

        System.out.println();
        System.out.println("排序之后：");
        for(int i=0;i<array.length;i++){
            System.out.print(array[i]+" ");
        }
    }
}

```

算法分析：

- 实现排序的基本操作有两个：
  - 比较 序列中两个关键字的大小
  - 移动 记录。
    - 最好的情况，关键字在记录序列中顺序有序，只需要比较一次就知道它的位置。
    - 最坏的情况：关键在在记录序列中山逆序有序，这样全部都需要比较然后后移。

### 二分（折半）法插入排序

​	二分法定位插入位置

[视频资料](https://www.bilibili.com/video/BV1nJ411V7bd?p=161)

```java
public class Main {
    static int[] halfInsertSort(int[] array) {
        for (int i = 1; i < array.length; i++) {
            int t = array[i];
            int low = 0;
            int high = i - 1;
            int mid = (low + high) / 2;
            while (low <= high) {
                if (t < array[mid]) {
                    high = mid - 1;
                } else {
                    low = mid + 1;
                }
                mid = (low + high) / 2;
            }
            System.out.print(low + "\t" + high);
            int j;
            for (j = i - 1; j >= low; j--) {
                array[j + 1] = array[j];
            }
            array[j + 1] = t;
//            array[low] = t;
        }

        return array;
    }

    public static void main(String[] args){
        int[] array={49,38,65,97,76,13,27,49,78,34,12,64,1};
        System.out.println("排序之前：");
        for(int i=0;i<array.length;i++){
            System.out.print(array[i]+" ");
        }

//        折半插入排序
        array = halfInsertSort(array);

        System.out.println();
        System.out.println("排序之后：");
        for(int i=0;i<array.length;i++){
            System.out.print(array[i]+" ");
        }
    }
}

```

算法分析：

- 折半查找比顺序查找快，所以折半插入排序就平均性能来说比插入排序要快；

- 它所需要的关键码比较次数与待排序对象序列的初始排列无关，仅依赖于对象个数。在哈如第i个对象时，需要经过log2i+1次关键比较，才能确定它应该插入的位置。

  - 当n较大的时候，总关键码比较次数比直接插入排序的最坏情况要很多，比其最好情况要差；
  - 在对象的初始排列已经按照关键码排好序或接近有序时，直接插入排序比折半插入排序执行的关键码比较次数要少；

- 折半插入排序的对象移动次数与直接插入排序相同，依赖于对象的初始排列；

  - 减少了比较次数，但没有减少移动次数

  - 平均性能优于直接插入排序。

    ```
    时间复杂度 O(n平方)
    空间复杂度为 O(1)
    是一种稳定的排序方法。
    ```

    

### 希尔插入排序

​	缩小增量多遍插入排序

基本思想：

​		先将整个待排记录序列分割成若干子序列，分别进行直接插入排序，待整个序列中的记录“基本有序”时，再对全体记录进行一次直接插入排序。

希尔排序算法，特点：

1. 缩小增量
2. 多遍插入排序
3. 不稳定排序算法

​	[视频资料](https://www.bilibili.com/video/BV1nJ411V7bd?p=162)

![img](img/sortAlg/Sorting_shellsort_anim.gif)

```java
package com.csii;

public class Main {

    static int[] shellInsertSort(int[] array) {
        //希尔排序
        int gap = array.length;
        while (true) {
            gap /= 2;   //增量每次减半
            for (int i = 0; i < gap; i++) {
                for (int j = i + gap; j < array.length; j += gap) {//这个循环里其实就是一个插入排序
                    int temp = array[j];
                    int k = j - gap;
                    while (k >= 0 && array[k] > temp) {
                        array[k + gap] = array[k];
                        k -= gap;
                    }
                    array[k + gap] = temp;
                }
            }
            if (gap == 1)
                break;
        }
        return array;
    }

    public static void main(String[] args){
        int[] array={49,38,65,97,76,13,27,49,78,34,12,64,1};
        System.out.println("排序之前：");
        for(int i=0;i<array.length;i++){
            System.out.print(array[i]+" ");
        }

        // 希尔排序
        array = shellInsertSort(array);

        System.out.println();
        System.out.println("排序之后：");
        for(int i=0;i<array.length;i++){
            System.out.print(array[i]+" ");
        }
    }
}
```

## 交换排序

​	基本思想：两两比较，如果发生逆序则交换，直到所有记录都排好序为止。

### 冒泡排序

​	---- 基于简单交换思想

​	基本思想：每趟不断将记录两两比较，并按“前小后大”规则交换。

​	交换排序顾名思义就是通过元素的两两比较，判断是否符合要求，如过不符合就交换位置来达到排序的目的。冒泡排序名字的由来就是因为在交换过程中，类似水冒泡，小（大）的元素经过不断的交换由水底慢慢的浮到水的顶端。

　　冒泡排序的思想就是利用的比较交换，利用循环将第 i 小或者大的元素归位，归位操作利用的是对 n 个元素中相邻的两个进行比较，如果顺序正确就不交换，如果顺序错误就进行位置的交换。通过重复的循环访问数组，直到没有可以交换的元素，那么整个排序就已经完成了。

例如： 6个记录 21, 25, 49, 25*, 16, 08

第1趟结束:	21, 25, 25*, 16, 08, **49**

第2趟结束:	21, 25, 16, 08, **25*, 49**

第3趟结束:	21, 16, 08, **25, 25*, 49**

第4趟结束:	16, 08, **21, 25, 25*, 49**

第5趟结束:	08, **16, 21, 25, 25*, 49**

​	下面详细分析一下常规版的冒泡排序，整个算法流程其实就是上面实例所分析的过程。可以看出，我们在进行每一次大循环的时候，还要进行一个小循环来遍历相邻元素并交换。所以我们的代码中首先要有两层循环。

　　**外层循环**：即主循环，需要辅助我们找到当前第 i 小的元素来让它归位。所以我们会一直遍历 n-2 次，这样可以保证前 n-1 个元素都在正确的位置上，那么最后一个也可以落在正确的位置上了。

　　**内层循环**：即副循环，需要辅助我们进行相邻元素之间的比较和换位，把大的或者小的浮到水面上。所以我们会一直遍历 n-1-i 次这样可以保证没有归位的尽量归位，而归位的就不用再比较了。

　　而上面的问题，出现的原因也来源于这两次无脑的循环，正是因为循环不顾一切的向下执行，所以会导致在一些特殊情况下得多余。例如 5，4，3，1，2 的情况下，常规版会进行四次循环，但实际上第一次就已经完成排序了。

![img](img/sortAlg/bubbleSort.gif)

```java

    public static void main(String[] args){
        int[] array={49,38,65,97,76,13,27,49,78,34,12,64,1};
        System.out.println("排序之前：");
        for(int i=0;i<array.length;i++){
            System.out.print(array[i]+" ");
        }

//        ========== 交换排序 ===========
//        冒泡排序
        array = bubbleSort(array);

        System.out.println();
        System.out.println("排序之后：");
        for(int i=0;i<array.length;i++){
            System.out.print(array[i]+" ");
        }
    }

    private static int[] bubbleSort(int[] array) {
        for (int i = 0; i < array.length - 1; i++) {
            for (int j = 0; j < array.length - i - 1; j++) {
                if (array[j] > array[j + 1]) {
                    int t = array[j + 1];
                    array[j + 1] = array[j];
                    array[j] = t;
                }
            }
        }

        return array;
    }
```

算法分析：

​	优点：每趟结束时，不仅能挤出一个最大值到最后，还能同时部分理顺其它元素；

**如何提交效率？**

​	一单某一趟比较时不出现记录交换，说明已经排好序了，就可以结束本算法。

```java
public static void main(String[] args){
        int[] array={49,38,65,97,76,13,27,49,78,34,12,64,1};
        System.out.println("排序之前：");
        for(int i=0;i<array.length;i++){
            System.out.print(array[i]+" ");
        }

//        ========== 交换排序 ===========
//        冒泡排序
//        array = bubbleSort(array);
//        冒泡排序（优化）
        array = bubbleSort2(array);

        System.out.println();
        System.out.println("排序之后：");
        for(int i=0;i<array.length;i++){
            System.out.print(array[i]+" ");
        }
    }

    private static int[] bubbleSort2(int[] array) {
        for (int i = 0; i < array.length - 1; i++) {
            boolean swap = false;
            for (int j = 0; j < array.length - i - 1; j++) {
                if (array[j] > array[j + 1]) {
                    int t = array[j + 1];
                    array[j + 1] = array[j];
                    array[j] = t;
                    swap = true;
                }
            }
            if (!swap) { // 未发生交换就跳出
                break;
            }
        }

        return array;
    }
```

如何再进一步提高效率？

​	　第 i 趟排的第 i 小或者大的元素已经在第 i 位上了，甚至可能第 i-1  位也已经归位了，那么在内层循环的时候，有这种情况出现就会导致多余的比较出现。例如：6，4，7，5，1，3，2，当我们进行第一次排序的时候，结果为6，7，5，4，3，2，1，实际上后面有很多次交换比较都是多余的，因为没有产生交换操作。

```java
public static void main(String[] args){
        int[] array={49,38,65,97,76,13,27,49,78,34,12,64,1};
        System.out.println("排序之前：");
        for(int i=0;i<array.length;i++){
            System.out.print(array[i]+" ");
        }

//       =========== 插入排序 ===========
//       直接插入排序
//        array = insertSort(array);
//        折半插入排序
//        array = halfInsertSort(array);
//         希尔排序
//        array = shellInsertSort(array);

//        ========== 交换排序 ===========
//        冒泡排序
//        array = bubbleSort(array);
//        冒泡排序（优化）
//        array = bubbleSort2(array);
//        冒泡排序（再进一步优化）
        array = bubbleSort3(array);

        System.out.println();
        System.out.println("排序之后：");
        for(int i=0;i<array.length;i++){
            System.out.print(array[i]+" ");
        }
    }

    private static int[] bubbleSort3(int[] array) {
        int endComparePos = array.length - 1;
        int tmpPos = 0; // 记录最后一次交换的位置
        for (int i = 0; i < array.length - 1; i++) {
            boolean swap = false;
            for (int j = 0; j < endComparePos; j++) {
                if (array[j] > array[j + 1]) {
                    int t = array[j + 1];
                    array[j + 1] = array[j];
                    array[j] = t;
                    swap = true; //发生交换
                    tmpPos = j; //记录交换的位置
                }
            }
            endComparePos = tmpPos; //把最后一次交换的位置给len，来缩减内循环的次数
            if (!swap) {
                break;
            }
        }

        return array;
    }
```

冒泡排序性能

| 算法 | 最好时间 | 最坏时间 | 平均时间 | 额外空间 | 稳定性 |
| :--: | :------: | :------: | :------: | :------: | :----: |
| 冒泡 |  O(n）   |  O(n2)   |  O(n2)   |    1     |  稳定  |

　　关于稳定性：因为在比较的过程中，当两个相同大小的元素相邻，只比较大或者小，所以相等的时候是不会交换位置的。而当两个相等元素离着比较远的时候，也只是会把他们交换到相邻的位置。他们的位置前后关系不会发生任何变化，所以算法是稳定的。

　　关于最优时间复杂度为什么是O(n)，当然是优化过算法之后了！大家继续向下看就知道了！。

### 鸡尾酒排序

​	鸡尾酒排序又称双向冒泡排序、鸡尾酒搅拌排序、搅拌排序、涟漪排序、来回排序或快乐小时排序, 是冒泡排序的一种变形。**该算法与冒泡排序的不同处在于排序时是以双向在序列中进行排序。**

​	使用鸡尾酒排序为一列数字进行排序的过程可以通过右图形象的展示出来：
​	数组中的数字本是无规律的排放，先找到最小的数字，把他放到第一位，然后找到最大的数字放到最后一位。然后再找到第二小的数字放到第二位，再找到第二大的数字放到倒数第二位。以此类推，直到完成排序。

![img](img/sortAlg/20180521164746118)

```java
public static int[] cocktailSort(int[] src)
{
        int len = src.length;
    //将最小值排到队尾
    for(int i = 0 ; i < len/2 ; i++)
    {
        for(int j = i ; j < len-i-1 ; j++)
        {
            if(src[j] < src[j+1])
            {
                int temp = src[j];
                src[j] = src[j+1];
                src[j+1] = temp;
            }
            System.out.println("交换小"+Arrays.toString(src));
        }
        //将最大值排到队头
        for(int j = len-1-(i+1); j > i ; j--)
        {
            if(src[j] > src[j-1])
            {
                int temp = src[j];
                src[j] = src[j-1];
                src[j-1] = temp;
            }
            System.out.println("交换大"+Arrays.toString(src));
        }
        System.out.println("第"+i+"次排序结果："+Arrays.toString(src));
    }
    return src;
}
```



### 快速排序

​	不稳定排序

​	基本思想：

- 任取一个元素（如：第一个）为中心；

- 所有比它小的元素一律前放，比它大的元素一律后放，形成左右两个子表；

- 对各子表重新选择中心元素并依次规则调整；

- 直到每个子表的元素只剩一个；

  参考资料：[这个文章不错](https://blog.csdn.net/shujuelin/article/details/82423852)
  
  ![img](img/sortAlg/quickSort.gif)

```java
    public static void main(String[] args){
        int[] array={49,38,65,97,76,13,27,49,78,34,12,64,1};
        System.out.println("排序之前：");
        for(int i=0;i<array.length;i++){
            System.out.print(array[i]+" ");
        }

//        ========== 交换排序 ===========
//        冒泡排序
//        array = bubbleSort(array);
//        冒泡排序（优化）
//        array = bubbleSort2(array);
//        冒泡排序（再进一步优化）
//        array = bubbleSort3(array);
//        快速排序
        array = qsort(array, 0, array.length - 1);

        System.out.println();
        System.out.println("排序之后：");
        for(int i=0;i<array.length;i++){
            System.out.print(array[i]+" ");
        }
    }

    private static int[] qsort(int[] array, int start, int end) {
        int pvoit = array[start];
        int i = start;
        int j = end;
        int t;
        if (i < j) {
            while (i < j) {
                //先看右边，依次往左递减
                while (i < j && array[j] >= pvoit) j--;
                //先看右边，依次往左递减
                while (i < j && array[i] <= pvoit) i++;
                if (i < j) {
                    t = array[i];
                    array[i] = array[j];
                    array[j] = t;
                }
            }
            array[start] = array[i];
            array[i] = pvoit;

            qsort(array, start, j - 1);
            qsort(array, j + 1, end);
        }

        return array;
    }
```

$$
时间复杂度：O(nlog_2n) \\
空间复杂度:O(nlog_2n)
$$

​	快速排序不适于对原本有序或基本有序的记录序列进行排序，会退化成为没有改进措施的冒泡排序。

- 划分元素的选取是影响时间性能的关键。

- 输入数据次序越乱，所选划分元素值的随机性越好，排序速度越快，快速排序不是自然排序方法。

- 改变划分元素的选取方法，至多只能改变算法平均情况下的时间性能，无法改变最坏情况下的时间性能。即**最坏情况下**，快速排序的时间复杂性总是
  $$
  O(n^2)
  $$
  

## 选择排序

### 简单选择排序

​	基本思想：在待排序的数据中选出最大（小）的元素放在最终的位置。

​	基本操作：

1. 首先通过n-1次关键字比较，从n个记录中找出关键字最小的记录，将它与第一个记录交换。
2. 再通过n-2次比较，从剩余的n-1个记录中找出关键字最小的记录，将它与第二个记录交换。
3. 重复上述操作，共进行n-1趟排序后，排序结束。

![img](img/sortAlg/selectionSort.gif)

```java
    public static void main(String[] args){
        int[] array={49,38,65,97,76,13,27,49,78,34,12,64,1};
        System.out.println("排序之前：");
        for(int i=0;i<array.length;i++){
            System.out.print(array[i]+" ");
        }

//        ========== 选择排序 ===========
//        简单选择排序
        array = selectSort(array);

        System.out.println();
        System.out.println("排序之后：");
        for(int i=0;i<array.length;i++){
            System.out.print(array[i]+" ");
        }
    }

    private static int[] selectSort(int[] array) {
        for (int i = 0; i < array.length; i++) {
            int k = i;
            for (int j = i + 1; j < array.length; j++) {
                if (array[j] < array[k]) {
                    k = j; // 记录最小值位置
                }
            }
            if (k != i) {
                int t = array[i];
                array[i] = array[k];
                array[k] = t;
            }
        }

        return array;
    }
```

算法分析：

- 记录移动次数
  - 最好情况（已经有序） 0
  - 最坏情况 3(n-1)
- 比较次数：无论待排序列处于什么状态，选择排序所需要进行的比较次数都相同。
- 简单选择排序是不稳定排序。

时间复杂度：
$$
O(n^2)
$$

### 堆排序

堆排序（Heapsort）是指利用堆这种数据结构所设计的一种排序算法。堆积是一个近似完全二叉树的结构，并同时满足堆积的性质：即子结点的键值或索引总是小于（或者大于）它的父节点。堆排序可以说是一种利用堆的概念来排序的选择排序。分为两种方法：

1. 大顶堆：每个节点的值都大于或等于其子节点的值，在堆排序算法中用于升序排列；
2. 小顶堆：每个节点的值都小于或等于其子节点的值，在堆排序算法中用于降序排列；

堆排序的平均时间复杂度为 Ο(nlogn)。

#### 1. 算法步骤

1. 创建一个堆 H[0……n-1]；
2. 把堆首（最大值）和堆尾互换；
3. 把堆的尺寸缩小 1，并调用 shift_down(0)，目的是把新的数组顶端数据调整到相应位置；
4. 重复步骤 2，直到堆的尺寸为 1。

#### 2. 动图演示

​	![img](img/sortAlg/heapSort.gif)

![img](img/sortAlg/Sorting_heapsort_anim.gif)

```java

    public static void main(String[] args){
        int[] array={49,38,65,97,76,13,27,49,78,34,12,64,1};
        System.out.println("排序之前：");
        for(int i=0;i<array.length;i++){
            System.out.print(array[i]+" ");
        }

//        ========== 选择排序 ===========
//        简单选择排序
//        array = selectSort(array);
//        堆排序
        array = heapSort(array);

        System.out.println();
        System.out.println("排序之后：");
        for(int i=0;i<array.length;i++){
            System.out.print(array[i]+" ");
        }
    }

    /**
     * 选择排序-堆排序
     * @param array 待排序数组
     * @return 已排序数组
     */
    public static int[] heapSort(int[] array) {
        //这里元素的索引是从0开始的,所以最后一个非叶子结点array.length/2 - 1
        for (int i = array.length / 2 - 1; i >= 0; i--) {
            adjustHeap(array, i, array.length);  //调整堆
        }

        // 上述逻辑，建堆结束
        // 下面，开始排序逻辑
        for (int j = array.length - 1; j > 0; j--) {
            // 元素交换,作用是去掉大顶堆
            // 把大顶堆的根元素，放到数组的最后；换句话说，就是每一次的堆调整之后，都会有一个元素到达自己的最终位置
            swap(array, 0, j);
            // 元素交换之后，毫无疑问，最后一个元素无需再考虑排序问题了。
            // 接下来我们需要排序的，就是已经去掉了部分元素的堆了，这也是为什么此方法放在循环里的原因
            // 而这里，实质上是自上而下，自左向右进行调整的
            adjustHeap(array, 0, j);
        }
        return array;
    }

    /**
     * 整个堆排序最关键的地方
     * @param array 待组堆
     * @param i 起始结点
     * @param length 堆的长度
     */
    public static void adjustHeap(int[] array, int i, int length) {
        // 先把当前元素取出来，因为当前元素i可能要一直移动
        int temp = array[i];
        for (int k = 2 * i + 1; k < length; k = 2 * k + 1) {  //2*i+1为左子树i的左子树(因为i是从0开始的),2*k+1为k的左子树
            // 让k先指向子节点中最大的节点
            if (k + 1 < length && array[k] < array[k + 1]) {  //如果有右子树,并且右子树大于左子树
                k++;
            }
            //如果发现结点(左右子结点)大于根结点，则进行值的交换
            if (array[k] > temp) {
                swap(array, i, k);
                // 如果子节点更换了，那么，以子节点为根的子树会受到影响,所以，循环对子节点所在的树继续进行判断
                i  =  k;
            } else {  //不用交换，直接终止循环
                break;
            }
        }
    }

    /**
     * 交换元素
     * @param arr
     * @param a 元素的下标
     * @param b 元素的下标
     */
    public static void swap(int[] arr, int a, int b) {
        int temp = arr[a];
        arr[a] = arr[b];
        arr[b] = temp;
    }
```

算法分析：

- 初始化堆所需时间不超过O(n) 

- 排序阶段（不含初始堆化）

  - 一次重新堆化所需时间不超过O(logn)
  - n-1次循环所需时间不超过O(nlogn)

- 堆排序的时间主要耗费在建立初始堆和调整建新堆时的反复筛选上。堆排序在最坏情况下，其时间复杂度也为
  $$
  O(nlog_2n)
  $$
  ,这是堆排序的最大优点。无论待排序列中的记录是正序还是逆序排序，都不会使堆排序处于”最好“或”最坏“的状态。

- 堆排序是一种不稳定的排序方法，它不适用于待排序n-1次循环所需时间不超过记录个数n较少的情况。

## 二叉树排序

​	**二叉树排序的基本原理：**使用第一个元素作为根节点，如果之后的元素比第一个小，则放到左子树，否则放到右子树，之后按中序遍历。中序遍历的结果就是有序的。



## 归并排序

​	[百度查询](https://baike.baidu.com/item/%E5%BD%92%E5%B9%B6%E6%8E%92%E5%BA%8F/1639015?fr=aladdin)

​	基本思想：将两个或两个以上的**有序子序列**”归并“为一个有序序列。常见的2路归并排序。

​	归并排序（Merge Sort）是建立在归并操作上的一种有效，稳定的排序算法，该算法是采用分治法（Divide and Conquer）的一个非常典型的应用。将已有序的子序列合并，得到完全有序的序列；即先使每个子序列有序，再使子序列段间有序。若将两个有序表合并成一个有序表，称为二路归并。

![img](img/sortAlg/mergeSort.gif)

```java

    public static void main(String[] args){
        int[] array={49,38,65,97,76,13,27,49,78,34,12,64,1};
        System.out.println("排序之前：");
        for(int i=0;i<array.length;i++){
            System.out.print(array[i]+" ");
        }

//        ========== 归并排序 ===========
        array = mergeSort(array, 0, array.length - 1);

        System.out.println();
        System.out.println("排序之后：");
        for(int i=0;i<array.length;i++){
            System.out.print(array[i]+" ");
        }
    }


    public static int[] mergeSort(int[] nums, int l, int h) {
        if (l == h) {
            return new int[] { nums[l] };
        }

        int mid = l + (h - l) / 2;
        int[] leftArr = mergeSort(nums, l, mid); //左有序数组
        int[] rightArr = mergeSort(nums, mid + 1, h); //右有序数组
        int[] newNum = new int[leftArr.length + rightArr.length]; //新有序数组
		
        // 递归使用归并思想归并有序序列（按理是对一个已经有序的序列进行合并）
        int m = 0, i = 0, j = 0;
        while (i < leftArr.length && j < rightArr.length) {
            newNum[m++] = leftArr[i] < rightArr[j] ? leftArr[i++] : rightArr[j++];
        }
        while (i < leftArr.length)
            newNum[m++] = leftArr[i++];
        while (j < rightArr.length)
            newNum[m++] = rightArr[j++];
        return newNum;
    }
```





## 计数排序

计数排序的核心在于将输入的数据值转化为键存储在额外开辟的数组空间中。作为一种线性时间复杂度的排序，计数排序要求输入的数据必须是有确定范围的整数。

1. 计数排序的特征

当输入的元素是 n 个 0 到 k 之间的整数时，它的运行时间是 Θ(n + k)。计数排序不是比较排序，排序的速度快于任何比较排序算法。

由于用来计数的数组C的长度取决于待排序数组中数据的范围（等于待排序数组的最大值与最小值的差加上1），这使得计数排序对于数据范围很大的数组，需要大量时间和内存。例如：计数排序是用来排序0到100之间的数字的最好的算法，但是它不适合按字母顺序排序人名。但是，计数排序可以用在基数排序中的算法来排序数据范围很大的数组。

通俗地理解，例如有 10 个年龄不同的人，统计出有 8 个人的年龄比 A 小，那 A 的年龄就排在第 9 位,用这个方法可以得到其他每个人的位置,也就排好了序。当然，年龄有重复时需要特殊处理（保证稳定性），这就是为什么最后要反向填充目标数组，以及将每个数字的统计减去 1 的原因。

 算法的步骤如下：

- （1）找出待排序的数组中最大和最小的元素
- （2）统计数组中每个值为i的元素出现的次数，存入数组C的第i项
- （3）对所有的计数累加（从C中的第一个元素开始，每一项和前一项相加）
- （4）反向填充目标数组：将每个元素i放在新数组的第C(i)项，每放一个元素就将C(i)减去1

![img](img/sortAlg/countingSort-1606358504227.gif)

```java
public class CountingSort implements IArraySort {

    @Override
    public int[] sort(int[] sourceArray) throws Exception {
        // 对 arr 进行拷贝，不改变参数内容
        int[] arr = Arrays.copyOf(sourceArray, sourceArray.length);

        int maxValue = getMaxValue(arr);

        return countingSort(arr, maxValue);
    }

    private int[] countingSort(int[] arr, int maxValue) {
        int bucketLen = maxValue + 1;
        int[] bucket = new int[bucketLen];

        for (int value : arr) {
            bucket[value]++;
        }

        int sortedIndex = 0;
        for (int j = 0; j < bucketLen; j++) {
            while (bucket[j] > 0) {
                arr[sortedIndex++] = j;
                bucket[j]--;
            }
        }
        return arr;
    }

    private int getMaxValue(int[] arr) {
        int maxValue = arr[0];
        for (int value : arr) {
            if (maxValue < value) {
                maxValue = value;
            }
        }
        return maxValue;
    }

}
```



## 桶排序

桶排序是计数排序的升级版。它利用了函数的映射关系，高效与否的关键就在于这个映射函数的确定。为了使桶排序更加高效，我们需要做到这两点：

1. 在额外空间充足的情况下，尽量增大桶的数量
2. 使用的映射函数能够将输入的 N 个数据均匀的分配到 K 个桶中

同时，对于桶中元素的排序，选择何种比较排序算法对于性能的影响至关重要。

### 1. 什么时候最快

当输入的数据可以均匀的分配到每一个桶中。

### 2. 什么时候最慢

当输入的数据被分配到了同一个桶中。

### 3. 示意图

元素分布在桶中：

![img](img/sortAlg/Bucket_sort_1.svg_.png)

然后，元素在每个桶中排序：

![img](img/sortAlg/Bucket_sort_2.svg_.png)

```java
public class BucketSort implements IArraySort {

    private static final InsertSort insertSort = new InsertSort();

    @Override
    public int[] sort(int[] sourceArray) throws Exception {
        // 对 arr 进行拷贝，不改变参数内容
        int[] arr = Arrays.copyOf(sourceArray, sourceArray.length);

        return bucketSort(arr, 5);
    }

    private int[] bucketSort(int[] arr, int bucketSize) throws Exception {
        if (arr.length == 0) {
            return arr;
        }

        int minValue = arr[0];
        int maxValue = arr[0];
        for (int value : arr) {
            if (value < minValue) {
                minValue = value;
            } else if (value > maxValue) {
                maxValue = value;
            }
        }

        int bucketCount = (int) Math.floor((maxValue - minValue) / bucketSize) + 1;
        int[][] buckets = new int[bucketCount][0];

        // 利用映射函数将数据分配到各个桶中
        for (int i = 0; i < arr.length; i++) {
            int index = (int) Math.floor((arr[i] - minValue) / bucketSize);
            buckets[index] = arrAppend(buckets[index], arr[i]);
        }

        int arrIndex = 0;
        for (int[] bucket : buckets) {
            if (bucket.length <= 0) {
                continue;
            }
            // 对每个桶进行排序，这里使用了插入排序
            bucket = insertSort.sort(bucket);
            for (int value : bucket) {
                arr[arrIndex++] = value;
            }
        }

        return arr;
    }

    /**
     * 自动扩容，并保存数据
     *
     * @param arr
     * @param value
     */
    private int[] arrAppend(int[] arr, int value) {
        arr = Arrays.copyOf(arr, arr.length + 1);
        arr[arr.length - 1] = value;
        return arr;
    }

}
```



## 基数排序

​		基数排序（radix sort）属于“分配式排序”（distribution sort），又称“桶子法”（bucket sort）或bin sort，顾名思义，它是透过键值的部份资讯，将要排序的元素分配至某些“桶”中，藉以达到排序的作用，基数排序法是属于稳定性的排序，其时间复杂度为O (nlog(r)m)，其中r为所采取的基数，而m为堆数，在某些时候，基数排序法的效率高于其它的稳定性排序法。

![img](img/sortAlg/radixSort.gif)

```java

    public static void main(String[] args){
        int[] array={49,38,65,97,76,13,27,49,78,34,12,64,1};
        System.out.println("排序之前：");
        for(int i=0;i<array.length;i++){
            System.out.print(array[i] + " ");
        }

//        =========== 基数排序 ============
        array = radixSort(array, 2);

        System.out.println();
        System.out.println("排序之后：");
        for(int i=0;i<array.length;i++){
            System.out.print(array[i]+" ");
        }
    }

    /**
     *
     * @param number 带排序数组
     * @param d 表示最大的数有多少位
     * @return
     */
    private static int[] radixSort(int[] number, int d) {
        int[][] temp = new int[10][number.length]; // 数组的第一维表示可能的余数0-9  10个桶
        int[] order = new int[10]; // 数组order[i]用来表示该位是i的存放数的个数  每个桶存放的数字个数

        // n 1  10 100 1000....
        // m 1   2  3   4....
        // d 表示最大的数有多少位
        for (int n = 1, m = 1; m < d; m++, n *= 10) { //控制键值排序依据在哪一位  m++, n *= 10 前往下一位
            // ======== 分配 ===========
            for (int i = 0; i < number.length; i++) {
                int lsd = (number[i] / n) % 10; // 取每一位的数
                temp[lsd][order[lsd]] = number[i];
                order[lsd] ++;
            }
            // ======== 收集 ===========
            for (int i = 0, k = 0; i < order.length; i++) {
                if (order[i] != 0) {
                    for (int j = 0; j < order[i]; j++) {
                        number[k] = temp[i][j];
                        k++;
                    }
                }
                order[i] = 0; // 归0,下次好使用
            }
        }

        return number;
    }
```



## 外部排序(略)

​	待排序的文件无法一次装入内存，需要在内存和外部存储器之间进行多次数据交换，以达到排序整个文件的**目的**

## 排序综合分析

![img](img/sortAlg/sort.png)

![img](img/sortAlg/0B319B38-B70E-4118-B897-74EFA7E368F9.png)

### 关于时间复杂度

**平方阶 (O(n2))** 排序 各类简单排序：直接插入、直接选择和冒泡排序。

**线性对数阶 (O(nlog2n))** 排序 快速排序、堆排序和归并排序；

**O(n1+§)) 排序**，§ 是介于 0 和 1 之间的常数。 希尔排序

**线性阶 (O(n)) 排序** 基数排序，此外还有桶、箱排序。

关于稳定性

**稳定的排序算法：**冒泡排序、插入排序、归并排序和基数排序。

**不是稳定的排序算法：**选择排序、快速排序、希尔排序、堆排序。

名词解释：

- n：数据规模
- k："桶"的个数
- In-place：占用常数内存，不占用额外内存
- Out-place：占用额外内存
- 稳定性：排序后 2 个相等键值的顺序和排序之前它们的顺序相同

