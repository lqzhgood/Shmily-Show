# 开发

基于 `Shmily` 的[理念](https://lqzh.me/Shmily/guide/concept.html), 减少轮子的存在. 将记录存档分拆为 `Get` `Show`, 本项目即为 `Show` 的承载部分

### memoryweb

#### 程序启动过程

1.  执行 `memoryweb\scripts\index.js`

    预处理数据, 分为以下几步,

         - merger 合并数据
         - comment 处理评论
         - statistics 统计图表    ( 这一步非常耗时 25w数据约30分钟 )
         - check 检查数据

    后面可以加参数跳过一些环节,如 `npm run makePre j_statistics` 是跳过统计

2.  正常 vue 项目打包过程

#### 目录说明

-   memoryweb

    -   public
        -   json 预处理的 json 文件, 每次执行会自动生成. 通过 ajax 方式获取
        -   static 静态文件, 包含图标等
        -   tools
    -   src 源码目录
        -   assets 会打包进代码的资源文件
            -   data
                -   msg Get 数据文件存放处
                    -   msg-wechat-1.json
                    -   msg-qq-pc-1.json
                    -   bak 程序启动后会修改上面的文件(添加 ID 等), 此处为原始文件备份(仅根据文件名判断)
                        -   msg-wechat-1.json
                        -   msg-qq-pc-1.json
                -   comments.json 评论文件
                -   modify.json 数据修改文件
    -   tools 一些工具
        -   $To$Extend 修改 $Msg 额外属性名为 $Extend
            > 历史原因 $Msg 额外属性是以 $source 命名的, 如 $Wechat, 后期发现有点不方便, 想统一成 $Extend, 但是各种库耦合太强了, 放弃
        -   checkCameraFile 检查 Camera 文件是否全部存在
        -   checkModifyQQFace
            > 更新 \data\qq-pc\face\emojiMapByQQ.json 文件后更新 modify.json, 会自动备份 modify.json
        -   checkMsgBakSame
            > 检查资源文件和 资源文件 bak 文件夹中的数据是否一致
        -   checkMsgOriginalImgHaveTitle
            > 检查所有资源文件中的 img 是否只有 alt 没有 title , 早期忘了加
        -   findEmptyContent-qqpc
            > 寻找内容为空的 QQ-PC 资源文件, 空内容多半是不支持导出的消息文件. 可以查看 [Shmily-Get-QQ-PC_MHT](https://github.com/lqzhgood/Shmily-Get-QQ-PC_MHT) `丢失消息` 部分, 通过 [编辑消息](../docs/modify-msg.md) 手动添加
        -   findImglostImg-qqpc
            > 寻找丢失图片内容的 QQ-PC 资源文件, 很多图片在 `QQ消息管理器` 中显示红叉,但是多次双击又能显示出来, 估计是 QQ 的 Bug. 可以手动拿到图片通过 [编辑消息](../docs/modify-msg.md) 手动添加
        -   getMsgAssetsByComment
            > 通过关键词过滤评论, 复制评论对应消息的 资源文件. 如我想获取所有消息中的小动物图片, 我可以给相应消息添加 `#小动物` 的评论, 然后通过此工具就可以过滤出包含 `#小动物` 的评论, 通过评论拿到对应消息的全部图片
        -   mergeSlice
            > 合并 modify.json 和 comment.json
        -   modifyImgNameByMsgMs (废弃)
            > 修改手动录入图片的名称中的时间戳, 从 `创建时间` 修改为 `消息时间`, 早期考虑不完善的修补工具
        -   RenameRealFileExt
            > 修改放入 input 中文件的后缀名为真实后缀名. 如 wechat 将图片后缀硬编码为 `png`, 其实很多是 `jpg`
        -   replaceCommentAndModify
            > 修改 comment.json 和 modify.json 中的消息
        -   replaceCommentErrorA (废弃)
            > 检查 comment.json 中的 a 标签是否正确
        -   replaceCommentInnerAText
            > 修正 comment.json 内联 query 文本为时间格式
        -   replaceId
            -   index.js
                > 有时候手动修改了 msg.json 文件内容或文件名导致 msg.id 变化, 此工具用于将 comment.json 和 modify.json 中的老 ID 替换为新 ID
                > 必须有新的 msg.json(n.json) 和 老的 msg.json(o.json) 作为输入
            -   commentDir.js
                > 评论资源文件夹(msgData/data/comments/$msgId/\*)名称也是以 msgId 命名的, 所以也要修改.
        -   replaceModifyQQTypeImage (废弃)
            > QQ-PC 的图片类型被错误的标记为消息了, 修补工具

### msgData

#### 目录说明

-   msgData
    -   data 资源文件夹
    -   tools 最终会和 `memoryweb\public\tools` 中一起合并到 `\dist`
        -   webServer 使用 55988 端口
            > 开发时不使用 webpack 的 webServer 承载静态资源, 采用生产环境一致的 web 服务器可以在 debug 时更容易发现错误. 例如 head 方法很多 web 服务器支持并不完善
        -   Chrome.zip 打包的便携版 Chrome

### server

这里面很多都随手写的, 代码很乱. 但现有功能都已经测试验证. 有新需求自行增加 Api 吧

#### 目录说明

-   server
    -   routes
        > Api 路由
