# 移除代码注释

## 题目

​	给一个可运行的java源代码文件给你，能够通过程序实现将代码中的注释全部删除，然后将结果输出到结果文件中仍然可以运行。

示例输入文件Test.txt（内容是可以运行的java文件）：

```java

/*
        Test /* //
        //
        *|/
 */
public /*Test*/ class Test { // 这是注释/**
    public static void main(String[] args) {
        System.out.println/*haha*/("//12/**31**/23");
//        System.out.println/*神奇*/("//12/**31**/23");
    }
}
```

> ​	这个题目其实很简单，当时由于将这个问题想复杂了，时隔两年再想起了这个题目，于是再次实现一下。

## 解题基本思路：

单行注释 //

> ​	分析：从单行注释开始到该行结束\n都是注释内容。

多行注释/* 内容 */

> ​	分析：从/* 到结束 */ 都是注释内容。

程序字符串

> ​	分析：java中的字符串中出现单行或多行注释的符号都不是注释，所以"文本内容"不是注释内容。



## 我的解决方案

```java
import java.io.*;

public class CodeCommentRemove {
    public static void main(String[] args) {
        // 获取所有文件内容
        StringBuilder fileLines = readLines("E:\\1_WORK\\csii\\3_projects\\deepwater\\code\\DWD_BACK\\generate\\src\\main\\java\\Test.txt");
        // 移除代码注释
        removeCodeComment(fileLines);
        // 将处理结果输出到文件中
        System.out.println(fileLines);
        writeCodeLinesToFile(fileLines, "E:\\1_WORK\\csii\\3_projects\\deepwater\\code\\DWD_BACK\\generate\\src\\main\\java\\Test.java");
    }

	// 移除代码注释
    private static void removeCodeComment(StringBuilder fileLines) {
        int i = 0;
        while (i < fileLines.length()) {
            char ch = fileLines.charAt(i);
            if ('"' == ch) {
                // 防止字符串内容中出现注释字符
                // 找到字符串结尾
                while (fileLines.charAt(++i) != '"');
                i++;
            } else if ('/' == ch) {
                char nextChar = fileLines.charAt(i + 1);
                if ('/' == nextChar) {
                    // 单行注释
                    int j = i + 2;
                    // 找到单行注释结尾
                    while (fileLines.charAt(j++) != '\n' && j < fileLines.length());
                    fileLines.delete(i, j - 1);
                } else if ('*' == nextChar) {
                    int j = i + 3;
                    // 找到多行注释结尾
                    for (; j < fileLines.length(); j ++) {
                        if (fileLines.charAt(j - 1) == '*' && fileLines.charAt(j) == '/') {
                            break;
                        }
                    }
                    fileLines.delete(i, j + 1);
                } else {
                    i ++;
                }
            } else {
                i++;
            }
        }
    }

    // 将处理结果输出到文件中
    private static void writeCodeLinesToFile(StringBuilder fileLines, String fileName) {
        BufferedWriter bw = null;
        try {
            bw = new BufferedWriter(new FileWriter(fileName));
            bw.write(fileLines.toString());
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (null != bw) {
                try {
                    bw.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    // 获取所有文件内容
    public static StringBuilder readLines (String file){
        StringBuilder sb = new StringBuilder();

        BufferedReader br = null;
        try {
            FileInputStream fis = new FileInputStream(new File(file));
            BufferedInputStream bis = new BufferedInputStream(fis);
            br = new BufferedReader(new InputStreamReader(bis, "UTF-8"));
//        BufferedReader br = new BufferedReader(new FileReader(file));
            String line = null;
            while ((line = br.readLine()) != null) {
                sb.append(line);
                sb.append('\n');
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (br != null) {
                try {
                    br.close();
                } catch (IOException e1) {
                    e1.printStackTrace();
                }
            }
        }

        return sb;
    }
}
```

