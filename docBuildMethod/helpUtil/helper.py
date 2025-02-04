import os
import sqlite3
import subprocess
import zipfile
import getJsonData


def check_winrar_installed(cmd):
    # 使用 where 命令（Windows）或 which 命令（Linux/Mac）检查是否安装 WinRAR
    command = 'where ' + cmd  # Windows
    # command = 'which winrar'  # Linux/Mac

    try:
        subprocess.run(command, shell=True, check=True)
        return True
    except subprocess.CalledProcessError:
        return False


def decompress_file(input_file, output_dir):
    if check_winrar_installed("winrar"):
        # 如果安装了 WinRAR，则使用 WinRAR 解压缩
        winrar_command = ['winrar', 'x', input_file, output_dir]
        subprocess.run(winrar_command, check=True)
        print('使用 WinRAR 解压缩完成')
    elif check_winrar_installed("bz"):
        # 如果未安装 WinRAR，则使用 BandZip 解压缩
        bz_command = ['bz', 'x', input_file, output_dir]
        subprocess.run(bz_command, check=True)
        print('使用 BandZip 解压缩完成')
    else:
        with zipfile.ZipFile(input_file, 'r') as zip_ref:
            zip_ref.extractall(output_dir)
        print('使用 zipfile 解压缩完成')


def addDbDoc(doc_cn_name: str, doc_name: str, category=''):
    """
    在数据库中新增一个文档
    :param category:
    :param doc_cn_name: 文档中文名称
    :param doc_name: 文档英文名称
    :return:
    """
    conn = sqlite3.connect("doc.db")
    # 创建一个游标对象
    cursor = conn.cursor()

    category = ",".join(category.strip().split(" "))

    doc = [doc_cn_name, f'../{doc_name}', category, 0]
    cursor.execute("INSERT INTO documents (title, href, category, is_private) VALUES (?, ?, ?, ?)", doc)

    # 关闭cursor和连接
    conn.commit()
    cursor.close()
    conn.close()


def add_db_category(parent_category: str, sub_category: str):
    conn = sqlite3.connect("doc.db")
    # 创建一个游标对象
    cursor = conn.cursor()

    # 1.查询是否存在父类别
    cursor.execute('SELECT id FROM categorys where name=?', (parent_category,))
    parent_db_categorys = cursor.fetchall()
    p_category_id = None
    if len(parent_db_categorys) == 0:
        # 2.父类别不存在进行新增
        print(f"系统无【{parent_category}】父类别，进行新增父类别")
        cursor.execute("INSERT INTO categorys (name, level, parent_id) VALUES (?, ?, ?)", (sub_category, 1, None))
        p_category_id = cursor.lastrowid
        print("父类别创建成功！")
    else:
        p_category_id = parent_db_categorys[0][0]

    # 3.检查子类别是否存在
    cursor.execute('SELECT id FROM categorys where name=? and parent_id=?', (sub_category, p_category_id))
    sub_db_categorys = cursor.fetchall()
    if len(sub_db_categorys) == 0:
        # 4.子类别不存在进行新增
        new_category = (sub_category, 2, p_category_id)
        cursor.execute("INSERT INTO categorys (name, level, parent_id) VALUES (?, ?, ?)", new_category)
        print("子类别创建成功！")
    else:
        print("系统已经存在该父子类别!")

    # 关闭cursor和连接
    conn.commit()
    cursor.close()
    conn.close()


def reGenIndexJsFile():
    """
    重新生成index.js文件
    :return:
    """
    doc_json = getJsonData.gen_doc_json()
    category_json = getJsonData.gen_category_json()
    # 重新生成json数据，然后将json数据拼接到index.js代码中去，通过下面的特殊分解符来判断。
    # // >>>>>>>>>!@#$%^&*!<<<<<<<<<
    isCollect = False

    result_js_data = f"""
// 所有文档列表
let docs = {doc_json};
// 所有文档分类
let docCategory = {category_json}; 

// 特殊定位符，前面是数据，后面是代码，python按最新数据重新拼接
// >>>>>>>>>!@#$%^&*!<<<<<<<<<
    """
    with open('../../IndexBlog/index.js', 'r', encoding="utf-8") as f:
        for line in f.readlines():
            if isCollect:
                result_js_data += line
            elif line.startswith("// >>>>>>>>>!@#$%^&*!<<<<<<<<<"):
                isCollect = True

    # print(result_js_data)
    with open('../../IndexBlog/index.js', 'w', encoding="utf-8") as f:
        f.writelines(result_js_data)
    print("重新生成Index.js成功")


def print_category():
    conn = sqlite3.connect("doc.db")
    # 创建一个游标对象
    cursor = conn.cursor()

    # 从documents表中查询数据
    cursor.execute('SELECT id, name, level, parent_id FROM categorys')
    data = cursor.fetchall()
    # 关闭cursor和连接
    conn.commit()
    cursor.close()
    conn.close()

    def to_Categroy(row):
        return getJsonData.Category(row[0], row[1], row[2], row[3])

    categroys: list[getJsonData.Category] = [to_Categroy(row) for row in data]
    level_1_cates: list[getJsonData.Category] = [cate for cate in categroys if cate.level == 1]
    level_1_cate_dict = {doc.id: doc for doc in level_1_cates}

    level_2_cates: list[getJsonData.Category] = [cate for cate in categroys if cate.level == 2]
    for cate in level_2_cates:
        level_1_cate_dict[cate.parent_id].items.append(cate)
    print("目前已经存在的类别如下:")
    for cate_1 in level_1_cates:
        print("- " + cate_1.title)
        for cate_12 in cate_1.items:
            print("\t- " + cate_12.title)


def create_doc():
    doc_cn_name = input("请输入文档中文名称:")
    new_doc_name = input("请输入文档英文名称:")
    print_category()
    cate_name = input("请输入分类信息（多个空格分隔）:")
    # 数据库加一条数据
    addDbDoc(doc_cn_name, new_doc_name, cate_name)
    # 重新生成index.js文件
    reGenIndexJsFile()
    # 解压缩模板文件
    input_file = './docBuildMethodTemplate.zip'
    output_dir = f'../../{new_doc_name}/'
    os.mkdir(output_dir)
    decompress_file(input_file, output_dir)

    print("文档创建成功！")
    
    # TODO:: 将index.js、新文档、doc.db、doc_json_data.json添加到git待提交中(不用做推送，编辑完毕后一起推送)


def create_category():
    category_cn_name = input("请输入类别名称(eg:技术/JAVA):")
    splits = category_cn_name.split("/")
    if len(splits) != 2 or len(splits[0]) == 0 or len(splits[1]) == 0:
        print("输入无效！")
        return
    # 新增类别
    add_db_category(splits[0], splits[1])


def print_docs():
    pass


if __name__ == '__main__':
    while True:
        opt = input("""
文档管理功能:
    1.创建文档
    2.创建文档类别
    3.查看文档列表
    4.查看类别信息
    5.重新生成Index.js
    q.退出
请输入你的选项""")
        if opt == '1':
            # 创建文档的代码逻辑
            create_doc()
        elif opt == '2':
            # 创建文档类别的代码逻辑
            create_category()
        elif opt == '3':
            # 查看文档列表的代码逻辑
            print_docs()
        elif opt == '4':
            # 查看类别信息的代码逻辑
            print_category()
        elif opt == '5':
            # 重新生成Index.js的代码逻辑
            reGenIndexJsFile()
        elif opt.lower() == 'q':
            break
        else:
            print("无效的选项，请重新输入")
