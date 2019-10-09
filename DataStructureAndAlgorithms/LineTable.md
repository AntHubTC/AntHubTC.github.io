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



#### 头插法和尾插法

​	头插法建立单链表的算法虽然简单，但生成的链表中结点的次序和输入数据的顺序不一致。若希望两者次序一致，可采用尾插法。尾插法是将新结点插入到当前链表的表尾上，为此必须增加一个尾指针r,使其始终指向当前链表的尾结点

#### 腾讯面试题

1. 快速找到未知长度单链表的中间节点。

   **普通解答方法：**

   ​		首先遍历一遍单链表以确定单链表的长度L。然后再次从头节点触发循环L/2次找到单链表的中间节点。

   ​	算法复杂度为：O(L+L/2)=O(3L/2)  这里由于需要比较精确的比较，所以不对算法复杂度求简。

   **高级解答方法：**

   ​		**快慢指针！**

   ​		利用快慢指针原理：设置两个指针*search、\*mid都指向单链表的头结点。其中\*search指向末尾节点的时候，mid正好就在中间了。这就是标尺的思想。



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

## 循环链表

### 	介绍

​	将单链表中终端节点的指针端由空指针改为指向头结点，使整个单链表形成一个环，这种头尾相接的单链表成为单循环链表，简称循环链表。

![1570327968372](.\img\1570327968372.png)

> 注：这里并不是说循环链表一定要有头节点。

​	其实循环链表和单链表的主要差异就在于循环的判断空链表的条件上，原来判断head->next是否为null，现在则是head->next是否等于head。

​	终端节点用尾指针rear指示，则查找终端节点是O(1)，而开始节点是rear->next->next，当然也是O(1)。

### 约瑟夫问题

​	据说著名犹太历史学家Josephus有过以下的故事：在罗马人占领乔塔帕特后，39个犹太人与Josephus及他的朋友躲到一个洞中，39个犹太人决定宁愿死也不要被敌人抓到，于是决定了一个自杀方式，41个人排成一个圆圈，由第1个人开始报数，每报数到第3人该人就必须自杀，然后再由下一个重新报数，直到所有人都自杀身亡为止。然而Josephuse和他的朋友并不想遵从，Josephus要他的朋友先假装遵从，他将朋友与自己安排在第16个与第31个位置，于是逃过了这场死亡游戏。

#### 循环链表求解

实现代码：

```java
package com.tc.dsa.line.list.test;

/**
 * 约瑟夫问题
 */
public class JosephusIssue {
    private static class Node<E> {
        E data;
        Node<E> next;

        public Node() {
        }

        public Node(E data) {
            this.data = data;
        }
    }

    /**
     * 创建单向循环链表
     * @param num 创建的节点数量
     * @return
     */
    public static Node createCycleLinkTable(int num) {
        if (num < 0 || num > 9999999) {
            throw new IndexOutOfBoundsException();
        }
        Node head, node;// 头节点, 临时节点
        head = node = new Node();
        if (num != 0) {
            for (int i = 1; i <= num; i++) {
                node.next = new Node(i);
                node = node.next;
            }
            // 构成一个环
            node.next = head.next;
        }

        return head.next;
    }

    public static void printCycleLinkTable(Node cltNode) {
        Node node = cltNode;
        do {
            System.out.print(node.data + " ");
            node = node.next;
        } while (node != cltNode);
        System.out.println( " => 1...");
    }

    public static void selfKill(Node cltNode,int totalPerson, int nextKillPersion) {
        Node node = cltNode;
        nextKillPersion = totalPerson % nextKillPersion; // 这个是
        do {
            for (int i = 1; i < nextKillPersion; i ++) {
                node = node.next;
            }
            System.out.print(node.next.data + " ");
            node.next = node.next.next;
            node = node.next;
        } while (node.next != node);
        System.out.println(node.data);
    }

    public static void main(String[] args) {
        int totalPerson = 41; // 41个人
        int nextKillPersion = 3;// 往下数第3个自杀
        Node headNode = createCycleLinkTable(totalPerson);
        printCycleLinkTable(headNode);
        System.out.println("自杀顺序:");
        selfKill(headNode, totalPerson, nextKillPersion);
    }
}
```

输出：

```
1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41  => 1...
自杀顺序：
3 6 9 12 15 18 21 24 27 30 33 36 39 1 5 10 14 19 23 28 32 37 41 7 13 20 26 34 40 8 17 29 38 11 25 2 22 4 35 16 31
```

#### 递归求解

假设下标从0开始，0，1，2 .. m-1共m个人，从1开始报数，报到k则此人从环出退出，问最后剩下的一个人的编号是多少？

现在假设m=10

0 1 2 3  4 5 6 7 8 9    k=3

第一个人出列后的序列为：

0 1    3 4 5 6 7 8 9

即:

3 4 5 6 7 8 9 0 1       <-=> AA

我们把该式转化为:

0 1 2 3 4 5 6 7 8       <==> BB

则你会发现: AA = ((BB) + 3) % 10

也就是说，我们求出9个人中第9次出环的编号，最后进行上面的转换就能得到10个人第10次出环的编号了 

设f(m,k,i)为m个人的环，报数为k，第i个人出环的编号，则f(10,3,10)是我们要的结果

当i=1时，  f(m,k,i) = (m+k-1)%m        为什么要减去1,因为序号是从0开始的

当i!=1时，  f(m,k,i)= (f(m-1,k,i-1)+k)%m     由上一次的m,k,i推导出这一次

代码：

```java
package com.tc.dsa.line.list.test;

/**
 * 约瑟夫问题
 * 递归解决方案
 */
public class JosephusIssue2 {

    public static int josephusIssue(
            int m, // 当前总人数
            int k, // 多少次杀一个
            int i // 当前第几次
    ) {
        if (i == 1) {
            return (m + k -1) % m;
        } else {
            return (josephusIssue(m - 1,k, i - 1) + k) % m;
        }
    }

    public static void main(String[] args) {
        int m = 41, // 总次数
            k = 3; // 3次杀一个
        for (int i = 1; i <= m; i++) { // i表示第i次杀的是那个
            System.out.print(josephusIssue(m, k, i) + " ");
        }
    }
}
```

输出：

```
2 5 8 11 14 17 20 23 26 29 32 35 38 0 4 9 13 18 22 27 31 36 40 6 12 19 25 33 39 7 16 28 37 10 24 1 21 3 34 15 30
```

### 思考问题

1. 如何连接两个循环链表（尾指针）。

   ![1570413172659](.\img\1570413172659.png)

   p = rear1.next;

   rear1.next = rear2.next.next;

   free(rear2.next);

   rear2.next = p;

   

2. 判断单链表中是否有环。

有环的定义是，链表的节点指向了链表中的某个节点。比如有可能是下面这种情况：

![1570413383122](.\img\1570413383122.png)

- 方法一

  使用p、q两个指针，p总是向前走，但q每次都从头开始走，对于每个节点，看p走的步数是否和q一样。如图，当p从6走到3时，用了6步，此时若q从head出发，则只需两步就到3,因而步数不等，出现矛盾，存在环。

- 方法二(推荐，比方法一好)

  使用p、q两个指针，p每次向前走一步，q每次向前走两步，若在某个时候p == q，则存在环（快慢指针）。



### 魔术师发牌问题

​	问题描述：魔术师发牌问题的简介：一位魔术师掏出一叠扑克牌，魔术师取出其中13张黑桃，洗好后，把牌面朝下。说：“我不看牌，只数一数就能知道每张牌是什么？”魔术师口中念一，将第一张牌翻过来看正好是A；魔术师将黑桃A放到桌上，继续数手里的余牌，第二次数1，2，将第一张牌放到这叠牌的下面，将第二张牌翻开，正好是黑桃2，也把它放在桌子上。第三次数1，2，3，前面二张牌放到这叠牌的下面，取出第三张牌，正好是黑桃3，这样依次将13张牌翻出，全部都准确无误。求解：魔术师手中牌的原始顺序是什么样子的？

#### 数组求解

```java
public class MagicCard {
    public static void main(String[] args) {
        int[] cards = new int[13]; // 数组初始为0 // 长度为13的数组用来存放13张牌，有先后顺序，我们将每一个位置称为卡槽
        int cur = -1; // 当前数组指向游标位置
        for (int i = 1; i <= cards.length; i++) {
            for (int step = 1; step <= i; step ++) { // step是走的步数，走的步数是当前卡片数字减1。
                cur = ++cur % cards.length; // 逻辑循环数组，游标在0到cards.length-1。
                if (cards[cur] != 0) { // 当前数数的目标位置
                    step --; // 如果游标位置有存放卡片，那么这个步骤不算数, 下次循环游标跳过。
                    continue;
                }
                // i == step 表示步数已经走完了
                // cards[cur] == 0 表示该卡槽没有卡片在（已经发出去的卡片位置），如果有，卡片肯定不能放这里，要继续寻找下一个卡槽。
                if (i == step && cards[cur] == 0) {
                    cards[cur] = i;// 将卡片放入卡槽
                }
            }
        }
        // 输出卡片最初的顺序
        for (int i = 0; i < cards.length; i++) {
            System.out.print(cards[i] + " ");
        }
        System.out.println();
        // 牌序: 1 8 2 5 10 3 12 11 9 4 7 6 13
    }
}
```

#### 循环链表求解

```java
package com.tc.dsa.line.list.test;

/**
 * 魔术师发牌问题：
 *      （单）循环链表实现方式
 */
public class MagicCardCycleList {

    public static class Node<E> {
        E data;
        Node<E> next;

        public Node() {
        }

        public Node(E data) {
            this.data = data;
        }
    }

    /**
     * 创建循环链表
     *
     * @param len 链表长度
     * @return
     */
    public static <E> Node<E> createCycleLinkList(int len) {
        if (len < 0) { // 考试要注意处理边界问题
            throw new RuntimeException("循环链表节点数目无效!");
        }
        Node<E> head = new Node<E>();
        Node tNode = head;
        for (int i = 0; i < len; i++) {
            tNode.next = new Node(0);
            tNode = tNode.next;
        }
        if (tNode != head) {
            tNode.next = head.next; // 首尾相接
        }
        return head.next;
    }


    public static void main(String[] args) {
        int cardNum = 13; // 卡片总数量
        Node<Integer> cardLink = MagicCardCycleList.<Integer>createCycleLinkList(cardNum); // 创建循环链表
        Node<Integer> tempCardLink = cardLink;
        tempCardLink.data = 1;// 第一张牌
        for (int i = 2; i <= cardNum; i++) { // 这里应该从2开始走，因为第一张牌已经放到卡槽中了
            for (int step = 0; step < i; step++) { // 走step步到期望的目标卡槽
                tempCardLink = tempCardLink.next; // 前往下一个卡槽
                if (tempCardLink.data != 0) {
                    step --; // 如果该卡槽中有卡片，该卡槽不记录到步数中
                }
            }
            tempCardLink.data = i;
        }
        // 临时引用重置到头部
        tempCardLink = cardLink;
        do { // 遍历得出卡槽链中得到的卡片顺序
            System.out.print(tempCardLink.data + " ");
            tempCardLink = tempCardLink.next;
        } while (tempCardLink != cardLink);
        System.out.println();
    }
}

```

### 拉丁方阵问题

拉丁方阵是一种n*n的方阵，方阵中洽有n中不同的元素，每种元素恰有n个，并且每种元素在一行和一列中恰好出现一次。著名数学家和物理学家欧拉使用拉丁字母来作为拉丁方阵里元素的符号，拉丁方阵因此而得名。

例如下面的3*3的拉丁方阵：

| 1    | 2    | 3    |
| ---- | ---- | ---- |
| 2    | 3    | 1    |
| 3    | 1    | 2    |

#### 普通/数组求解

```java
package com.tc.dsa.line.list.test;

/**
 * 拉丁方阵问题
 */
public class LatinSquare {
    public static void main(String[] args) {
        int num = 4; // num*num的方阵， num表示维度数
//        int result[][] = new int[num][num]; // 当然也可以将结果存放到数组中
        for (int i = 0; i < num; i++) {
            int x = i; // 基于基础i进行加数
            for (int j = 0; j < num; j++) {
                // 如果不是用的有序数字，我们可以将x和其它符号映射起来达到不同符号排列符合拉丁方阵
                System.out.print((x + 1) + " ");
                x = ++x % num;
            }
            System.out.println();
        }
    }
}
```

输出：

> 1 2 3 4 
> 2 3 4 1 
> 3 4 1 2 
> 4 1 2 3 

#### 循环链表求解

思路：

1. 用循环链表来接受n个不同的数据。
2. 矩阵第i行数据，是从循环链表的第i个位置的数据遍历完整个循环链表 将其数据取出。

代码：

```java
package com.tc.dsa.line.list.test;

/**
 * 拉丁方阵
 *       链表方法求解
 */
public class LatinSquareCycleList {
    public static class Node<E> {
        E data;
        Node<E> next;

        public Node() {
        }

        public Node(E data) {
            this.data = data;
        }
    }

    /**
     * 创建循环链表
     *
     * @param len 链表长度
     * @return
     */
    public static <E> Node<E> createCycleLinkList(int len) {
        if (len < 0) { // 考试要注意处理边界问题
            throw new RuntimeException("循环链表节点数目无效!");
        }
        Node<E> head = new Node<E>();
        Node tNode = head;
        for (int i = 0; i < len; i++) {
            tNode.next = new Node(0);
            tNode = tNode.next;
        }
        if (tNode != head) {
            tNode.next = head.next; // 首尾相接
        }
        return head.next;
    }

    public static void main(String[] args) {
        char[] uniqueChar = new char[]{'!','@','#','$','%','^','&'};
        // 创建一个空链表
        Node<String> linkList = LatinSquareCycleList.<String>createCycleLinkList(uniqueChar.length);
        Node<String> tempList = linkList;
        // 链表赋值
        for (char ch : uniqueChar) {
            tempList.data = String.valueOf(ch);
            tempList = tempList.next;
        }
        // 经过上面的赋值，这个时候tempList走到是链表的结尾，下一个next就是头节点(其实可以不用考虑目前哪里是头节点，该问题从哪里开始结果都是拉丁方阵)
        for (int i = 0; i < uniqueChar.length; i++) {
            Node<String> node = tempList = tempList.next; // tempList走往下一个节点
            do {
                System.out.print(node.data + " ");
                node = node.next;
            } while (node != tempList); // 链表走一圈
            System.out.println();
        }
    }
}
```

输出：

> @ # $ % ^ & ! 
> \# $ % ^ & ! @ 
> $ % ^ & ! @ # 
> % ^ & ! @ # $ 
> ^ & ! @ # $ % 
> & ! @ # $ % ^ 
> ! @ # $ % ^ & 

 扩展知识：拉丁矩阵中进行行交换或者列交换，结果还是拉丁矩阵。

## 双向链表

​	双向链表也叫双链表，是链表的一种，它的每个数据结点中都有两个指针，分别指向直接后继和直接前驱。所以，从双向链表中的任意一个结点开始，都可以很方便地访问它的前驱结点和后继结点。

### 节点数据结构

```c
typedef struct DualNode
{
    ElemType data;
    struct DualNode *prior; // 前驱节点
    struct DualNode *next; // 后继节点
} DualNode, *DuLinkList;
```

![img](.\img\922236-20171220110004678-643077430.png)

![img](.\img\922236-20171220110011240-853997173.png)

### 双向链表示例代码

```java
package com.tc.dsa.line.list.test;

/**
 *  双向链表
 */
public class DoublyLinkList {
    public static class Node<E> {
        E data;
        Node<E> prior;
        Node<E> next;

        public Node() {
        }

        public Node(E data) {
            this.data = data;
        }
    }

    public static Node<String> initList () {
        Node<String> head = new Node<String>();
        Node<String> pNode = head;
        for (int i = 0; i < 26; i++) {
            Node<String> node = new Node<String>(String.valueOf((char)('A' + i)));
            node.next = null;
            node.prior = pNode;
            pNode.next = node;
            pNode = node; // 父节点前往新的节点
        }

        return head.next;
    }

    /**
     * 为链表中的节点链接数字，相当于在做双向链表的新增操作
     * @param firstNode
     * @return
     */
    public static Node<String> connectNumber(Node<String> firstNode) {
        Node<String> pNode = firstNode;
        while (pNode != null) {
            char ch = pNode.data.charAt(0);
            int num = ch - 'A' + 1;
            Node<String> newNode = new Node<String>(String.valueOf(num));
            // 双向链表的插入关键步骤（有些顺序很重要）
            newNode.prior = pNode;
            newNode.next = pNode.next;
            if (pNode.next != null) {
                pNode.next.prior =  newNode;
            }
            pNode.next = newNode;

            // 临时指针父节点指向下一个字母节点
            pNode = newNode.next;
        }

        return firstNode;
    }

    /**
     * 断开链表中的数字节点，相当于在做双向链表的删除操作
     * @param firstNode
     * @return
     */
    public static Node<String> disConnectNumber(Node<String> firstNode) {
        Node<String> pNode = firstNode;
        while (pNode != null) {
            // 提示: 现在的pNode是字母节点，也可以走到数字节点再执行删除，或许看着更简单些
            if (pNode.next.next != null) {
                // 下下个节点的前驱指向当前节点
                pNode.next.next.prior = pNode;
            }
            // 当前节点的后继前往下下节点
            pNode.next = pNode.next.next;
            // 前往下一个节点
            pNode = pNode.next;
        }
        return firstNode;
    }

    // 打印双向链表
    public static void printLink(Node node) {
        Node<String> tempNode = node;
        while (tempNode != null) {
            System.out.print(tempNode.data + " ");
            tempNode = tempNode.next;
        }
        System.out.println();
    }

    public static void main(String[] args) {
        // 初始化链表，在链表中放了26个英文字母
        Node<String> node = initList();
        printLink(node);

        // 问题： 为每一个字母后面链接一个数字如 A=>1=>B=>2=>C=>3...
        connectNumber(node);
        printLink(node);

        // 问题： 去掉链表中含有的数字
        disConnectNumber(node);
        printLink(node);
    }
}
```



## 双向循环链表

### 介绍

![img](.\img\632293-20170306150003297-951612143.png)



![img](.\img\632293-20170306150039609-1719195275.png)



![img](.\img\632293-20170306150105453-2068434988.png)

### 凯撒密码问题实战

- 要求实现用户输入一个数使得26个字母的排列发生变化，例如用户输入3，输出结果：
- DEFGHIJKLMNOPQRSTUVWXYZABC
- 同时需要支持负数，例如用户输入-3，输出结果：
- XYZABCDEFGHIJKLMNOPQRSTUVW

```java
package com.tc.dsa.line.list.issue;

import java.util.Scanner;

/**
 * 类似凯撒密码的程序
 *      双向循环链表
 */
public class Caesar {
    public static class Node<E> {
        E data;
        Node<E> prior;
        Node<E> next;

        public Node() {
        }

        public Node(E data) {
            this.data = data;
        }
    }

    public static Node<String> initList () {
        Node<String> head = new Node<String>();
        Node<String> pNode = head;
        for (int i = 0; i < 26; i++) {
            Node<String> node = new Node<String>(String.valueOf((char)('A' + i)));
            node.next = null;
            node.prior = pNode;
            pNode.next = node;
            pNode = node; // 父节点前往新的节点
        }

        pNode.next = head.next;
        head.next.prior = pNode;

        return head.next;
    }

    private static void print(Node node) {
        Node<String> tNode = node; // 移动后的首节点
        do {
            System.out.print(node.data + " ");
            node = node.next;
        } while (node != tNode);
        System.out.println();
    }

    public static void main(String[] args) {
        // 初始化双向循环链表
        Node<String> nodeHead = initList();
        Node<String> tNode = nodeHead;
        System.out.println("原始顺序：");
        print(tNode);

        System.out.print("请输入移位数字:");
        Scanner scanner = new Scanner(System.in);
        int num = scanner.nextInt();
        num = num % 24; // 24是一圈
        for (int i = 0; i < Math.abs(num); i++) {
            tNode = num > 0 ? tNode.next: tNode.prior;
        }

        System.out.println("结果输出:");
        print(tNode);
    }
}
```

输出结果：

```
原始顺序：
A B C D E F G H I J K L M N O P Q R S T U V W X Y Z 
请输入移位数字:-3
结果输出:
X Y Z A B C D E F G H I J K L M N O P Q R S T U V W 
```

