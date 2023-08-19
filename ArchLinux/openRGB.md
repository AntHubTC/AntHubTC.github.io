# 开源灯光控制openRGB

OpenRGB是一个用于控制RGB灯效的开源工具，支持多种硬件设备。[官网](https://openrgb.org/)

```bash
openrgb --help
# 查看可以控制的设备，以及支持的modes和zones，LEDS等信息
open-rgb -l
# 指定设备0，设定亮度100
openrgb --device 0 -b 100  
# 指定设备0，设置静态的蓝色，亮度100
openrgb --device 0 --color blue --mode static  -b 100
# 指定设备0，设置几个颜色，使用呼吸灯模式切换
openrgb --device 0 --color FF0FF0,red,yellow --mode breathing 
# 指定设备0，随机颜色，使用呼吸灯模式其诶
openrgb --device 0 --color random --mode breathing 

# openRgb保存的预设配置文件存储的位置是：~/.config/OpenRGB下的*.orp文件
openrgb --device 0 -p ~/.config/OpenRGB/offLED.orp
```

