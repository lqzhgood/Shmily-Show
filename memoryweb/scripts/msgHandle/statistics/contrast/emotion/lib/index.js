const mc = require('../../../../../../src/components/Msg/utils/isSource.js');

const { wechat } = require('./wechat.js');
const { qq_pc } = require('./qq-pc.js');
const { qq_mobile_android } = require('./qq_mobile_android.js');
const { qq_mobile_s60v3 } = require('./qq_mobile_s60v3.js');

function countEmotion(m) {
    if (mc.isWechat(m)) {
        return wechat(m);
    } else if (mc.isQQ(m)) {
        return qq_pc(m);
    } else if (mc.isMobileQQ_Android(m)) {
        return qq_mobile_android(m);
    } else if (mc.isMobileQQ_s60v3(m)) {
        return qq_mobile_s60v3(m);
    } else if (mc.isSMS(m)) {
        // 不用处理
        return null;
    } else if (mc.isCamera(m)) {
        // 不用处理
        return null;
    } else if (mc.isEmail(m)) {
        // 不用处理
        return null;
    } else if (mc.isCallLog(m)) {
        // 不用处理
        return null;
    } else {
        console.log('还有未处理的类型', m.source);
        return null;
    }
}

module.exports = {
    countEmotion,
};
