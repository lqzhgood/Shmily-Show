# 说明

请先阅读 https://github.com/lqzhgood/Shmily

此工具用来显示 `Shmily-Msg` 格式的工具

> Demo https://github.com/lqzhgood/Shmily-Show-Demo

## 文件结构

-   Show
    -   memoryweb 前端, 用来展示 `数据文件`
    -   server 后端, 主要用来实现对 `数据` 和 `评论` 的增删改查
    -   msgData
        -   data 用来存放 `资源文件`
        -   tools
            -   webServer 资源文件 web 服务器

## 使用

-   安装 node 环境 [http://lqzhgood.github.io/Shmily/guide/setup-runtime/nodejs.html]
-   将 [Get](http://lqzhgood.github.io/Shmily/guide/use/get.html) 中获取的 `数据文件` 放入 `/memoryweb/src/assets/data/msg/` 中
-   将 [Get](http://lqzhgood.github.io/Shmily/guide/use/get.html) 中获取的 `资源文件` 放入 `/msgData/data/` 中
-   修改 `memoryweb\src\config.js`

    > [可选] 如需对数据文件增删改查并添加评论, 参考文档 [./docs/modify.md](./docs/modify.md) 完成修改

-   进入 `memoryweb` 执行 `npm run build`
-   将 `msgData` 复制到 `memoryweb/dist`
-   `memoryweb/dist` 就是最终文件, 双击 `start.bat` 可以直接运行

## 开发

参考 [./docs/dev.md](./docs/dev.md)

## 感谢

#### webd

https://webd.cf/

个人测试过性能最好的小型 web 服务器
