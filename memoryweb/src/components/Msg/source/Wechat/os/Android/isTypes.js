const _ = require('lodash');
const { mixRules } = require('../../../../utils/index.js');
const { isWechat } = require('../../../../utils/isSource.js');

// prettier-ignore
const {
     Wechat_Android_type_分享,
     Wechat_Android_type_红包,
     Wechat_Android_type_聊天记录,
     Wechat_Android_type_名片,
     Wechat_Android_type_视频,
     Wechat_Android_type_视频通话,
     Wechat_Android_type_图片,
     Wechat_Android_type_微信运动,
     Wechat_Android_type_位置,
     Wechat_Android_type_位置共享,
     Wechat_Android_type_文件,
     Wechat_Android_type_系统消息,
     Wechat_Android_type_消息,
     Wechat_Android_type_小程序,
     Wechat_Android_type_语音,
     Wechat_Android_type_转账,
     Wechat_Android_type_自定义表情,
     Wechat_Android_type_撤回,
     Wechat_Android_type_视频号,
     Wechat_Android_type_收藏,
     Wechat_Android_type__分享_视频,
     Wechat_Android_type__系统消息_群聊_入群消息,
     Wechat_Android_type__消息_发起语音通话,
} = require('./types.js');

const is_Wechat_Android_type_分享 = m => m.type === Wechat_Android_type_分享;
const is_Wechat_Android_type_红包 = m => m.type === Wechat_Android_type_红包;
const is_Wechat_Android_type_聊天记录 = m => m.type === Wechat_Android_type_聊天记录;
const is_Wechat_Android_type_名片 = m => m.type === Wechat_Android_type_名片;
const is_Wechat_Android_type_视频 = m => m.type === Wechat_Android_type_视频;
const is_Wechat_Android_type_视频通话 = m => m.type === Wechat_Android_type_视频通话;
const is_Wechat_Android_type_图片 = m => m.type === Wechat_Android_type_图片;
const is_Wechat_Android_type_微信运动 = m => m.type === Wechat_Android_type_微信运动;
const is_Wechat_Android_type_位置 = m => m.type === Wechat_Android_type_位置;
const is_Wechat_Android_type_位置共享 = m => m.type === Wechat_Android_type_位置共享;
const is_Wechat_Android_type_文件 = m => m.type === Wechat_Android_type_文件;
const is_Wechat_Android_type_系统消息 = m => m.type === Wechat_Android_type_系统消息;
const is_Wechat_Android_type_消息 = m => m.type === Wechat_Android_type_消息;
const is_Wechat_Android_type_小程序 = m => m.type === Wechat_Android_type_小程序;
const is_Wechat_Android_type_语音 = m => m.type === Wechat_Android_type_语音;
const is_Wechat_Android_type_转账 = m => m.type === Wechat_Android_type_转账;
const is_Wechat_Android_type_自定义表情 = m => m.type === Wechat_Android_type_自定义表情;
const is_Wechat_Android_type_撤回 = m => m.type === Wechat_Android_type_撤回;
const is_Wechat_Android_type_视频号 = m => m.type === Wechat_Android_type_视频号;
const is_Wechat_Android_type_收藏 = m => m.type === Wechat_Android_type_收藏;

const is_Wechat_Android_type__分享_视频 = m => _.get(m, '$Wechat.type') === Wechat_Android_type__分享_视频;
const is_Wechat_Android_type__系统消息_群聊_入群消息 = m => _.get(m, '$Wechat.type') === Wechat_Android_type__系统消息_群聊_入群消息;
const is_Wechat_Android_type__消息_发起语音通话 = m => _.get(m, '$Wechat.type') === Wechat_Android_type__消息_发起语音通话;

module.exports = mixRules(
    {
        is_Wechat_Android_type_分享,
        is_Wechat_Android_type_红包,
        is_Wechat_Android_type_聊天记录,
        is_Wechat_Android_type_名片,
        is_Wechat_Android_type_视频,
        is_Wechat_Android_type_视频通话,
        is_Wechat_Android_type_图片,
        is_Wechat_Android_type_微信运动,
        is_Wechat_Android_type_位置,
        is_Wechat_Android_type_位置共享,
        is_Wechat_Android_type_文件,
        is_Wechat_Android_type_系统消息,
        is_Wechat_Android_type_消息,
        is_Wechat_Android_type_小程序,
        is_Wechat_Android_type_语音,
        is_Wechat_Android_type_转账,
        is_Wechat_Android_type_自定义表情,
        is_Wechat_Android_type_撤回,
        is_Wechat_Android_type_视频号,
        is_Wechat_Android_type_收藏,

        is_Wechat_Android_type__分享_视频,
        is_Wechat_Android_type__系统消息_群聊_入群消息,
        is_Wechat_Android_type__消息_发起语音通话,
    },
    isWechat
);
