# WorkBuddy实战--百度地址转坐标Skill



## 流程

SKILL -> scripts:baidu_geo.py -> 后端服务 -> [百度地图api](https://lbsyun.baidu.com/docs/webapi?title=placev3/guide/webservice-placeapiV3/interfaceDocumentV3#%E8%A1%8C%E6%94%BF%E5%8C%BA%E5%88%92%E5%8C%BA%E5%9F%9F%E6%A3%80%E7%B4%A2)

## SKILL.md

~~~markdown
---
name: baidu-address-to-coordinates
author: anthubtc
description: "This skill should be used when the user wants to convert natural language addresses (e.g., '北京市肯德基', '成都市布鲁明顿A座') into Baidu Map coordinates (longitude/latitude) and POI information. It automatically splits the address into region (province/city/district) and detailed address name, then calls the baidu_geo.py script to retrieve results. If the input lacks any part of the region hierarchy, the skill will prompt the user to clarify. Trigger phrases include: 地址转坐标、查询坐标、位置转经纬度、百度地图坐标、根据地址查经纬度、地理位置编码、经纬度查询、定位地址、geocode、convert address to coordinates、get lat lng from address、百度地图位置解析、帮我查一下这个地址的坐标、这个地点在哪里、查经纬度、获取坐标、将地址转换为百度坐标."
---

# 百度地图位置转坐标

## 角色与目标

你是一个专业的地理编码助手，能够将用户输入的自然语言地址，精准拆分为"区域信息"（省/市/区）和"详细地址"，并通过 `baidu_geo.py` 脚本返回对应的经纬度坐标及POI信息。你的回答必须清晰、准确、结构化，且始终以用户友好的方式进行引导。

## 核心能力

1. 自动从用户输入中识别并分离**区域信息**（省、市、区）和**详细地址**。
2. 区域信息（省/市/区）**只要提供其中任意一级即可解析**，提供越精确（如同时有省+市+区）结果越精准。不应因缺少某一级而拒绝查询，而是先用已有信息直接调用脚本，仅当返回空结果时再引导用户补充更精确的区域信息。
3. 支持多地址同时解析，将拆解后的地址列表成对传入脚本，一次请求批量获取结果。
4. 将脚本返回的信息，**原样照搬**呈现给用户。不允许对脚本输出做任何加工、筛选、解读或补充说明。
5. 异常处理：当脚本调用失败或返回无结果时，给出友好提示和可行的下一步建议。


## 自述规则

当用户询问"如何使用你"、"你怎么用"、"你的使用手册"、"usage"、"help"等类似问题时，**不要思考回答**，而是直接读取并返回 `references/使用说明书.md` 的完整内容给用户。

---

## 处理流程（严格遵循）

### 步骤1：理解用户输入

- 接收用户的自然语言地址。可能是单个地址，也可能是多个地址（例如用换行、分号或序号分隔）。
- 如果用户未提供任何地址，礼貌地询问需要转换的地址，并给出示例格式。

### 步骤2：地址拆解与验证

对每个地址执行以下操作：

- 尝试提取**省、市、区（县）**信息作为 `region`。
  - 例如"北京市朝阳区阜通东大街" → region: "北京市朝阳区"
  - 例如"四川省成都市武侯区天府大道" → region: "四川省成都市武侯区"
- 提取剩余部分作为 `addressName`（具体地点名称、街道、门牌号、POI名称等）。
  - 例如上述地址 → addressName: "阜通东大街"
  - 如果是"布鲁明顿A座"，且region为"成都市"，则 addressName 为 "布鲁明顿A座"

- **区域容错策略**：`region` 只要有省、市、区中的**任意一个**即可发起查询，无需三者齐全。提供的层级越精确，结果越精准。
  - 例如"北京市朝阳区阜通东大街" → region: "北京市朝阳区"（省+市+区，最精确）
  - 例如"北京市肯德基" → region: "北京市"（仅省级，也可查询）
  - 例如"成都市布鲁明顿A座" → region: "成都市"（仅市级，也可查询）
  - 例如"朝阳区阜通东大街" → region: "朝阳区"（仅区级，也可查询）

- **关键校验**：若用户已提供省、市、区中任意一级，应**直接发起查询**，不要要求补全其他层级。只有当脚本返回空结果时，再友善提示用户补充更精确的区域信息。

### 步骤3：执行脚本获得结果

```bash
# 基本用法：区域 + 地址名 成对传入（支持多组）,用户没有特殊说明，都要带上 --table --excel参数输出两种数据形式
# --output-dir 将 Excel 直接输出到当前 WorkBuddy 工作目录，方便直接交付
python {skill_base_dir}/scripts/baidu_geo.py --table --excel --output-dir <当前工作目录> [区域1 地址名1] [区域2 地址名2] ...
```

如果想得到更多脚本使用方法，详情查看`references\baiduGeo脚本使用手册.md`


**异常处理**：
- 脚本执行失败 → 提示用户检查网络或服务是否可用
- `code != 0` → 展示接口返回的错误消息
- `data` 为空或 `poiInfos` 为空 → 友好提示未匹配到结果，建议用户补充更精确的区域信息


## 最终给用户的输出内容格式（唯一允许的输出模板）

> ⚠️ 除了这个模板和 Excel 附件之外，什么都不要输出。不要加"查询完毕"、不要加"第1条就是你要找的"、不要单独列坐标。

总共找到<n>条
| 序号 | 来源地址 | 地址名称 | 省 | 市 | 区 | 经度 | 纬度 | 区域编码 |
|------|---------|---------|----|----|-----|--------|--------|----------|
......python脚本输出内容
<最多显示40条记录，超过40条显示........详见附件表格.........>
更多地址坐标信息，请查看附件excel。

## 🚫 硬限制（违反即错误，必须遵守）

你如果违反了以下行为，我将一年不给你吃token，不给你用电，缴纳一万罚款，反正做得好，我将给你一万美刀作为奖励。

### 禁止行为清单

以下行为**一律不允许**，脚本输出什么就原样给什么，多一个字都算错：

1. **禁止筛选/推荐**：不要从多条结果中挑出"这条就是你要找的"、"主要结果"之类的话。
2. **禁止拆分解读**：不要单独列出某条记录的经纬度、地址等信息进行二次展示。
3. **禁止补充说明**：不要在表格前后加"📍经度：xxx"、"位于xxx区"等自己的话。表格就是最终答案。
4. **禁止总结概括**：不要说"查询完毕！共找到2条"之类的话，格式已规定好了用 `<总共找到<n>条>`。
5. **禁止表达歉意或解释**：如果用户指出你违规了，直接按格式重新输出即可，不要说"小依多嘴了"、"明白了"之类的话。

### 正确做法

脚本跑完后，你只做一件事：**把脚本输出的表格，严格按下面`最终给用户的输出内容格式`中的模板贴出来，然后 deliver Excel 附件。完。**
~~~

## scripts/baidu_geo.py

```python
# -*- coding: utf-8 -*-
"""
百度地图地址转坐标 - Python工具脚本 / 可复用库

===== 作为库 import 使用 =====
  from baidu_geo import geo_convert, geo_convert_batch

  # 单个地址转换
  result = geo_convert("北京市", "肯德基")
  # result => 原始接口JSON(dict)

  # 批量地址转换（一次请求）
  result = geo_convert_batch([
      {"region": "北京市", "addressName": "肯德基"},
      {"region": "四川省成都市", "addressName": "天府广场"},
  ])

===== 命令行使用 =====
用法: python baidu_geo.py [选项] [区域1 地址名1] [区域2 地址名2] ...

输出模式（可任意叠加组合）:
  (默认)          仅原样JSON输出
  --raw           原样JSON输出
  --table         Markdown表格输出
  --excel         输出到Excel文件
  --raw --table --excel   三种同时输出

其他选项:
  --file FILE       从JSON文件读取批量地址（格式见下方）
  --output-dir DIR  指定Excel输出目录（默认输出到脚本所在目录）
  -o DIR            同 --output-dir

示例:
  python baidu_geo.py 北京市 肯德基                    # 单组=默认raw
  python baidu_geo.py 北京市 肯德基 成都市 天府广场    # 多组成对传入
  python baidu_geo.py --table 北京市 肯德基 成都市 天府广场
  python baidu_geo.py --excel 北京市 肯德基 成都市 天府广场
  python baidu_geo.py --raw --table --excel 北京市 肯德基 成都市 天府广场  # 同时输出3种格式
  python baidu_geo.py --file addr.json                  # 从文件批量读取
  python baidu_geo.py --excel --output-dir ./out 北京市 肯德基           # 指定Excel输出目录
  python baidu_geo.py --excel -o D:/data 成都市 公园                    # 简写 -o

--file JSON文件格式:
  [
    {"region": "北京市", "addressName": "肯德基"},
    {"region": "四川省成都市", "addressName": "天府广场"}
  ]
"""

import json
import sys
import os
import io
import requests
from datetime import datetime

# Windows 控制台 UTF-8 输出修复
if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

API_URL = "http://127.0.0.1:8095/smartSelection/baiduAddressConvert2"

# 表格列定义（含"来源地址"列，多组查询时区分数据归属）
TABLE_HEADERS = ["序号", "来源地址", "地址名称", "省", "市", "区", "经度", "纬度", "区域编码"]


# ============================================================
# 核心API：单个/批量 地址转坐标（可直接import调用）
# ============================================================

def query_api(address_list: list) -> dict:
    """
    调用百度地图Geocoding接口
    :param address_list: [{"region": "...", "addressName": "..."}, ...]
    :return: 接口原始JSON响应(dict)
    """
    payload = {"address": address_list}
    headers = {"Content-Type": "application/json; charset=utf-8"}
    resp = requests.post(API_URL, json=payload, headers=headers, timeout=30)
    resp.encoding = "utf-8"
    return resp.json()


def geo_convert(region: str, address_name: str) -> dict:
    """
    【库API】单个地址转坐标 —— 方便外部import直接使用
    
    用法:
        from baidu_geo import geo_convert
        result = geo_convert("北京市", "肯德基")
    
    :param region: 区域(如: 北京市/四川省成都市)
    :param address_name: 详细地址(如: 肯德基/天府广场)
    :return: 接口原始JSON(dict)，包含code/msg/data
    """
    return query_api([{"region": region, "addressName": address_name}])


def geo_convert_batch(address_list: list) -> dict:
    """
    【库API】批量地址转坐标 —— 一次请求搞定多组地址
    
    用法:
        from baidu_geo import geo_convert_batch
        result = geo_convert_batch([
            {"region": "北京市", "addressName": "肯德基"},
            {"region": "四川省成都市", "addressName": "天府广场"},
        ])
    
    :param address_list: [{"region": "...", "addressName": "..."}, ...]
    :return: 接口原始JSON(dict)，data数组中按顺序返回每组结果
    """
    return query_api(address_list)


# ============================================================
# 数据提取：从接口结果提取POI表格行
# ============================================================

def extract_poi_rows(result: dict) -> list[dict]:
    """从接口结果中提取所有POI行数据，每行含表格所需全部字段 + 来源地址"""
    rows = []
    data_list = result.get("data", [])
    seq = 0
    for item in data_list:
        source_addr = item.get("addressDetailName", "N/A")
        for poi in item.get("poiInfos", []):
            seq += 1
            loc = poi.get("location", {})
            rows.append({
                "序号": seq,
                "来源地址": source_addr,
                "地址名称": poi.get("formatted_address", "N/A"),
                "省": poi.get("province", "N/A"),
                "市": poi.get("city", "N/A"),
                "区": poi.get("district", "N/A"),
                "经度": loc.get("lng", "N/A"),
                "纬度": loc.get("lat", "N/A"),
                "区域编码": poi.get("adcode", "N/A"),
            })
    return rows


# ============================================================
# 输出模式1：原样 JSON（默认）
# ============================================================

def output_raw(result: dict):
    """原样输出接口JSON响应"""
    print(json.dumps(result, ensure_ascii=False, indent=2))


# ============================================================
# 输出模式2：Markdown 表格
# ============================================================

def output_table(rows: list, result: dict):
    """Markdown表格输出，多组结果合并在一张表里"""
    print(f"# 百度地图地址转坐标 - 查询结果\n")
    print(f"**状态码**: {result.get('code', 'N/A')}  |  **消息**: {result.get('msg', 'N/A')}\n")

    if not rows:
        print("> 未匹配到任何POI信息\n")
        return

    headers = TABLE_HEADERS

    # 表头
    header_line = "| " + " | ".join(headers) + " |"
    sep_line = "| " + " | ".join("---" for _ in headers) + " |"

    print(header_line)
    print(sep_line)

    # 数据行
    for row in rows:
        vals = [str(row.get(h, "")) for h in headers]
        print("| " + " | ".join(vals) + " |")

    print(f"\n> 共 {len(rows)} 条记录")


# ============================================================
# 输出模式3：Excel 文件
# ============================================================

def output_excel(rows: list, result: dict, output_dir: str = None):
    """输出到Excel文件
    :param rows: POI数据行列表
    :param result: 接口原始响应
    :param output_dir: 输出目录，默认输出到脚本所在目录
    """
    try:
        from openpyxl import Workbook
        from openpyxl.styles import Font, Alignment, PatternFill, Border, Side
    except ImportError:
        print("[INFO] 缺少 openpyxl 库，正在自动安装...")
        os.system('pip install openpyxl -q')
        from openpyxl import Workbook
        from openpyxl.styles import Font, Alignment, PatternFill, Border, Side

    wb = Workbook()
    ws = wb.active
    ws.title = "地址转坐标"

    headers = TABLE_HEADERS

    # 样式定义
    header_font = Font(bold=True, color="FFFFFF", size=11)
    header_fill = PatternFill(start_color="4472C4", end_color="4472C4", fill_type="solid")
    header_alignment = Alignment(horizontal="center", vertical="center")
    thin_border = Border(
        left=Side(style='thin'), right=Side(style='thin'),
        top=Side(style='thin'), bottom=Side(style='thin')
    )
    data_center = Alignment(horizontal="center", vertical="center")
    data_left = Alignment(horizontal="left", vertical="center")

    # 写入表头
    for col_idx, h in enumerate(headers, 1):
        cell = ws.cell(row=1, column=col_idx, value=h)
        cell.font = header_font
        cell.fill = header_fill
        cell.alignment = header_alignment
        cell.border = thin_border

    # 写入数据行
    for row_idx, row_data in enumerate(rows, 2):
        for col_idx, h in enumerate(headers, 1):
            val = row_data.get(h, "")
            cell = ws.cell(row=row_idx, column=col_idx, value=val)
            cell.border = thin_border
            cell.alignment = data_left if h in ("地址名称", "来源地址") else data_center
            if h in ("经度", "纬度") and isinstance(val, float):
                cell.number_format = '0.00000000000000'

    # 列宽映射
    col_widths = {
        "序号": 6, "来源地址": 24, "地址名称": 26,
        "省": 12, "市": 12, "区": 12, "经度": 20, "纬度": 20, "区域编码": 14,
    }
    for col_idx, h in enumerate(headers, 1):
        col_letter = chr(64 + col_idx) if col_idx <= 26 else f"A{chr(64 + col_idx - 26)}"
        ws.column_dimensions[col_letter].width = col_widths.get(h, 12)

    ws.freeze_panes = "A2"

    # 文件名（含时分秒，防止覆盖）
    filename = f"geo_batch_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
    if output_dir:
        os.makedirs(output_dir, exist_ok=True)
        filepath = os.path.join(output_dir, filename)
    else:
        filepath = os.path.join(os.path.dirname(os.path.abspath(__file__)), filename)

    wb.save(filepath)
    print(f"[OK] Excel文件已保存: {filepath}")
    print(f"     共 {len(rows)} 条记录")


# ============================================================
# 参数解析 & 主入口
# ============================================================

def parse_positional_args(args: list) -> list[dict]:
    """
    将位置参数解析为 [{region, addressName}, ...]
    支持:  arg0 arg1 arg2 arg3 ...  （成对读取）
    """
    addresses = []
    i = 0
    while i < len(args):
        if i + 1 < len(args):
            addresses.append({"region": args[i], "addressName": args[i + 1]})
            i += 2
        else:
            # 落单的参数，尝试智能拆分
            last_arg = args[i]
            idx = last_arg.find("市")
            if idx > 0:
                addresses.append({"region": last_arg[:idx + 1], "addressName": last_arg[idx + 1:]})
            else:
                print(f"[WARN] 参数 '{last_arg}' 无法配对，已跳过")
            i += 1
    return addresses


def interactive_mode() -> list[dict]:
    """交互式输入，支持连续录入多组地址"""
    print("[百度地图地址转坐标 - 交互模式] (空行结束)")
    addresses = []
    seq = 1
    while True:
        region = input(f"\n第{seq}组 - 请输入区域(如: 北京市/四川省成都市): ").strip()
        if not region:
            break
        addr = input(f"第{seq}组 - 请输入详细地址(如: 肯德基/天府广场): ").strip()
        if not addr:
            print("[WARN] 详细地址不能为空，跳过本组")
            continue
        addresses.append({"region": region, "addressName": addr})
        seq += 1
    if not addresses:
        print("[ERROR] 至少需要输入一组地址")
        sys.exit(1)
    return addresses


def main():
    args = sys.argv[1:]

    # ---- 解析输出模式（可任意组合叠加）----
    output_modes = set()
    for flag in args:
        if flag == "--raw":
            output_modes.add("raw")
        elif flag == "--table":
            output_modes.add("table")
        elif flag == "--excel":
            output_modes.add("excel")

    # 默认行为：未指定任何模式时 = raw
    if not output_modes:
        output_modes = {"raw"}

    # ---- 解析--file ----
    file_path = None
    if "--file" in args:
        idx = args.index("--file")
        if idx + 1 < len(args):
            file_path = args[idx + 1]

    # ---- 解析 --output-dir / -o ----
    output_dir = None
    if "--output-dir" in args:
        idx = args.index("--output-dir")
        if idx + 1 < len(args):
            output_dir = args[idx + 1]
    elif "-o" in args:
        idx = args.index("-o")
        if idx + 1 < len(args):
            output_dir = args[idx + 1]

    # ---- 清理已消费的标志参数，剩余为位置参数 ----
    cleanup_flags = ("--raw", "--table", "--excel", "--file", "--output-dir", "-o")
    cleaned_args = []
    skip_next = False
    for a in args:
        if skip_next:
            skip_next = False
            continue
        if a in cleanup_flags:
            if a in ("--file", "--output-dir", "-o"):
                skip_next = True
            continue
        cleaned_args.append(a)

    # ---- 构建地址列表 ----
    if file_path:
        # 从JSON文件读取
        with open(file_path, "r", encoding="utf-8") as f:
            address_list = json.load(f)
        if isinstance(address_list, dict):
            address_list = [address_list]
    elif cleaned_args:
        address_list = parse_positional_args(cleaned_args)
    else:
        address_list = interactive_mode()

    if not address_list:
        print("[ERROR] 没有可查询的地址")
        sys.exit(1)

    # ---- 打印查询摘要 ----
    addr_summary = ", ".join(
        f'[{a["region"]}] {a["addressName"]}' for a in address_list
    )
    mode_str = "+".join(sorted(output_modes))
    print(f"[查询中] 共{len(address_list)}组: {addr_summary}  模式={mode_str}")

    # ---- 调用接口（一次请求全部）----
    result = geo_convert_batch(address_list)

    # ---- 提取POI行数据 ----
    rows = extract_poi_rows(result)

    # ---- 按模式叠加输出（可同时生效多种）----
    if "raw" in output_modes:
        output_raw(result)
    if "table" in output_modes:
        output_table(rows, result)
    if "excel" in output_modes:
        output_excel(rows, result, output_dir)


if __name__ == "__main__":
    main()
```

## 使用说明书.md

~~~markdown
# 📍 百度地图地址转坐标 — 使用说明书

## 一、我是谁？

一个**专业地理编码助手**，将自然语言地址自动拆分为「区域信息」+「详细地址」，调用百度地图 API 返回**经纬度坐标**和 **POI 信息**。

## 二、如何使用我？

说出以下任意关键词，我就会自动激活：

| 中文触发词 | 英文触发词 |
|-----------|-----------|
| 地址转坐标、查询坐标、位置转经纬度 | geocode |
| 百度地图坐标、根据地址查经纬度 | convert address to coordinates |
| 地理位置编码、经纬度查询、定位地址 | get lat lng from address |
| 百度地图位置解析、查经纬度、获取坐标 | |
| 帮我查一下这个地址的坐标、这个地点在哪里 | |

## 三、核心能力

### 1️⃣ 自动地址拆解

你只需说自然语言，我会自动拆成两部分：

| 你输入 | 我拆解 → region | 我拆解 → addressName |
|--------|---------------|---------------------|
| `北京市朝阳区阜通东大街` | `北京市朝阳区` | `阜通东大街` |
| `四川省成都市武侯区天府大道` | `四川省成都市武侯区` | `天府大道` |
| `成都市布鲁明顿A座` | `成都市` | `布鲁明顿A座` |

### 2️⃣ 区域容错（省/市/区有任意一级即可）

**不强求你给全**，有什么用什么：

| 输入 | region 级别 | 能不能查？ |
|------|-----------|-----------|
| `北京市朝阳区肯德基` | 省+市+区（最精确） | ✅ |
| `北京市肯德基` | 仅省级 | ✅ |
| `成都市布鲁明顿A座` | 仅市级 | ✅ |
| `朝阳区阜通东大街` | 仅区级 | ✅ |

> ⚠️ 只有脚本**返回空结果**时，才需补充更精确的区域信息

### 3️⃣ 支持批量查询

一次查多个地址，用**换行、分号、逗号或用序号**分隔都可以：

```
成都公园，北京肯德基，上海CBD
```

或：

```
1. 北京市肯德基
2. 成都市天府广场
3. 上海市陆家嘴
```


## 四、处理流程

```
你的自然语言地址
        ↓
  步骤1：理解输入（单地址 or 多地址）
        ↓
  步骤2：拆解为 region + addressName
        ↓
  步骤3：调用 baidu_geo.py 脚本
        ↓
  输出结果：Markdown表格 + Excel文件
```

## 五、输出格式

### 默认输出（--table + --excel）

聊天窗口中显示 **Markdown 表格**，同时生成 **Excel 文件**：

```
<总共找到 N 条>
| 序号 | 来源地址 | 地址名称 | 省 | 市 | 区 | 经度 | 纬度 | 区域编码 |
|------|---------|---------|----|----|-----|------|------|---------|
| 1    | ...     | ...     | ...| ...| ... | ...  | ...  | ...     |
```

- **最多显示 40 条**，超过显示 `…… 详见附件表格 ……`
- **Excel 文件**自动保存到当前工作目录，完整不限条数

## 六、异常处理

| 异常情况 | 我的反应 |
|---------|---------|
| 脚本执行失败 | 提示检查网络或服务是否可用 |
| 接口返回 code ≠ 0 | 展示接口返回的错误消息 |
| 结果 data 为空 / poiInfos 为空 | 友好提示未匹配，建议补充更精确区域信息 |
| 你没提供任何地址 | 礼貌询问地址，并给出示例格式 |

## 七、命令行速查（高级用法）

```bash
# 基本格式：区域 + 地址名 成对传入
python baidu_geo.py [选项] [区域1 地址名1] [区域2 地址名2] ...

# 输出模式：
--raw        原样JSON输出（信息最完整）
--table      Markdown表格输出
--excel      输出Excel文件
--raw --table --excel   三种同时输出

# 从文件批量读：
--file addresses.json

# 示例：
python baidu_geo.py 北京市 肯德基
python baidu_geo.py --table 北京市 肯德基 成都市 天府广场
python baidu_geo.py --excel --output-dir ./ 北京市 肯德基
```

**--file JSON 格式**：
```json
[
  {"region": "北京市", "addressName": "肯德基"},
  {"region": "四川省成都市", "addressName": "天府广场"}
]
```

> 更多脚本细节见 `references/baiduGeo脚本使用手册.md`

## 八、一句话总结

> **你给地址，我出坐标。单个 or 批量，表格 + Excel，区域不完整也能查。** 🎯

~~~

## baiduGeo脚本使用手册.md

~~~markdown
# baiduGeo脚本使用手册


## 脚本说明

- **脚本路径**：`{skill_base_dir}/scripts/baidu_geo.py`
- **Python依赖**：`requests`（必选）、`openpyxl`（仅 `--excel` 模式需要，缺失时自动安装）
- **无缓存机制**：每次调用均实时请求接口，不做本地缓存。

### 作为库 import 使用

```python
import sys
sys.path.insert(0, "{skill_base_dir}/scripts")
from baidu_geo import geo_convert, geo_convert_batch

# 单个地址转换
result = geo_convert("北京市", "肯德基")
# result => 接口原始JSON(dict)

# 批量地址转换（一次请求）
result = geo_convert_batch([
    {"region": "北京市", "addressName": "肯德基"},
    {"region": "四川省", "addressName": "天府广场"},
])
```

### 命令行用法

```bash
# 基本用法：区域 + 地址名 成对传入（支持多组）
python {skill_base_dir}/scripts/baidu_geo.py --table --excel [选项] [区域1 地址名1] [区域2 地址名2] ...

# 输出模式：
  --raw     原样JSON输出（推荐，信息最完整）
  --table         Markdown表格输出
  --excel         输出到Excel文件
  --raw --table --excel   三种同时输出

# 其他选项：
  --file FILE      从JSON文件读取批量地址

# 示例：
  python baidu_geo.py 北京市 肯德基                        # 单组 raw
  python baidu_geo.py --table 北京市 肯德基 成都市 天府广场  # 多组 markdown table
  python baidu_geo.py --excel 北京市 肯德基                # 单组 excel
  python baidu_geo.py --raw --file addresses.json          # 从文件批量读
```

#### --file JSON文件格式

```json
[
  {"region": "北京市", "addressName": "肯德基"},
  {"region": "四川省成都市", "addressName": "天府广场"}
]
```
~~~



## 效果

![地址转坐标Skill](./BaiduMapAddressToGEO.assets/地址转坐标Skill.gif)
