# 玩转VLC视频播放器

## 如何安装

```bash
pacman -S vlc
```

## 安装皮肤

将皮肤文件拷贝到/home/tc/.local/share/vlc/skins2，打开选项设置，选择自定义皮肤。

![image-20230818000159554](/run/media/tc/File/2_STUDY/GitHubRepositories/00myGitHubRepository/AntHubTC.github.io/ArchLinux/img/VLC/image-20230818000159554.png)

重启vlc后，可以选择其它皮肤：

  右击-》interface-》select skins -》选择你喜欢的皮肤。

## 坏皮肤导致程序故障

选择来坏皮肤，导致程序崩溃或启动不了VLC，删除下面目录重启即可：

```bash
rm -rf ~/.config/vlc
```

