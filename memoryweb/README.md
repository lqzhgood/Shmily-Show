# Shmily

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run dev
```

### Compiles and minifies for production

```
npm run build
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

### 说明

-   针对 1366\*768 适配 (高分辨率更没问题了)
-   探测文件是否存在使用的 ~~head~~ `Get Range:0-0` 方法， 服务端需要支持
-   id 中的时间是原始的时间, 可能和 ms-day-time 不一样, 因为 ms-day-time 可能被 modify

##### 评论

-   `<a innerLink>Link</a>`标签 包含 <code>innerLink</code> 属性的代表内部跳转，根据 Vue-router 模式（hash / history）可能需要对 `href` 做额外的处理， 默认 `href` 是 `hash` 模式

### 没做的一些优化

-   script 里面大量代码可以优化速度,特别是两数组查找对比的 具体方式写在 scripts\msgHandle\pre\filterAndModify.js 里了 但由于是预处理所以时间并不太敏感,优化后时间估计也就缩短几秒吧 故暂未修改
