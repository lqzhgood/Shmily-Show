/**
 * @name:
 * @description:
 * @param {*} msg
 * @param {*} content
 * @param {*} html
 * @param {*} imgAlt QQ 图片的描述形式 如 [大笑], 区别于现在的 [QQ经典-大笑]
 * @return {*}
 */

const nullImgSrc = ['<img src="lostImg_0">', '<img src="./data/qq-pc/2180ee73c1c30b6604c98102af9a844e.png">'];

// 2180ee73c1c30b6604c98102af9a844e 就是裂开的图
exports.modifyImgMsg = function (msg, content, html, imgOldAlt) {
    // 没有图片的消息直接替换并提交(accurateFix = true)，有内容的消息则 += 附加后面
    let accurateFix = false;
    if (nullImgSrc.includes(msg.html) && msg.content === '[图]') {
        msg.html = html;
        msg.content = content;
        accurateFix = true;
    } else if (msg.content === content || msg.content === `[${imgOldAlt}]`) {
        // [type-alt] === [type-alt] || [alt] === [alt]
        msg.html = html;
        msg.content = content;
        accurateFix = true;
    } else if (msg.content === '' && msg.html === '') {
        msg.html = html;
        msg.content = content;
        accurateFix = true;
    } else {
        msg.html += html;
        msg.content += content;
    }
    return { msg, accurateFix };
};
