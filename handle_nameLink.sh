#!/bin/bash
# ======================= 用于一键处理index.html文件中nameLink替换地址的脚本=========

files=`find . -name index.html`
for file in $files; do
	echo $file
	sed -i "s#nameLink: '\/'#nameLink: '\.\.\/IndexBlog\/'#" $file
	cat $file | grep nameLink
done
