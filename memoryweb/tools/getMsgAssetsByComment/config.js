const fs = require('fs-extra');
const path = require('path');

const config = {
    msgArr: require(path.join(__dirname, '../../public/json/msg/msg.json')),
    commentArr: require(path.join(__dirname, '../../public/json/comment/comments.json')),

    SEARCH_KEY: '#小动物', // 搜索的关键词
    SEARCH_FIELD: 'content', // 搜索的字段  html or content

    ASSETS_DIR: path.join(__dirname, '../../../msgData/'), // 资源文件夹
    TARGET_DIR: path.join(__dirname, './dist/'), // 目标文件夹

    // 忽略的文件夹
    IGNORE_DIR: [
        // 无意义的 emoji
        '1cb042c1305c4593e148c3fbc3064c63',
        '2180ee73c1c30b6604c98102af9a844e',
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
        'da91e3414b1ec43bf12209c2b98e9d2f',
        'e6106e8e22732710e691539e4e445873',
        'e6c37cfb8d02d04d618e1a4541cf214f',

        // 丢失的文件
        'lostImg_',

        // 表情
        '/data/qq-android/emoji/',
        '/data/qq-pc/face/',
        '/data/qq-s60/face/',
    ],
};

fs.mkdirpSync(config.TARGET_DIR);

module.exports = config;
