const fs = require('fs-extra');
const path = require('path');
const _ = require('lodash');

const { DIR_OUTPUT_PUBLIC_JSON_STATISTIC } = require('../../../../config');
const { msgJsonAll, msgJsonCome, msgJsonGo } = require('../../const.js');

const {
    SOURCE_TYPE_CONTRAST,
    EMOTIONS_DB_TYPE_PACK_NAME,
    EMOTIONS_DB_TYPE_DES,
    DIRECTION_TYPE_ALL,
    DIRECTION_TYPE_COME,
    DIRECTION_TYPE_GO,
} = require('../../../../../src/views/Statistic/const.js');

const { countEmotion } = require('./lib/index.js');
const { isSameMd5 } = require('./lib/utils.js');
const { numToPercent } = require('../../../../../src/common.js');

// package
// const p = {
//     count: 0,
//     packList: [
//         {
//             packName: '',
//             count: 0,
//             desList: [
//                 {
//                     des: '',
//                     count: 0,
//                     files: [
//                         {
//                             url: '',
//                             name: '', // 多半是 md5
//                             count: 0,
//                         },
//                     ],
//                 },
//             ],
//         },
//     ],
// };

const MD5_REG = /[a-fA-F0-9]{32}/;

console.time('emotion-count');
calc(msgJsonAll, DIRECTION_TYPE_ALL);
calc(msgJsonCome, DIRECTION_TYPE_COME);
calc(msgJsonGo, DIRECTION_TYPE_GO);
console.timeEnd('emotion-count');

function calc(calcArr, directionType) {
    const outDir = path.join(DIR_OUTPUT_PUBLIC_JSON_STATISTIC, `./${SOURCE_TYPE_CONTRAST}/${directionType}/emotion/`);
    fs.mkdirpSync(outDir);

    const packRes = calcArr.reduce(
        (pre, m) => {
            const infoArr = countEmotion(m);
            if (infoArr && infoArr.length > 0) {
                infoArr.forEach(info => {
                    const { packName, des, url } = info;

                    let packInfo = pre.packList.find(p => p.packName === packName);
                    if (!packInfo) {
                        packInfo = {
                            packName,
                            count: 0,
                            desList: [],
                        };
                        pre.packList.push(packInfo);
                    }

                    let desInfo = packInfo.desList.find(d => d.des === des);
                    if (!desInfo) {
                        desInfo = {
                            packName,
                            des,
                            count: 0,
                            files: [],
                        };
                        packInfo.desList.push(desInfo);
                    }

                    // 表情文件多为 MD5 开头, 按照 MD5 合并同类文件
                    const name = url ? path.parse(url).name.toLowerCase() : null;
                    info.name = name;
                    const md5 = isSameMd5(MD5_REG.test(name) ? name.match(MD5_REG)[0] : name);
                    info.md5 = md5;

                    let fileInfo = desInfo.files.find(f => f.md5 === md5);
                    if (!fileInfo) {
                        fileInfo = {
                            url,
                            count: 0,
                            name,
                            md5,
                        };
                        desInfo.files.push(fileInfo);
                    }

                    pre.packList = _.sortBy(pre.packList, 'count').reverse();
                    packInfo.desList = _.sortBy(packInfo.desList, 'count').reverse();
                    desInfo.files = _.sortBy(desInfo.files, 'count').reverse();

                    // !!! debug
                    // if (packName !== '其他' && desInfo.files.length > 1) {
                    //     console.log('', packName, des);
                    // }

                    packInfo.count++;
                    desInfo.count++;
                    fileInfo.count++;

                    pre.emotionCount++;
                });
            }
            return pre;
        },
        {
            packCount: 0,
            desCount: 0,
            emotionCount: 0,
            packList: [],
        },
    );

    // 写入百分比等一些统计
    packRes.packCount = packRes.packList.length;
    packRes.desCount = packRes.packList.reduce((pp, cV) => pp + cV.desList.length, 0);
    packRes.packList.forEach(p => {
        p.p = numToPercent(p.count / packRes.emotionCount, 1);
        p.desList.forEach(d => {
            d.p = numToPercent(d.count / packRes.emotionCount, 1);
            d.files.forEach(f => {
                f.p = numToPercent(f.count / packRes.emotionCount, 1);
                // console.log('f', f, f.count, packRes.emotionCount, f.p);
            });
        });
    });

    // 把其他放到最后
    {
        const oIndex = packRes.packList.findIndex(p => p.packName === '其他');
        packRes.packList.push(...packRes.packList.splice(oIndex, 1));
        packRes.packList = packRes.packList.map((v, i) => {
            if (v.packName === '其他') {
                v.index = '-';
            } else {
                v.index = i + 1;
            }
            return v;
        });

        fs.writeFileSync(path.join(outDir, `${EMOTIONS_DB_TYPE_PACK_NAME}.json`), JSON.stringify(packRes, null, 4));
    }

    const desRes = {
        packCount: packRes.packCount,
        desCount: packRes.desCount,
        emotionCount: packRes.emotionCount,
        desList: _.sortBy(
            packRes.packList.reduce((pre, p) => {
                pre.push(...p.desList);
                return pre;
            }, []),
            'count',
        ).reverse(),
    };

    {
        const oIndex = desRes.desList.findIndex(d => d.des === '未知');
        desRes.desList.push(...desRes.desList.splice(oIndex, 1));

        desRes.desList = desRes.desList.map((v, i) => {
            if (v.packName === '其他' && v.des === '未知') {
                v.index = '-';
            } else {
                v.index = i + 1;
            }
            return v;
        });

        fs.writeFileSync(path.join(outDir, `${EMOTIONS_DB_TYPE_DES}.json`), JSON.stringify(desRes, null, 4));
    }
}
