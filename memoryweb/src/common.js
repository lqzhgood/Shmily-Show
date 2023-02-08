/*
 * @Description: script 和 前端共有的纯 js 工具函数（不要引入 nodejs 和 浏览器 独有库）
                使用 require 写法， 前端有具会处理 import
                node script 不能处理 import
 * @Author: lqzh
 * @Date: 2021-04-27 16:17:11
 * @LastEditTime: 2022-09-22 00:19:49
 */

const _ = require('lodash');

// [packName-des] packName des 长度为 1-20 之间, 且不包含 \n \r [ ] 字符
// eslint-disable-next-line no-useless-escape
exports.MATCH_EMOTION_ALT = /\[[^\n\r\[\]]{1,20}?-[^\r\n\[\]]{1,20}?\]/gi;

/**
 * @name: 数字转百分比
 * @description: 边界情况处理 除非是 0 或 100 否侧不能是 0% 和 100%
 * @param {*} num
 * @param {*} decimal
 * @return {*}
 */
exports.numToPercent = function (num, decimal = 0) {
    if (isNaN(num)) {
        if (typeof num !== 'number') {
            console.warn('numToPercent is not number', num);
        }
        return '-';
    }

    let p = (num * 100).toFixed(decimal);

    const precision = Math.pow(10, decimal * -1);

    // A 0.01 -> toFixed(0)  === 0
    // B 0.05 --> toFixed(0) === 0
    if (Number(p) == 0 && Number(num) != 0) {
        // A 0.01 -> toFixed(1) === 0
        // B 0.05 --> toFixed(1) === 0.1
        p = (num * 100).toFixed(decimal + 1);
        if (Number(p) == 0) {
            // A 0.1
            // p = 0 + precision * 0.1;
            p = computeNumber(0, '+', computeNumber(precision, '*', 0.1).result).result;
        }
    }

    // A 99.5 -> toFixed(0) === 100
    // B 99.95 --> toFixed(0) === 100
    if (Number(p) == 100 && Number(num) != 1) {
        // A 99.5 -> toFixed(1) === 99.5
        // B 99.95 -> toFixed(1) === 100
        p = (num * 100).toFixed(decimal + 1);
        if (Number(p) == 100) {
            // B 99.9
            // p = 100 - precision * 0.1;
            p = computeNumber(100, '-', computeNumber(precision, '*', 0.1).result).result;
        }
    }

    // numToPercent(0.0000001,1) === 0.010000000000000002
    return p;
};

/**
 * 数字运算（主要用于小数点精度问题）
 * [see](https://juejin.im/post/6844904066418491406#heading-12)
 * @param {number} a 前面的值
 * @param {"+"|"-"|"*"|"/"} type 计算方式
 * @param {number} b 后面的值
 * @example
 * ```js
 * // 可链式调用
 * const res = computeNumber(1.3, "-", 1.2).next("+", 1.5).next("*", 2.3).next("/", 0.2).result;
 * console.log(res);
 * ```
 */
function computeNumber(a, type, b) {
    /**
     * 获取数字小数点的长度
     * @param {number} n 数字
     */
    function getDecimalLength(n) {
        const decimal = n.toString().split('.')[1];
        return decimal ? decimal.length : 0;
    }
    /**
     * 修正小数点
     * @description 防止出现 `33.33333*100000 = 3333332.9999999995` && `33.33*10 = 333.29999999999995` 这类情况做的处理
     * @param {number} n
     */
    const amend = (n, precision = 15) => parseFloat(Number(n).toPrecision(precision));
    const power = Math.pow(10, Math.max(getDecimalLength(a), getDecimalLength(b)));
    let result = 0;

    a = amend(a * power);
    b = amend(b * power);

    switch (type) {
        case '+':
            result = (a + b) / power;
            break;
        case '-':
            result = (a - b) / power;
            break;
        case '*':
            result = (a * b) / (power * power);
            break;
        case '/':
            result = a / b;
            break;
    }

    result = amend(result);

    return {
        /** 计算结果 */
        result,
        /**
         * 继续计算
         * @param {"+"|"-"|"*"|"/"} nextType 继续计算方式
         * @param {number} nextValue 继续计算的值
         */
        next(nextType, nextValue) {
            return computeNumber(result, nextType, nextValue);
        },
    };
}

//msg-qq-pc.json_2012-04-19_19-58-00_c_ee46a5_1
const MATCH_ID_REG = /.+\.json_(\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2})_[c|g]_[A-Za-z0-9]{6}_\d{1,2}$/;

exports.MATCH_ID_REG = MATCH_ID_REG;
exports.makeInnerTextById = id => {
    const str = id.match(MATCH_ID_REG)[1];
    const [d, t] = str.split('_');
    return `${d} ${t.replaceAll('-', ':')}`;
};

// 2180ee73c1c30b6604c98102af9a844e 是错误的图
// dc5ede7b03528d416d76100bef428a8d 是没有的图
exports.getPublicFileDirByHtml = function (html = '') {
    return (html.match(/(href|src)=["|'](.*?)["|']/gim) || [])
        .map(s => {
            let u = s.replace(/^(href|src)=["|']/, '').replace(/["|']$/, '');
            try {
                u = decodeURI(u);
            } catch (error) {
                console.warn(`url无法decode ${u}`);
            }
            return u;
        })
        .filter(s => ['./data', '/data', 'data'].some(ss => s.startsWith(ss)));
};

/**
 * @name: 对特定筛选项进项排序
 * @description: 显示的时候更合理
 * @param {*} dict
 * @param {*} type 两种模式 DICT 和 FORM 不一样
 * @return {*} sort dict`
 */
exports.sortSearchDictAndForm = function (dict, type) {
    for (const k in dict) {
        if (Object.hasOwnProperty.call(dict, k)) {
            const v = dict[k];
            // 由于 'direction' 只有 'come' 'go' 两个
            // 所以如果长度是两个则直接修改数组即可限定顺序
            // 不能直接赋值数组 这样会改变 "引用"
            if (k === 'direction' && v.length === 2) {
                if (v.length > 2) throw new Error('direction 只应该存在 go 和 come');
                v.splice(0, v.length);
                v.push('come', 'go');
            }

            if (k === 'source') {
                v.forEach(s => {
                    s.type = s.type.sort((a, b) => a.localeCompare(b));
                });
            }

            // 普通排序
            if (['device'].includes(k)) {
                dict.device = v.sort((a, b) => a.localeCompare(b.name));
            }

            if (['send', 'receive'].includes(k)) {
                if (type === 'DICT') {
                    for (let i = 0; i < v.length; i++) {
                        const o = v[i];
                        if (!o.children) continue;
                        if (k === 'send') {
                            o.children = _.sortBy(o.children, 'sender');
                        } else if (k === 'receive') {
                            o.children = _.sortBy(o.children, 'receiver');
                        }
                    }
                } else if (type === 'FORM') {
                    dict[k] = _.sortBy(dict[k], 'name');
                    if (k === 'send') {
                        dict[k] = _.sortBy(dict[k], 'sender');
                    } else if (k === 'receive') {
                        dict[k] = _.sortBy(dict[k], 'receiver');
                    }
                } else {
                    throw new Error('type 只能是 DICT 或 FORM');
                }
            }
        }
    }
    return dict;
};

/**
 * @name: 从 faceArr 中通过 md5 找到表情
 * @description:
 * @param {*} md5
 * @param {*} faceArr
 * @return {*}
 */
exports.findByFaceArr = function (md5, faceArr) {
    let findF;
    const find = faceArr.find(v => {
        const { files } = v;
        const f = files.some(_f => {
            if (_f.md5 === md5) {
                findF = _f;
                return true;
            }
            if (_f.alias) {
                return _f.alias.some(s => {
                    if (s.md5 === md5) {
                        findF = _f; // 如果在 Alias 里面找到,还是返回 Alias 的父对象
                        return true;
                    }
                    return false;
                });
            }
            return false;
        });
        return f;
    });
    return { face: find, file: findF };
};

exports.IS_NEED_DELETE_FLAG = '___IS_NEED_DELETE___';
exports.IS_COMMENT_INNER_LINK_FLAG = '___IS_COMMENT_VNODE_INNER_LINK_FLAG___';

/**
 * @name: 是否使用切割的 msg.json
 * @description: 多用于测试 / 修改 msg/comment ，因为 msg.json 可能太大了
 * @param {*}  如果不需要切割 则 MSG_SLICE 置为 null
 * @return {*}
 */
exports.MSG_SLICE = {
    S: 190000,
    E: 190500,

    // S: 100000 - 1050,

    // S: 215080,
    // E: 230000,
    // S: 0,
};

exports.MSG_SLICE = null;
