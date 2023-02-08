console.time('⏱️ All');

const fs = require('fs-extra');
const path = require('path');
const { clearCache } = require('./utils/index');

// 创建必备文件夹
const { DIR_OUTPUT_IMPORT_MSG, DIR_OUTPUT_PUBLIC_JSON_MSG } = require('./config.js');
fs.mkdirpSync(DIR_OUTPUT_IMPORT_MSG);
fs.mkdirpSync(DIR_OUTPUT_PUBLIC_JSON_MSG);
const { MSG_SLICE } = require('../src/common');

// console.log(process.env.NODE_ENV);

// j_fromServer 从服务器来的修改 这里一般是修改了 msg 和 commit  为了保证最快的生成 msg.json 跳过一些非必须的关键步骤
const jump = process.argv.filter(v => v.startsWith('j_'));

if (jump.length > 0) console.warn('🚀 jump step', jump);

exe('./mode.js');

if (!jump.includes('j_merger')) {
    console.time('⏱️ Merger');
    // !!! 涉及 html 修改的请 giveID 之前完成并固化, 因为 id 会包含 html 的 MD5

    // !!! Merger 会破坏源文件 注意备份
    if (!jump.includes('j_fromServer')) exe('./msgHandle/pre/bak.js');

    // 给ID
    if (!jump.includes('j_fromServer')) exe('./msgHandle/pre/giveID.js');

    // 生成 MSG_ORIGINAL.json
    if (!jump.includes('j_fromServer')) exe('./msgHandle/pre/merger.js');

    // 清空原始 msg 缓存, 确保从这里开始 不再修改原始的 msg,后续也不应该有修改后写入原始 msg 的动作
    if (!jump.includes('j_fromServer')) exe('./msgHandle/pre/saveMsgSingeFile.js');

    // 从这里开始已经是合并后的 msg.json 了
    // 通过和 filter.js 和 modify.js 去修改 MSG_ORIGINAL.json  得到  msg.json
    exe('./msgHandle/pre/filterAndModify.js');

    // 给 Index
    exe('./msgHandle/pre/giveIndex.js');

    // 和 ID 相关的参数建议固化而非在此修改  这里仅作为一些无关精要的修改 且不会被记录
    exe('./msgHandle/pre/fix.js');

    //  清理多余属性 及 msg  !!! 破坏性操作 !!!
    if (!jump.includes('j_fromServer')) exe('./msgHandle/pre/clear.js');

    // 生成时间范围
    if (!jump.includes('j_fromServer')) exe('./msgHandle/pre/makeDateRange.js');
    console.timeEnd('⏱️ Merger');
}
console.log('\n');

// 评论
if (!jump.includes('j_comment')) {
    console.time('⏱️ Comment');
    if (!MSG_SLICE) exe('./commentHandle/pre/fixMs.js');
    exe('./commentHandle/pre/make.js');

    // 检查评论 ID 和 评论文件
    // 只在未切割 msg 时生效检查
    if (!MSG_SLICE) exe('./commentHandle/check/idAndFile.js');

    exe('./commentHandle/pre/link.js');
    console.timeEnd('⏱️ Comment');
    console.log('\n');
}

// 统计中可能会修改 json 因为统计只在最终打包时运行一次 不在乎时间
// 因此从文件中拿，而不从内存中拿  msg.json .
// 达到 cloneDeep 的效果

// 这里清空 CACHE 全部写入文件
console.time('⏱️ ✍️');
clearCache(jump);
console.timeEnd('⏱️ ✍️');
console.log('\n');

// 统计
if (!jump.includes('j_fromServer') && !jump.includes('j_statistics')) {
    console.time('⏱️ statistics');
    exe('./msgHandle/statistics/init.js');
    exe('./msgHandle/statistics/innerData.js');
    // 读取 msg.json 处理
    // 生成 filter 字典
    exe('./msgHandle/statistics/msgDict.js');
    // 统计每天消息数
    exe('./msgHandle/statistics/dayNum.js');

    // 统计数量
    exe('./msgHandle/statistics/TotalPage.js');
    exe('./msgHandle/statistics/Heatmap.js');
    exe('./msgHandle/statistics/DataDay.js'); // 必须在 yearCount 之前
    exe('./msgHandle/statistics/yearCount.js');
    exe('./msgHandle/statistics/CallLog/Timeline-CallLog-duration.js');
    exe('./msgHandle/statistics/sourceCount.js'); // 最后

    // contrast
    exe('./msgHandle/statistics/contrast/countMsgWords/index.js');
    // exe('./msgHandle/statistics/contrast/pie.js');
    exe('./msgHandle/statistics/contrast/yearCount.js');
    exe('./msgHandle/statistics/contrast/wordCloud.js');
    exe('./msgHandle/statistics/contrast/sourceCount.js'); // 最后
    // 统计表情
    exe('./msgHandle/statistics/contrast/emotion/count.js');
    exe('./msgHandle/statistics/contrast/emotion/timeLine.js');
    exe('./msgHandle/statistics/contrast/emotion/yearCount.js');
    exe('./msgHandle/statistics/contrast/emotion/sourceCount.js');
    // 统计纯表情发帖
    exe('./msgHandle/statistics/contrast/emotion-pure/timeLine.js');
    exe('./msgHandle/statistics/contrast/emotion-pure/yearCount.js'); // 有额外的数据需要读取 ./msgHandle/statistics/TotalPage.js
    exe('./msgHandle/statistics/contrast/emotion-pure/sourceCount.js');

    // 评论统计
    exe('./commentHandle/statistics/innerData.js');
    exe('./commentHandle/statistics/DataDay.js');
    exe('./commentHandle/statistics/comment.js');
    exe('./commentHandle/statistics/comment-Heatmap.js');

    // 编辑
    exe('./commentHandle/statistics/modify.js');
    console.timeEnd('⏱️ statistics');
    console.log('\n');
}

// 检查
if (!jump.includes('j_check')) {
    console.time('⏱️ Check');
    // 检查 modify 移动到 Tool 文件夹中单独操作 checkModifyQQFace

    // 分析 modify 文件的ID 是否正确 其实这个没必要 因为 ID 不正确话 filterAndModify.js 中就会报错
    if (!MSG_SLICE && !jump.includes('j_fromServer')) exe('./msgHandle/check/checkModifyId.js');

    // 检查 v.day v.time 和  v.ms 是否对应
    if (!jump.includes('j_fromServer')) exe('./msgHandle/check/checkDayTime.js');

    // 根据 html 里面的 src href 分析
    if (!jump.includes('j_fromServer')) exe('./msgHandle/check/checkFileByHTML.js');
    // // 分析 type===文件 是否存在
    // if (!jump.includes('j_fromServer')) exe('./msgHandle/check/checkFileByFileParse.js');

    // 检查 msg.json
    if (!jump.includes('j_fromServer')) exe('./msgHandle/check/checkError.js');

    // 检查 key 是否正确
    if (!jump.includes('j_fromServer')) exe('./msgHandle/check/checkKey.js');

    // 检查 静态文件(source  type 图标等) 是否齐全
    if (!jump.includes('j_fromServer')) exe('./msgHandle/check/checkPublicStaticFile.js');

    // 检查 ID 是否有重复
    exe('./msgHandle/check/checkId.js');

    // 检查 index 是否正确
    exe('./msgHandle/check/checkIndex.js');

    // 检查 msg type 组件是否齐全 需要先生成 msgDict
    exe('./msgHandle/check/checkMsgType.js');

    console.timeEnd('⏱️ Check');
    console.log('\n');
}

console.timeEnd('⏱️ All');

// server 那边执行结束的标识符, 不要修改
console.log('ALL_IS_OK');

// 如果数据太大了 可能不便于开发 在这里截断
// exe('./utils/slice.js');

function sleep() {
    setTimeout(() => {}, 10000000);
}

function logError(...args) {
    console.error('\x1B[31m%s\x1B[0m', ...args);
}

function exe(file) {
    require(path.join(__dirname, file));
}
