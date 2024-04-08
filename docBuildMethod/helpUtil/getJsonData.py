import json
import sqlite3

class Category:
    def __init__(self, id, name, level=1, parent_id=None):
        self.id = id
        self.name = name
        self.level = level
        self.parent_id = parent_id
        self.items:list[Category] = []

# Custom JSON encoder for the Category class
class CategoryEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Category):
            return obj.__dict__
        return json.JSONEncoder.default(self, obj)

class Document:
    def __init__(self, id, title, href, is_private=0, category:str=None):
        self.id = id
        self.title = title
        self.href = href
        self.is_private = is_private
        self.category = category

    def to_json(self):
        categorys = self.category.split(",")

        return f"""{{ 
            "id": {self.id},
            "title": "{self.title}",
            "href": "{self.href}",
            "is_private": {"true" if self.is_private == 1 else "false"}, 
            "category": {json.dumps(categorys, ensure_ascii = False)}
         }}"""



def gen_doc_json():
    conn = sqlite3.connect("doc.db")
    cursor = conn.cursor()

    # 从documents表中查询数据
    cursor.execute('SELECT * FROM documents')
    data = cursor.fetchall()

    def to_document(row):
        return Document(row[0], row[1], row[2], row[3], row[4])
    # 打印数据
    documents:list[str] = [to_document(row).to_json() for row in data]
    json_data = '[' + ','.join(documents) + ']'

    with open('doc_json_data.json', 'w') as f:
        f.write(json_data)

    # 关闭cursor和连接
    cursor.close()
    conn.close()

def gen_category_json():
    conn = sqlite3.connect("doc.db")
    cursor = conn.cursor()

    # 从documents表中查询数据
    cursor.execute('SELECT * FROM categorys')
    data = cursor.fetchall()

    def to_Categroy(row):
        return Category(row[0], row[1], row[2], row[3])

    categroys:list[Category] = [to_Categroy(row) for row in data]
    level_1_cates:list[Category] = [cate for cate in categroys if cate.level == 1]
    level_1_cate_dict = {doc.id : doc for doc in level_1_cates}

    level_2_cates: list[Category] = [cate for cate in categroys if cate.level == 2]
    for cate in level_2_cates:
        level_1_cate_dict[cate.parent_id].items.append(cate)

    json_data = json.dumps(level_1_cates, ensure_ascii=False, indent=4, cls=CategoryEncoder)

    with open('category_json_data.json', 'w') as f:
        f.write(json_data)

    # 关闭cursor和连接
    cursor.close()
    conn.close()


if __name__ == '__main__':
    # 生成文档json
    gen_doc_json()
    # 生成类别json数据
    gen_category_json()