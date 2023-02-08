const cheerio = require('cheerio');
const path = require('path');

const { copy } = require('../utils.js');

const mc = require('../../../src/components/Msg/utils/isSource.js');

const { wechat } = require('./wechat.js');
const { qq_pc } = require('./qq-pc.js');
const { qq_mobile_android } = require('./qq_mobile_android.js');
const { qq_mobile_s60v3 } = require('./qq_mobile_s60v3.js');
const { sms } = require('./sms.js');
const { camera } = require('./camera.js');
const { email } = require('./email.js');

function copyMsgAssets(m) {
    if (mc.isWechat(m)) {
        wechat(m);
    } else if (mc.isQQ(m)) {
        qq_pc(m);
    } else if (mc.isMobileQQ_Android(m)) {
        qq_mobile_android(m);
    } else if (mc.isMobileQQ_s60v3(m)) {
        qq_mobile_s60v3(m);
    } else if (mc.isSMS(m)) {
        sms(m);
    } else if (mc.isCamera(m)) {
        camera(m);
    } else if (mc.isEmail(m)) {
        email(m);
    } else if (mc.isCallLog(m)) {
        // 不用处理
    } else {
        console.log('未知的类型', m.source);
    }
}

function copyCommentAssets(c, m) {
    const $ = cheerio.load(c.html, { decodeEntities: false }, false);

    Array.from($('video')).forEach(elm => {
        const { src, poster } = elm.attribs;
        if (src) copy(m, src);
        if (poster) copy(m, poster);
    });

    Array.from($('audio')).forEach(elm => {
        const { src } = elm.attribs;
        if (src) copy(m, src);
    });

    Array.from($('img')).forEach(elm => {
        const { src } = elm.attribs;
        if (src) copy(m, src);
    });

    Array.from($('a')).forEach(elm => {
        const { href } = elm.attribs;
        if (href && href.includes('data/comments')) {
            const { ext } = path.parse(href);

            // html 可能会有 ?query 值
            if (['.htm', '.html'].find(e => ext.startsWith(e))) return;

            switch (ext.toLocaleLowerCase()) {
                case '.jpg':
                case '.png':
                case '.gif':
                case '.mp4':
                case '.wav':
                case '.7z':
                case '.rar':
                case '.zip':
                case '.doc':
                case '.docx':
                case '.xls':
                case '.xlsx':
                case '.ppt':
                case '.pptx':
                case '.pdf':
                case '.wmv':
                    copy(m, href);
                    break;
                case '.apk':
                    // 不复制
                    break;
                default:
                    console.log('unknown comment assets ext', ext);
                    break;
            }
        }
    });
}

module.exports = {
    copyMsgAssets,
    copyCommentAssets,
};
