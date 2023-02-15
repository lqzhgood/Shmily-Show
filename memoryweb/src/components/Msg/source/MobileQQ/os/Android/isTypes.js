const _ = require('lodash');
const { mixRules } = require('../../../../utils/index.js');
const { isMobileQQ_Android } = require('../../../../utils/isSource.js');

const {
    MobileQQ_Android_type_消息,
    MobileQQ_Android_type_系统消息,
    MobileQQ_Android_type_撤回,
    MobileQQ_Android_type_动作,
    MobileQQ_Android_type_位置,
    MobileQQ_Android_type_图片,
    MobileQQ_Android_type_分享,
    MobileQQ_Android_type_自定义表情,
    MobileQQ_Android_type_视频通话,
    MobileQQ_Android_type_视频,
    MobileQQ_Android_type_语音,
    MobileQQ_Android_type_文件,
    MobileQQ_Android_type__混合消息,
} = require('./types.js');

const is_MobileQQ_Android_type_消息 = m => m.type === MobileQQ_Android_type_消息;
const is_MobileQQ_Android_type_系统消息 = m => m.type === MobileQQ_Android_type_系统消息;
const is_MobileQQ_Android_type_撤回 = m => m.type === MobileQQ_Android_type_撤回;
const is_MobileQQ_Android_type_动作 = m => m.type === MobileQQ_Android_type_动作;
const is_MobileQQ_Android_type_位置 = m => m.type === MobileQQ_Android_type_位置;
const is_MobileQQ_Android_type_图片 = m => m.type === MobileQQ_Android_type_图片;
const is_MobileQQ_Android_type_分享 = m => m.type === MobileQQ_Android_type_分享;
const is_MobileQQ_Android_type_自定义表情 = m => m.type === MobileQQ_Android_type_自定义表情;
const is_MobileQQ_Android_type_视频通话 = m => m.type === MobileQQ_Android_type_视频通话;
const is_MobileQQ_Android_type_视频 = m => m.type === MobileQQ_Android_type_视频;
const is_MobileQQ_Android_type_语音 = m => m.type === MobileQQ_Android_type_语音;
const is_MobileQQ_Android_type_文件 = m => m.type === MobileQQ_Android_type_文件;

const is_MobileQQ_Android_type_混合消息 = m => _.get(m, '$MobileQQ.data.type') === MobileQQ_Android_type__混合消息;

module.exports = mixRules(
    {
        is_MobileQQ_Android_type_消息,
        is_MobileQQ_Android_type_系统消息,
        is_MobileQQ_Android_type_撤回,
        is_MobileQQ_Android_type_动作,
        is_MobileQQ_Android_type_位置,
        is_MobileQQ_Android_type_图片,
        is_MobileQQ_Android_type_分享,
        is_MobileQQ_Android_type_自定义表情,
        is_MobileQQ_Android_type_视频通话,
        is_MobileQQ_Android_type_视频,
        is_MobileQQ_Android_type_语音,
        is_MobileQQ_Android_type_文件,
        is_MobileQQ_Android_type_混合消息,
    },
    isMobileQQ_Android,
);
