const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const modify = require('./modify-pre.json');
const MsgArr = require('../../src/assets/data/msg/msg-qq-pc.json');

const notImgTypeMd5Arr = [
    '05a7e60163b30cd8e0e47e79845de8c3',
    '0cb866c62b0a96b74be882958c79a463 ',
    '1cb042c1305c4593e148c3fbc3064c63',
    '224081b8537dbc66d192595a0d995ad7',
    '468c7f831f004712ab9fa10affa035f0',
    '4b47a2f4d525aad193ff65ad9a1623fb',
    '628073687d13f7a0f5694acd247be7f7',
    '6bd4c01ad40374e5a9be741808fe2748',
    '71fdaa878f30a2527be5c4cb64661de4',
    '75c76a5dac4aad478d1bb5948ea1dc32',
    '819402242c1f49b7300a1f560a5c02c4',
    '891ed913a1a3a9781bde2fd3c6fafd10',
    '93ecf0f47986f49782e7609681b60380',
    '9c749c221eb14c0cbcddc3345bfe02ea',
    'a3116028d605873eed48bcd99b947581',
    'a731ec7b8374adec5f2f141ecb0f9688',
    'ad64e423e630a7c418520c8e8ce5f8a1',
    'b33ed64c992c47591ebcb82ff551949c',
    'b5be7a15d8e29a36f5d6cca011564957',
    'b606cd6c1bfb3ac46a7868d4a37c88f3',
    'da91e3414b1ec43bf12209c2b98e9d2f',
    'e6106e8e22732710e691539e4e445873',
    'e6c37cfb8d02d04d618e1a4541cf214f',
];

for (let i = 0; i < modify.length; i++) {
    const m = modify[i];
    if (m.type !== 'modify' && m.source !== 'QQ') continue;

    const { oMsg, nMsg } = m;

    if (oMsg.source !== nMsg.source) {
        console.log('oMsg,nMsg', oMsg, nMsg);
    }

    // const oId = oMsg.id;

    // const f = MsgArr.find(v => v.id === oId);
    // if (f && f.type === '图片') {
    //     oMsg.type = '图片';
    //     nMsg.type = '图片';
    // }

    const $ = cheerio.load(nMsg.html, { decodeEntities: false }, null);

    const imgs = $('img').filter((i, n) => {
        const { src, alt, title } = n.attribs;

        return (
            src.includes('/data/qq-pc/img/') &&
            !notImgTypeMd5Arr.some(md5 => md5 === path.parse(src).name.toLowerCase())
        );
    });
    if (imgs.length > 0) m.nMsg.type = '图片';
}

fs.writeFileSync('./modify.json', JSON.stringify(modify, null, 4));
