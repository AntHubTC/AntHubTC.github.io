# 线性表

## 定义

​	由**零个或多个**数据元素组成的有限**序列**。

- 序列：有序的列表。
- 若元素存在多个，则第一个元素无前驱，而最后一个元素无后继，其它元素都有且只有一个前驱和后继。
- 线性表强调是有限的，事实上无论计算机发展到多强大，它所处理的元素都是有限的。

## 线性表顺序存储结构

### 存储结构介绍

顺序存储结构封装需要三个属性：

1. 存储空间的起始位置，**数组**data，它的存储位置就是线性表存储空间的存储位置。
2. 线性表的最大存储容量：数组的长度MaxSize
3. 线性表的当前长度length

> 数组的长度与线性表的当前长度需要区分一下：数组的长度是存放线性表的存储空间的总长度，一般初始化后不变。而线性表的当前长度是线性表中元素的个数，是会变化的。

### 数据结构优缺点

优点：

- 无须为表示表中元素之间的逻辑关系而增加额外的存储空间。
- 可以快速地存取表中任意位置的元素。

缺点：

- 插入和删除操作需要移动大量元素。
- 当线性表长度变化较大时，难以确定存储空间的容量。
- 容易造成存储空间的“碎片”。

### 练习代码

![1569809828662](.\img\1569809828662.png)

List.java

```java
package com.tc.dsa.line.list;

public interface List<E> {

    /**
     * 获取一个元素
     * @param pos 从0开始到len-1
     * @return
     */
    public E getElem(int pos);

    /**
     * 新增一个元素
     * @param elem
     */
    public List<E> insert(E elem);

    public List<E> insertAt(int index, E elem);

    /**
     * 删除一个元素
     * @param elem
     */
    public List<E> delete(E elem);

    /**
     * 检查是否为空
     *
     * @return
     */
    public boolean isEmpty();

    /**
     * 清空一个列表
     */
    public void emptyList();

    /**
     * 检测元素在列表中的位置，查找成功返回第一个匹配元素的位置，否则-1
     *
     * @param elem
     * @return 从0开始到len-1的位置
     */
    public int locateElem(E elem);

    /**
     * 序列转换为数组
     * @return
     */
    public Object[] toArray();

    /**
     * 序列转换为数组
     * @param a
     * @param <T>
     * @return
     */
    public <T> T[] toArray(T[] a);

    /**
     * 获取序列当前的大小
     * @return
     */
    public int size();
}
```

ArrayList.java

```java
package com.tc.dsa.line.list;

import java.io.Serializable;
import java.util.Arrays;

public class ArrayList <E> implements List<E>, Serializable {
    // 存放元素的数组
    private Object[] elementData;

    // 当前已经存储元素的大小
    private int size = 0;

    /**
     * 初始容量
     */
    private static final int INIT_CAPACITY = 10;
    private static final Object[] EMPTY_OBJECTS = new Object[0];

    public ArrayList() {
        this.elementData = new Object[INIT_CAPACITY];
    }

    /**
     * 创建一个list，分配容量为capacity
     * @param capacity
     */
    public ArrayList(int capacity) {
        // 虚拟机对数组的大小是有限制的，如果给一个Integer.MAX_VALUE，那么会报java.lang.OutOfMemoryError: Requested array size exceeds VM limit
        // 所以去看JDK中ArrayList的源码能看到对这个最大数组大小的控制。
        this.elementData = new Object[capacity];
    }

    /**
     * 从数组创建一个list
     * @param list
     */
    public ArrayList(E[] list) {
        int capacity = list.length > INIT_CAPACITY ? list.length : INIT_CAPACITY;
        this.elementData = new Object[capacity];
        System.arraycopy(list, 0, this.elementData, 0, list.length);
    }

    public ArrayList(List<? extends E> list) {
        this.elementData = list.toArray();
        this.size = list.size();
        elementData = Arrays.copyOf(elementData, size, Object[].class);
    }

    public E getElem(int pos) {
        if (pos < 0 && pos >= size) {
            throw new IndexOutOfBoundsException();
        }
        return (E) this.elementData[pos];
    }

    public List<E> insert(E elem) { // 时间复杂度为1
        if (this.size > this.elementData.length - 1) {
            Object[] newDataElems = new Object[this.elementData.length + INIT_CAPACITY * 2];
            System.arraycopy(this.elementData, 0, newDataElems, 0, this.elementData.length);
            this.elementData = newDataElems;
        }
        this.elementData[this.size ++] = elem;

        return this;
    }

    @Override
    public List<E> insertAt(int index, E elem) {
        if (index < 0 || index >= this.size) {
            throw new IndexOutOfBoundsException();
        }
        if (this.size > this.elementData.length - 1) {
            Object[] newDataElems = new Object[this.elementData.length + INIT_CAPACITY * 2];
            System.arraycopy(this.elementData, 0, newDataElems, 0, this.elementData.length);
            this.elementData = newDataElems;
        }
        System.arraycopy(this.elementData, index, this.elementData, index + 1, this.elementData.length - index - 1);
        this.elementData[index] = elem;
        this.size++;

        return this;
    }

    public List<E> delete(E elem) { // 时间复杂度为1
        int loc = locateElem(elem);
        if (loc != -1) {
            System.arraycopy(this.elementData, loc + 1, this.elementData, loc, this.elementData.length - loc - 1);
            this.elementData[--this.size] = null;
        }

        return this;
    }

    public boolean isEmpty() {
        return this.size == 0;
    }

    public void emptyList() {
        this.elementData = EMPTY_OBJECTS;
        this.size = 0;
    }

    public int locateElem(E elem) {
        for (int i = 0; i < size; i++) {
            if (this.elementData[i] == elem) {
                return i;
            }
        }

        return -1;
    }

    public Object[] toArray() {
        return Arrays.copyOf(this.elementData, size);
    }

    public <T> T[] toArray(T[] a) {
        if (a.length < size) {
            return (T[]) Arrays.copyOf(this.elementData, size, a.getClass());
        }
        System.arraycopy(this.elementData, 0, a, 0, size);
        if (a.length > size)
            a[size] = null;
        return a;
    }

    @Override
    public int size() {
        return this.size;
    }

    @Override
    public String toString() {
        return "ArrayList{" +
                "elementData=" + Arrays.toString(elementData) +
                ", size=" + size +
                '}';
    }
}
```

App.java测试

```java
@Test
    public void ArrayListTest() {
        System.out.println("基本构建测试");
        List<Integer> list = new ArrayList<Integer>();
        System.out.println("插入测试");
        list.insert(4).insert(9).insert(1).insert(15).insert(10);
        System.out.println("打印测试");
        System.out.println(list.toString());

        System.out.println("insertAt");
        list.insertAt(2, 9999);
        list.insertAt(2, 9999);
        list.insertAt(2, 9999);
        list.insertAt(2, 9991);
        list.insertAt(2, 9991);
        list.insertAt(2, 9991);
        System.out.println(list.toString());

        System.out.println("超过容量测试");
        list.insert(7).insert(33).insert(37).insert(22).insert(98).insert(28).insert(48);
        System.out.println(list);

        System.out.println("清空测试");
        list.emptyList();
        System.out.println(list);

        boolean isEmpty = list.isEmpty();
        System.out.println("isEmpty:" + isEmpty);

        System.out.println("清空后数据重新新增测试");
        list.insert(10).insert(100).insert(44).insert(5).insert(58);
        System.out.println(list);
        System.out.println("size:" +list.size());

        System.out.println("to array测试");
        Object[] objects = list.toArray();
        System.out.println("objects:" + Arrays.toString(objects));

        System.out.println("to array测试");
        Integer[] objectArr = list.toArray(new Integer[2]);
        System.out.println("objectArr:" + Arrays.toString(objectArr));

        System.out.println("定位元素测试");
        int pos = list.locateElem(5);
        System.out.println("pos:" + pos);
        pos = list.locateElem(99999);
        System.out.println("pos:" + pos);

        System.out.println("getElem测试");
        Integer elem = list.getElem(2);
        System.out.println(elem);

        System.out.println("delete测试");
        System.out.println(list);
        list.delete(44);
        list.delete(100);
        list.delete(99);
        System.out.println(list);

//        new java.util.ArrayList<String>(0x7fffffff);
    }
```



### 思考

​		顺序存储结构中，删除和在指定位置新增都需要移动大量的元素，是否能在基于数组上优化成一个不需要大量移动的结构。参考后面的**静态链表**。



## 线性表的链式存储结构

### 单链表

#### 存储结构介绍

​		线性表的链式存储结构的特点是用一组任意的存储单元存储线性表的元素,这组存储单元可以存储在内存中未被占用的任意位置。

​		比起顺序存储结构每个数据元素只需要存储一个位置就可以了。现在链式存储结构中，除了要存储数据元素信息外，还要存储它的后继元素的存储地址。

​		我们把存储数据元素信息的域称为数据域,把存储直接后继位置的域称为指针域。指针域中存储的信息称为指针或链。这两部分信息组成数据元素称为存储映像,称为结点(Node)。

​		n个节点链接成一个链表，即为线性表(a1, a2, a3,..., an)的链式存储结构。

​		因为此链表的每个节点中只包含一个指针域，所以叫做单链表。

#### 头指针与头节点的异同

**头指针**

- 头指针是指链表指向第一个节点的指针，若链表有头节点，则指向头节点的指针。
- 头指针具有标识作用，所以常用头指针冠以链表的名字（指针变量的名字）。
- 无论链表是否为空，头指针均不为空。
- 头指针是链表的必要元素。

**单链表图例**

![1569812222196](.\img\1569812222196.png)

**空链表图例**

![1569812267479](.\img\1569812267479.png)

#### 带头节点的单向链表练习

LinkedList.java

```java
package com.tc.dsa.line.list;

import java.io.Serializable;
import java.util.Arrays;
import java.util.NoSuchElementException;

/**
 * 线性表-单向链表(带链表头节点)
 *
 */
public class LinkedList<E> implements List<E>, Serializable {
    // 头指针
    private Node<E> first;

    // 尾部指针
    private Node<E> last; // 始终指向链条末尾

    // 大小
    private int size;

    public LinkedList() {
        last = first = new Node<E>(null);
        size = 0;
    }

    private void checkIndex(int index) {
        if (!(index >= 0 && index < size)) {
            throw new IndexOutOfBoundsException();
        }
    }

    @Override
    public E getElem(int pos) {
        checkIndex(pos);

        Node<E> tNode = first.next;
        for (int i = 0; i < pos; i ++) {
            tNode = tNode.next;
        }
        return tNode.nodeData;
    }

    @Override
    public List<E> insert(E elem) {
        // 当前链表最后一个节点指向新的节点
        last.next = new Node<E>(elem);
        last = last.next; // 尾指针指向最新元素
        size ++; // 节点数变更

        return this;
    }

    @Override
    public List<E> insertAt(int index, E elem) {
        if (index < 0 || index > size) {
            throw new IndexOutOfBoundsException();
        }
        Node<E> node = first;
        // 得到待插入节点的上一个节点
        for (int i = -1;node != null && i + 1 != index; i ++) {
            node = node.next;
        }
        Node<E> eNode = new Node<E>(elem);
        eNode.next = node.next;
        node.next = eNode;

        if (index == this.size - 1) {
            this.last = eNode;
        }

        // 元素个数发生改变
        this.size++;

        return this;
    }

    @Override
    public List<E> delete(E elem) {
        Node<E> node1 = first;
        Node<E> node2 = first.next; // node2比node1快一步
        boolean isFind = false;
        while (node2 != null) {
            isFind = (node2.nodeData == null && elem == null) || node2.nodeData.equals(elem);
            if (isFind) break;
            node1 = node2;
            node2 = node2.next;
        }
        if (isFind) {
            if (last == node2) {
                // 如果删除的节点就是最后一个节点，那么当前尾指针应该指向当前元素的前一个元素。
                last = node1; // 尾部指针发生改变
            }
            // 去掉当前匹配到的节点
            node1.next = node2.next;
            size--;// 节点数量减少
        } else {
            throw new NoSuchElementException();
        }
        return this;
    }

    @Override
    public boolean isEmpty() {
        return size == 0;
    }

    @Override
    public void emptyList() {
        first.next = null;
        last = first;
        size = 0;
    }

    @Override
    public int locateElem(E elem) {
        int loc = -1;
        Node<E> tNode = first.next;
        for (int i = 0; null != tNode; i++, tNode = tNode.next) {
            if (tNode.nodeData == elem) {
                loc = i;
                break;
            }
        }
        return loc;
    }

    @Override
    public Object[] toArray() {
        int i = 0;
        Object[] result = new Object[size];
        for (Node<E> x = first.next; x != null; x = x.next)
            result[i++] = x.nodeData;

        return result;
    }

    @Override
    public <T> T[] toArray(T[] a) {
        if (a.length < size)
            a = (T[])java.lang.reflect.Array.newInstance(
                    a.getClass().getComponentType(), size);
        int i = 0;
        Object[] result = a;
        for (Node<E> x = first.next; x != null; x = x.next)
            result[i++] = x.nodeData;

        if (a.length > size)
            a[size] = null;

        return a;
    }

    @Override
    public int size() {
        return size;
    }

    // JDK源码中的实现是通过双向链表的形式实现的, 这里我使用的是单链表
    private static class Node<E> implements Serializable{
        E nodeData;
        Node<E> next;

        Node(E nodeData) {
            this.nodeData = nodeData;
        }

        Node(E nodeData, Node<E> next) {
            this.nodeData = nodeData;
            this.next = next;
        }
    }

    @Override
    public String toString() {
        return "LinkedList{nodes=" + Arrays.toString(this.toArray()) + "}";
    }
}
```

测试代码：

```java
@Test
    public void LinkedListWithHead() {
        // 带头结点的单向链表
        List<Integer> list = new LinkedList<Integer>();
        System.out.println("插入测试");
        list.insert(4).insert(9).insert(1).insert(15).insert(10);
        System.out.println("打印");
        System.out.println(list.toString());

        System.out.println("insertAt");
        list.insertAt(0, 9999);
        list.insertAt(2, 9999);
        list.insertAt(2, 9999);
        list.insertAt(2, 9991);
        list.insertAt(2, 9991);
        list.insertAt(2, 9991);
        list.insertAt(list.size(), 6666);
        System.out.println(list.toString());

        System.out.println("清空测试");
        list.emptyList();
        System.out.println(list);

        boolean isEmpty = list.isEmpty();
        System.out.println("isEmpty:" + isEmpty);

        System.out.println("清空后数据重新新增测试");
        list.insert(10).insert(100).insert(44).insert(5).insert(58);
        System.out.println(list);
        System.out.println("size:" +list.size());

        System.out.println("to array测试");
        Object[] objects = list.toArray();
        System.out.println("objects:" + Arrays.toString(objects));

        System.out.println("to array测试");
        Integer[] objectArr = list.toArray(new Integer[2]);
        System.out.println("objectArr:" + Arrays.toString(objectArr));

        System.out.println("定位元素测试");
        int pos = list.locateElem(5);
        System.out.println("pos:" + pos);
        pos = list.locateElem(99999);
        System.out.println("pos:" + pos);

        System.out.println("getElem测试");
        Integer elem = list.getElem(2);
        System.out.println(elem);

        System.out.println("delete测试");
        System.out.println(list);
        list.delete(44);
        System.out.println(list);
        list.delete(10);
        System.out.println(list);
        list.delete(58);
//        list.delete(99);
        System.out.println(list);
    }
```

#### 不带头节点的单向链表练习(尾部插入法)

单链表建表有[头插法和尾插法](https://blog.csdn.net/qq_40938077/article/details/80216563)，下面是采用**尾部插入法**。

LinkedListNoHead.java

```java
package com.tc.dsa.line.list;

import java.io.Serializable;
import java.util.Arrays;
import java.util.NoSuchElementException;

/**
 * 线性表-单向链表(无链表头节点)
 *
 * 代码中使用了头部尾部指针，但是没有使用头节点。
 */
public class LinkedListNoHead<E> implements List<E>, Serializable{

    // 头指针
    private Node<E> first;

    // 尾部指针
    private Node<E> last; // 始终指向最后一个

    // 大小
    private int size;

    public LinkedListNoHead() {
    }

    private void checkIndex(int index) {
        if (!(index >= 0 && index < size)) {
            throw new IndexOutOfBoundsException();
        }
    }

    @Override
    public E getElem(int pos) {
        checkIndex(pos);

        Node<E> tNode = first;
        for (int i = 0; i < pos; i ++) {
            tNode = tNode.next;
        }
        return tNode.nodeData;
    }

    @Override
    public List<E> insert(E elem) {
        Node<E> newNode = new Node<E>(elem);
        if (null == last) { // 检测是否是空链表
            first = newNode; // 头指针指向第一个节点
        } else {
            // 当前链表最后一个节点指向新的节点
            last.next = newNode;
        }
        last = newNode; // 尾指针指向最新元素
        size ++; // 节点数变更

        return this;
    }

    @Override
    public List<E> insertAt(int index, E elem) {
        if (index < 0 || index > size) {
            throw new IndexOutOfBoundsException();
        }
        Node<E> node = first;
        Node<E> eNode = new Node<E>(elem);
        if (index == 0) {
            eNode.next = this.first;
            this.first = eNode;
        } else {
            for (int i = 0;node != null && i + 1 != index; i ++) {
                node = node.next;
            }
            eNode.next = node.next;
            node.next = eNode;
        }

        if (index == this.size - 1) {
            this.last = eNode;
        }

        // 元素个数发生改变
        this.size++;

        return this;
    }

    @Override
    public List delete(Object elem) {
        if (size == 0) {
            throw new NoSuchElementException();
        }
        Node<E> node1 = first;
        Node<E> node2 = first; // node2比node1快一步
        boolean isFind = false;
        while (node2 != null) {
            isFind = (node2.nodeData == null && elem == null) || node2.nodeData.equals(elem);
            if (isFind) break;
            node1 = node2;
            node2 = node2.next;
        }
        if (isFind) {
            // 如果使用了单链表的头部节点，那么下面就不会有这么多判断
            // 匹配到的内容是否是第一个节点
            if (node2 == first) {
                first = node2.next;
            } else if (node2 == last) {
                // 如果删除的节点就是最后一个节点，那么当前尾指针应该指向当前元素的前一个元素。
                last = node1; // 尾部指针发生改变
                node1.next = node2.next;
            } else {
                // 去掉当前匹配到的节点
                node1.next = node2.next;
            }

            size--;// 节点数量减少
        } else {
            throw new NoSuchElementException();
        }

        return this;
    }

    @Override
    public boolean isEmpty() {
        return size == 0;
    }

    @Override
    public void emptyList() {
        first = last = null;
        size = 0;
    }

    @Override
    public int locateElem(Object elem) {
        int loc = -1;
        Node<E> tNode = first;
        for (int i = 0; null != tNode; i++, tNode = tNode.next) {
            if (tNode.nodeData == elem) {
                loc = i;
                break;
            }
        }
//        int i = 0;
//        while (null != tNode) {
//            if (tNode.nodeData == elem) {
//               loc = i;
//               break;
//            }
//            i++;
//            tNode = tNode.next;
//        }
        return loc;
    }

    @Override
    public int size() {
        return size;
    }

    @Override
    public Object[] toArray() {
        int i = 0;
        Object[] result = new Object[size];
        for (Node<E> x = first; x != null; x = x.next)
            result[i++] = x.nodeData;

        return result;
    }

    @Override
    public <T> T[] toArray(T[] a) {
        if (a.length < size)
            a = (T[])java.lang.reflect.Array.newInstance(
                    a.getClass().getComponentType(), size);
        int i = 0;
        Object[] result = a;
        for (Node<E> x = first; x != null; x = x.next)
            result[i++] = x.nodeData;

        if (a.length > size)
            a[size] = null;

        return a;
    }

    // JDK源码中的实现是通过双向链表的形式实现的, 这里我使用的是单链表
    private static class Node<E> implements Serializable{
        E nodeData;
        Node<E> next;

        Node(E nodeData) {
            this.nodeData = nodeData;
        }

        Node(E nodeData, Node<E> next) {
            this.nodeData = nodeData;
            this.next = next;
        }
    }

    @Override
    public String toString() {
        return "LinkedList{nodes=" + Arrays.toString(this.toArray()) + "}";
    }
}
```

测试代码：

```java
@Test
    public void LinkedListNoHead() {
        List<Integer> list = new LinkedListNoHead<Integer>();
        System.out.println("插入测试");
        list.insert(4).insert(9).insert(1).insert(15).insert(10);
        System.out.println("打印");
        System.out.println(list.toString());

        System.out.println("insertAt");
        list.insertAt(0, 9999);
        list.insertAt(2, 9999);
        list.insertAt(2, 9999);
        list.insertAt(2, 9991);
        list.insertAt(2, 9991);
        list.insertAt(2, 9991);
        list.insertAt(list.size(), 6666);
        System.out.println(list.toString());

        System.out.println("清空测试");
        list.emptyList();
        System.out.println(list);

        boolean isEmpty = list.isEmpty();
        System.out.println("isEmpty:" + isEmpty);

        System.out.println("清空后数据重新新增测试");
        list.insert(10).insert(100).insert(44).insert(5).insert(58);
        System.out.println(list);
        System.out.println("size:" +list.size());

        System.out.println("to array测试");
        Object[] objects = list.toArray();
        System.out.println("objects:" + Arrays.toString(objects));

        System.out.println("to array测试");
        Integer[] objectArr = list.toArray(new Integer[2]);
        System.out.println("objectArr:" + Arrays.toString(objectArr));

        System.out.println("定位元素测试");
        int pos = list.locateElem(5);
        System.out.println("pos:" + pos);
        pos = list.locateElem(99999);
        System.out.println("pos:" + pos);

        System.out.println("getElem测试");
        Integer elem = list.getElem(2);
        System.out.println(elem);

        System.out.println("delete测试");
        System.out.println(list);
        list.delete(44);
        System.out.println(list);
        list.delete(10);
        System.out.println(list);
        list.delete(58);
//        list.delete(99);
        System.out.println(list);
    }
```



## 单链表结构与顺序存储结构的优缺点

我们分别从存储方式、时间性能、空间性能三方面来做对比。

### 存储方式

- 顺序存储结构用一段连续的存储单元依次存储线性表的数据元素；
- 单链表采用链式存储结构，用一组任意的存储单元存放线性表的元素。

### 时间性能

1. 查找
   - 顺序存储结构O(1)
   - 单链表O(n)
2. 插入和删除指定位置的元素
   - 顺序存储结构需要平均移动表长一般的元素，时间为O(n)。
   - 单链表在计算出某位置的指针后，插入和删除时间仅为O(1)。

### 空间性能

-  顺序存储结构需要预分配存储空间，分大了，容易造成空间浪费，分小了，容易发生溢出（上面的代码采用的超出范围重新分配更大空间）。
- 单链表不需要分配额外的存储空间，只要有足够的内存，元素个数不受限制。

### 总结

- 若线性表需要频繁查找，很少进行插入和删除操作时，宜采用顺序存储方式。
- 若需要频繁插入和删除时，宜采用单链表结构。
- 当线性表中的元素个数变化较大或者根本不知道有多大时，最好用单链表结构，这样可以不需要考虑存储空间的大小问题。

## 静态链表

​	静态链表的定义：首先让数组的元素都是由两个数据域构成，data和cur，也就是说每一个数组的下标都要对应一个data和一个cur。数据域data用来存放数据元素，也就是通常我们要处理的数据，而cur相当于单链表中的next指针，存放该元素的后继在数组中的下标，我们把cur叫做游标。

我们把这种用数组描述的链表叫做静态链表，这种描述方法还有起名叫做游标实现法。


| 游标 | 5    | 2    | 3    | 4    | 0    | 6    | 7    | ...  | 1    |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| 数据 |      | A    | C    | D    | E    |      |      | ...  |      |
| 下标 | 0    | 1    | 2    | 3    | 4    | 5    | 6    | 7    | 8    |

​	从表中可以看出：

- 我们对数组的第一个和最后一个元素做特殊处理，他们的data不存放数据。
- 我们通常把未使用的数组元素称为备用链表。
- 数组的第一个元素，即下标为0的那个元素的cur就存放备用链表的第一个节点的下标。
- 数组的最后一个元素，即下标为MAXSIZE-1的cur则存放第一个有数据的元素的下标，相当于单链表中的头节点作用。
- 最后一个数据游标指向0。

### 线性表的静态链表存储结构

```c
#define MAXSIZE 1000
typedef struct
{
    ElemType data; // 数据
    int cur; // 游标(Cursor)
} Component, StaticLinkList[MAXSIZE];
```

### 优缺点

优点：

- ​	在插入和删除操作时，只需要修改游标，不需要移动元素，从而改进了在顺序存储结构中的插入和删除操作需要移动大量元素的确定。

缺点：

- 没有解决连续存储分配（数组）带来的表长难以确定的问题。
- 失去了顺序存储结构的随机存取的特性。

总的来说，静态链表其实是为了给没有指针的编程语言设计的一种实现单链表功能的方法。

尽管我们可以用单链表就不用静态链表了，但这样的思考方式是非常巧妙的，应该理解其思想，以备不时之需。

### 练习代码

```java
package com.tc.dsa.line.list;

import java.io.Serializable;
import java.util.Arrays;

/**
 * 线性表-静态链表
 *
 * 本例中数组有两个特殊的节点，第一个节点和最后一个节点，第一个节点的存放的游标是备用链表的第一个节点，最后一个节点
 * 存放的是数据节点链表的第一个节点。 所以，关键是存放了两个节点的数据，不用管他们放在数组什么位置，不过一般放在最前和最后，
 * 所以， 我们也可以将数组的第一个节点和第二个节点来存储这些信息。
 * 另外，我们还可以将这两个节点的游标信息可以提取出来封装到类里面，然后数组就只放数据和备用链表信息。
 *
 */
public class StaticLinkedList<E> implements List<E>, Serializable {

    private Node<E>[] elements;

    private static final int MAXSIZE = 200;

    /**
     * 初始化静态链表
     */
    public StaticLinkedList() {
        elements = new Node[MAXSIZE];
        for (int i = 0; i < MAXSIZE; i++) {
            elements[i] = new Node<E>();
            elements[i].cur = i + 1;
        }
        // 数组末尾指向第一个元素
        elements[MAXSIZE - 1].cur = 0;
    }

    private int mallocSLL () {
        // 第一个元素存放的是备用链表的第一个元素
        int nextUseCur = this.elements[0].cur;
        if (nextUseCur != 0) {
            // 将下一个元素的cur用来作为下一个备用链表的第一个元素
            this.elements[0].cur = this.elements[nextUseCur].cur;
        }
        return nextUseCur;
    }

    @Override
    public E getElem(int pos) {
        Node<E> node = this.elements[this.elements.length - 1];
        int i = 0;
        while (node.cur != 0) {
            node = this.elements[node.cur];
            if (i == pos) {
                return node.data;
            }
            i ++;
        }

        return null;
    }

    @Override
    public List<E> insert(E elem) {
        int nextCur = mallocSLL();
        if (nextCur == 0) {
            throw new RuntimeException("内容已满");
        }
        // 这里默认将内容插入到头部
        this.elements[nextCur] = new Node<E>(elem);
        this.elements[nextCur].cur = this.elements[this.elements.length - 1].cur;
        this.elements[this.elements.length - 1].cur = nextCur;

        return this;
    }

    @Override
    public List<E> insertAt(int index, E elem) {
        int nextCur = mallocSLL();
        if (nextCur == 0) {
            throw new RuntimeException("内容已满");
        }
        int size = this.size();
        if (index < 0 || index > size) {
            throw new IndexOutOfBoundsException();
        }
        Node<E> newNode = new Node<E>(elem);
        Node<E> node = this.elements[this.elements.length - 1];

        for (int i = 0; node.cur != 0; i++) {
            if (i == index) {
                break;
            }
            node = this.elements[node.cur];
        }

        this.elements[nextCur] = newNode;
        newNode.cur = node.cur;
        node.cur = nextCur;

        // 检测插入的位置是否是头部
        if (index == 0) {
            this.elements[this.elements.length - 1].cur = nextCur;
        }

        // 插入到尾部因为继承上次指向的0，所以不用做特殊处理
        return this;
    }

    @Override
    public List<E> delete(E elem) {
        Node<E> node = this.elements[this.elements.length - 1];
        Node<E> pNode = node;
        boolean isFind = false;
        do {
            node = this.elements[node.cur];
            if (node.data == elem) {
                isFind = true;
                break;
            }
            pNode = node;
        } while (node.cur != 0);

        if (isFind) {
            // 备用链表回收该节点
            int nodeCur = node.cur;
            this.elements[0].cur = pNode.cur;
            node.cur = this.elements[0].cur;

            pNode.cur = nodeCur; // 跳过node节点
        }

        return this;
    }

    @Override
    public boolean isEmpty() {
        return this.size() == 0;
    }

    @Override
    public void emptyList() {
        // 如果已经是空表就不再继续了
        if (isEmpty()) {
            return;
        }

        int lastCur = this.elements.length - 1;
        // 将已经使用的数据节点清空并找到数据节点最后一个
        Node<E> node = this.elements[lastCur];// 最后一个节点
        for (;node.cur != 0;) {
            node = this.elements[node.cur];
            node.data = null; // 清空(也可以后期自动覆盖)
        }
        // 将数据节点串到备用链表中去
        node.cur = this.elements[0].cur;
        // 将之前的数据节点的第一个作为新的备用链表的第一个。
        this.elements[0].cur = this.elements[lastCur].cur;
        // 将当前数据节点置为0
        this.elements[lastCur].cur = 0;
    }

    @Override
    public int locateElem(E elem) {
        Node<E> node = this.elements[this.elements.length - 1];
        int i = -1;
        while(node.cur != 0) {
            i++;
            node = this.elements[node.cur];
            if (node.data == elem) {
                return i;
            }
        }
        return -1;
    }

    @Override
    public Object[] toArray() {
        int size = this.size();
        Object[] arr = new Object[size];

        Node<E> node = this.elements[this.elements.length - 1];
        for (int i = 0; node.cur != 0 ;) {
            node = this.elements[node.cur];
            arr[i++] = node.data;
        }

        return arr;
    }

    @Override
    public <T> T[] toArray(T[] a) {
        int size = this.size();
        if (a.length < size)
            a = (T[])java.lang.reflect.Array.newInstance(a.getClass().getComponentType(), size);

        Object[] arr = a;

        Node<E> node = this.elements[this.elements.length - 1];
        for (int i = 0; node.cur != 0 ;) {
            node = this.elements[node.cur];
            arr[i++] = node.data;
        }

        return a;
    }

    @Override
    public int size() {
        int i = 0;
        Node<E> node = this.elements[this.elements.length - 1];
        while (node.cur != 0) {
            i ++;
            node = this.elements[node.cur];
        }
        return i;
    }

    @Override
    public String toString() {
        return "StaticLinkedList{" +
                "elements=" + Arrays.toString(toArray()) +
                '}';
    }

    private static class Node<E> implements Serializable {
        private E data;
        private int cur;

        public Node() {
        }

        public Node(E data) {
            this.data = data;
        }

        public E getData() {
            return data;
        }

        public void setData(E data) {
            this.data = data;
        }

        public int getCur() {
            return cur;
        }

        public void setCur(int cur) {
            this.cur = cur;
        }

        @Override
        public String toString() {
            return "Node{" +
                    "data=" + data +
                    '}';
        }
    }
}
```

测试代码：

```java
@Test
    public void StaticLinkedList() {
        List<Integer> list = new StaticLinkedList<Integer>();
        System.out.println("插入测试");
        list.insert(4).insert(9).insert(1).insert(15).insert(10);
        System.out.println("打印");
        System.out.println(list.toString());

        System.out.println("insertAt");
        list.insertAt(0, 9999);
        list.insertAt(2, 9999);
        list.insertAt(2, 9999);
        list.insertAt(2, 9991);
        list.insertAt(2, 9991);
        list.insertAt(2, 9991);
        list.insertAt(list.size(), 6666);
        System.out.println(list.toString());

        System.out.println("清空测试");
        list.emptyList();
        System.out.println(list);

        boolean isEmpty = list.isEmpty();
        System.out.println("isEmpty:" + isEmpty);

        System.out.println("清空后数据重新新增测试");
        list.insert(10).insert(100).insert(44).insert(5).insert(58);
        System.out.println(list);
        System.out.println("size:" +list.size());

        System.out.println("to array测试");
        Object[] objects = list.toArray();
        System.out.println("objects:" + Arrays.toString(objects));

        System.out.println("to array测试");
        Integer[] objectArr = list.toArray(new Integer[2]);
        System.out.println("objectArr:" + Arrays.toString(objectArr));

        System.out.println("定位元素测试");
        int pos = list.locateElem(5);
        System.out.println("pos:" + pos);
        pos = list.locateElem(99999);
        System.out.println("pos:" + pos);

        System.out.println("getElem测试");
        Integer elem = list.getElem(2);
        System.out.println(elem);

        System.out.println("delete测试");
        System.out.println(list);
        list.delete(44);
        System.out.println(list);
        list.delete(10);
        System.out.println(list);
        list.delete(58);
//        list.delete(99);
        System.out.println(list);
    }
```

## 腾讯面试题

1. 快速找到未知长度单链表的中间节点。

   **普通解答方法：**

   ​		首先遍历一遍单链表以确定单链表的长度L。然后再次从头节点触发循环L/2次找到单链表的中间节点。

   ​	算法复杂度为：O(L+L/2)=O(3L/2)  这里由于需要比较精确的比较，所以不对算法复杂度求简。

   **高级解答方法：**

   ​		**快慢指针！**

   ​		利用快慢指针原理：设置两个指针*search、\*mid都指向单链表的头结点。其中\*search指向末尾节点的时候，mid正好就在中间了。这就是标尺的思想。

