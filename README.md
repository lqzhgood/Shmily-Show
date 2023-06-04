# 说明

请先阅读 https://github.com/lqzhgood/Shmily

此工具用来显示 `Shmily-Msg` 格式的工具

> Demo https://github.com/lqzhgood/Shmily-Show-Demo

## 使用

-   安装 node 环境 [http://lqzhgood.github.io/Shmily/guide/setup-runtime/nodejs.html]
    -   如果依赖安装困难，可以在 [node_modules](https://github.com/lqzhgood/Shmily-Show/tree/node_modules) 分支下载
-   将 [Get](http://lqzhgood.github.io/Shmily/guide/use/get.html) 中获取的 `数据文件` 放入 `/memoryweb/src/assets/data/msg/` 中

    > 文件名会作为 ID 的一部分，确认后不要反复修改

-   将 [Get](http://lqzhgood.github.io/Shmily/guide/use/get.html) 中获取的 `资源文件` 放入 `/msgData/data/` 中
-   修改 `memoryweb\src\config.js`
-   修改 `memoryweb\script\user\`

        - banDict.js 词云中不需要的词可以在这里过滤
        - commentTag.js 需要在统计页中出现次数的关键词
        - userDict.txt 用户词典 参考 https://github.com/yanyiwu/nodejieba
        - userGroup.js 可以对 sender / receiver 分组

    > [可选] 如需对数据文件增删改查并添加评论, 参考文档 [./docs/modify.md](./docs/modify.md) 完成修改

-   进入 `memoryweb` 执行 `npm run build`
-   解压缩 `msgData\tools\Chrome.zip`
    -   确保解压后路径 `msgData\tools\Chrome\MyChrome.exe` 正确
    -   删除 `Chrome.z*` 压缩包
-   将 `msgData` 复制到 `memoryweb/dist`
-   `memoryweb/dist` 就是最终文件, 双击 `start.bat` 可以直接运行

## 文件结构

-   Show
    -   memoryweb 前端, 用来展示 `数据文件`
    -   server 后端, 主要用来实现对 `数据` 和 `评论` 的增删改查
    -   msgData
        -   data 用来存放 `资源文件`
        -   tools
            -   webServer 资源文件 web 服务器
            -   Chrome 便携版 Chrome , 需要解压

## Wiki

参考 [./docs/wiki.md](./docs/wiki.md)


## 感谢

http://lqzhgood.github.io/Shmily/guide/other/thanks.html

## 捐赠

点击链接 http://lqzhgood.github.io/Shmily/guide/other/donation.html 看世界上最可爱的动物
