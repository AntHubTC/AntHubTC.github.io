## 配置

### 安装打包工具

```bash
npm install electron-packager -g
```

### npm配置

```json
{
  "name": "my-electron-app",
  "version": "1.0.0",
  "description": "",
  "main": "main.js",
  "type": "commonjs",
  "scripts": {
    "start": "electron .",
    "package": "electron-packager . myapp --platform=win32 --arch=x64 --out=dist --overwrite",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "electron": "^24.1.1",
    "electron-reload": "^2.0.0-alpha.1"
  }
}
```

### 打包

```bash
npm package
```



## 遇到的问题

### cmd中打包的时候不成功，提示connect ETIMEDOUT 

如果是vscode，vsCode打包不成功，提示connect ETIMEDOUT 20.205.243.166:443

```bash
electron-packager . myapp --platform=win32 --arch=x64 --out=dist --overwrite
connect ETIMEDOUT 20.205.243.166:443
```

**解决办法：**

切npm源

```bash
npm config set registry https://registry.npmmirror.com
```

再执行，还是超时，然后找了一个专门的源

```bash
npm config set  electron_mirror https://npmmirror.com/mirrors/electron/
```

