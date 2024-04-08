import subprocess
import os

def check_winrar_installed():
    # 使用 where 命令（Windows）或 which 命令（Linux/Mac）检查是否安装 WinRAR
    command = 'where winrar'  # Windows
    # command = 'which winrar'  # Linux/Mac

    try:
        subprocess.run(command, shell=True, check=True)
        return True
    except subprocess.CalledProcessError:
        return False

def decompress_file(input_file, output_dir):
    if check_winrar_installed():
        # 如果安装了 WinRAR，则使用 WinRAR 解压缩
        winrar_command = ['winrar', 'x', input_file, output_dir]
        subprocess.run(winrar_command, check=True)
        print('使用 WinRAR 解压缩完成')
    else:
        # 如果未安装 WinRAR，则使用 BandZip 解压缩
        bz_command = ['bz', 'x', input_file, output_dir]
        subprocess.run(bz_command, check=True)
        print('使用 BandZip 解压缩完成')

if __name__ == '__main__':
    new_doc_name = input("请输入文档名称:")

    # 输入压缩文件和输出目录路径
    input_file = './docBuildMethodTemplate.zip'
    output_dir = f'../{new_doc_name}/'

    os.mkdir(output_dir)

    # 调用解压缩函数
    decompress_file(input_file, output_dir)