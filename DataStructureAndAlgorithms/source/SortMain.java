package com.csii;

public class SortMain {

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
            if (!swap) {
                break;
            }
        }

        return array;
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


    public static int[] mergeSort(int[] nums, int l, int h) {
        if (l == h) {
            return new int[] { nums[l] };
        }

        int mid = l + (h - l) / 2;
        int[] leftArr = mergeSort(nums, l, mid); //左有序数组
        int[] rightArr = mergeSort(nums, mid + 1, h); //右有序数组
        int[] newNum = new int[leftArr.length + rightArr.length]; //新有序数组

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
//        array = bubbleSort3(array);
//        快速排序
//        array = qsort(array, 0, array.length - 1);

//        ========== 选择排序 ===========
//        简单选择排序
//        array = selectSort(array);
//        堆排序
//        array = heapSort(array);

//        ========== 归并排序 ===========
//        array = mergeSort(array, 0, array.length - 1);

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

}
