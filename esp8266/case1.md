# 点亮一个LED



编写一个main.py（记住，入口文件为main.py，如果用其他文件名，上传后不会运行）

```python
import machine
import time

if __name__ == '__main__':
    pin = machine.Pin(5, machine.Pin.OUT)
    while True:
        pin.on()
        time.sleep(0.5)
        pin.off()
        time.sleep(0.5)
```

