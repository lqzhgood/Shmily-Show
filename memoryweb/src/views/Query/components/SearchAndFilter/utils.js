import _ from 'lodash';

import { replaceSpecialKeyInStrToRegExp, deepFreeze } from '@/utils/index.js';
import { CONST_SEARCH_TYPE_MSG, CONST_SEARCH_TYPE_COMMENT } from '@/utils/const.js';
import MSG_DICT from '@/assets/data_pre/msg/msgDict.json';

const msgCategory = require('@/components/Msg/utils/isSource.js');

export const DEFAULT_SEARCH_FORM = deepFreeze(_.cloneDeep(makeDefaultSearchForm(MSG_DICT)));

/**
 * @name:
 * @description: 搜搜字符串解析关键词组成多维度匹配
 *                rKey 正则匹配
 *                iKey 包含匹配
 *                eKey 排除匹配
 * @param {*} str
 * @return {*}
 */
export function makeSearchKeyTypeArr(str) {
    const keyArr = str
        .trim()
        .split(' ')
        .map(v => v.trim())
        .filter(v => v);

    const rKey = []; // 正则
    const iKey = []; // 包含
    const eKey = []; // 排除

    for (let i = 0; i < keyArr.length; i++) {
        let k = keyArr[i];

        if (k.startsWith('-Reg:')) {
            try {
                const reg = eval(k.replace(/^-Reg:/, ''));
                if (_.isRegExp(reg)) {
                    rKey.push(reg);
                }
            } catch (error) {
                console.log(`搜索条件正则输入错误 忽略 ${k}`);
            }
        } else {
            k = replaceSpecialKeyInStrToRegExp(k);
            if (k.startsWith('-')) {
                eKey.push(k.substring(1));
            } else {
                iKey.push(k);
            }
        }
    }

    const keyArrByType = { isFilter: true, rKey, iKey, eKey };
    keyArrByType.isFilter = Object.values(keyArrByType).flat().length !== 0;
    return keyArrByType;
}

function keyArrMatchString(keyArrByType, str) {
    const { rKey, iKey, eKey } = keyArrByType;

    for (let i = 0; i < rKey.length; i++) {
        const k = rKey[i];
        if (!k.test(str)) return false;
    }

    // 排除的一般比较少 如果匹配到直接 false
    for (let i = 0; i < eKey.length; i++) {
        const ek = eKey[i];
        const testReg = new RegExp(ek, 'gmi');
        if (testReg.test(str)) return false;
    }

    for (let i = 0; i < iKey.length; i++) {
        const ik = iKey[i];
        const testReg = new RegExp(ik, 'gmi');
        if (!testReg.test(str)) return false;
    }
    return true;
}

export function filterByKeyArr(keyArrByType, canSearchArr, field) {
    // 顺序查找  ABCD  AC->√  CA->×
    // const testReg = new RegExp(`(${keyArr.join(`(.*?)`)})`, 'gmi');
    // return keyArr.length === 0 ? canSearchArr : canSearchArr.filter(o => testReg.test(o[field]));

    // 非顺序查找  ABCD  AC->√  CA->√
    return keyArrByType.isFilter ? canSearchArr.filter(o => keyArrMatchString(keyArrByType, o[field])) : canSearchArr;
}

export function getCommentAllRelatedMsg(msgAll, commentArr) {
    let msgArr = [];
    for (let i = 0; i < commentArr.length; i++) {
        const c = commentArr[i];
        const msgPart = getMsgByComment(msgAll, c, true);
        msgArr = msgArr.concat(msgPart);
    }
    return msgArr;
}

function getMsgByComment(msgAll, comment, relatedAllMsg = false) {
    const { msgIndex, msgIndexEnd } = comment;
    if (relatedAllMsg) {
        return msgAll.slice(msgIndex, msgIndexEnd + 1);
    } else {
        return msgAll[msgIndex];
    }
}

export function makeDefaultSearchForm(DICT) {
    return {
        time: DICT.time,
        type: DICT.source.reduce((pre, s) => {
            pre[s.label] = [...s.type];
            return pre;
        }, {}),
        device: [...DICT.device],
        direction: [...DICT.direction],
        send: DICT.send.reduce((pre, cV) => {
            pre = pre.concat(cV.children);
            return pre;
        }, []),
        receive: DICT.receive.reduce((pre, cV) => {
            pre = pre.concat(cV.children);
            return pre;
        }, []),
        $CallLog: { data: { duration: [...DICT.$CallLog.data.duration] } },
    };
}

/**
 * @name: 快速判断筛选项是否有修改
 * @description: 由于 option Arr 只减不增， | k-v value一直有值
 *               那么只需要判断 form oArr.length 是否和 full oArr.length 一致即可
 * @param {*} full form 最全状态的值
 * @param {*} form 是否修改的 form
 * @return {*} Boolean true 未修改 false 已修改
 */
export function searchFormIsSame(form) {
    const full = DEFAULT_SEARCH_FORM;
    for (const k in full) {
        if (Object.hasOwnProperty.call(full, k)) {
            const formV = form[k];
            if (!formV) return false;
            const fullV = full[k];

            switch (k) {
                // 特殊字段判断
                case 'time':
                    if (fullV.join('&') !== formV.join('&')) return false;
                    break;
                case '$CallLog':
                    if (fullV.data.duration.join('&') !== formV.data.duration.join('&')) return false;
                    break;
                case 'type': {
                    const fullTypeKeys = Object.keys(fullV);
                    const formTypeKeys = Object.keys(formV);
                    if (fullTypeKeys.length !== formTypeKeys.length) return false;
                    for (let j = 0; j < fullTypeKeys.length; j++) {
                        const fullTypeV = fullV[fullTypeKeys[j]];
                        const formTypeV = formV[formTypeKeys[j]];
                        if (fullTypeV.length !== formTypeV.length) return false;
                    }
                    break;
                }
                // 值是数组 那么只比较长度
                case 'device':
                case 'direction':
                case 'send':
                case 'receive':
                    if (fullV.length != formV.length) return false;
                    break;
                default:
                    console.error(`searchFormIsFull 有未处理的 key ${k}`);
                    throw new Error('searchFormIsFull 有未处理的 key');
            }
        }
    }

    return true;
}

function flatSearchForm(formType) {
    return Object.keys(formType).reduce((pre, tKey, cI, arr) => {
        pre = pre.concat(formType[tKey].map(t => ({ source: tKey, type: t })));
        return pre;
    }, []);
}

// 这些定值预先计算好 减少 search 时间
const DEFAULT_SEARCH_FORM_VALUE_TYPE = flatSearchForm(DEFAULT_SEARCH_FORM.type).length;
const DEFAULT_SEARCH_FORM_VALUE_DEVICE = DEFAULT_SEARCH_FORM.device.length;
const DEFAULT_SEARCH_FORM_VALUE_DIRECTION = DEFAULT_SEARCH_FORM.direction.length;
const DEFAULT_SEARCH_FORM_VALUE_SEND = DEFAULT_SEARCH_FORM.send.length;
const DEFAULT_SEARCH_FORM_VALUE_RECEIVE = DEFAULT_SEARCH_FORM.receive.length;

/**
 * @name:
 * @description: 根据过滤条件生成数组 简单的放前面
 *              lodash some 比 js some 快 https://v2ex.com/t/870035
 * @param {*} all
 * @param {*} form
 * @return {*}
 */
export function filterMsgArr(all, form) {
    const { time: sTime, device: sDevice, direction: sDirection, send: sSend, receive: sReceive, $CallLog } = form;
    const sDuration = $CallLog.data.duration;

    const sType = flatSearchForm(form.type);

    const needFilterSourceAndType = sType.length !== DEFAULT_SEARCH_FORM_VALUE_TYPE;
    const needFilterTime = !_.isEqual(sTime, DEFAULT_SEARCH_FORM.time);
    const needFilterDevice = sDevice.length !== DEFAULT_SEARCH_FORM_VALUE_DEVICE;
    const needFilterDirection = sDirection.length != DEFAULT_SEARCH_FORM_VALUE_DIRECTION;
    const needFilterSender = sSend.length != DEFAULT_SEARCH_FORM_VALUE_SEND;
    const needFilterReceiver = sReceive.length != DEFAULT_SEARCH_FORM_VALUE_RECEIVE;
    const needFilterCallLog =
        sDuration.join('&') !== DEFAULT_SEARCH_FORM.$CallLog.data.duration.join('&') &&
        sType.some(v => v.source === 'CallLog');

    const arr = all.filter((msg, index) => {
        // 顺序决定计算量 == 速度 按常用顺序排序

        if (needFilterSourceAndType) {
            const f_SourceAndType = _.some(sType, v => v.source === msg.source && v.type === msg.type);
            if (!f_SourceAndType) return false;
        }

        if (needFilterTime) {
            const f_time = sTime ? msg.ms >= sTime[0] && msg.ms <= sTime[1] : true;
            if (!f_time) return false;
        }

        if (needFilterDevice) {
            const f_device = sDevice.includes(msg.device);
            if (!f_device) return false;
        }

        if (needFilterDirection) {
            const f_direction = sDirection.includes(msg.direction);
            if (!f_direction) return false;
        }

        // 只判断有 sender/receiver 的, 例如 Camera 没有 sender/receiver 则跳过
        // msg 中 sender 和 receiver 应该同时存在 或 同时不存在
        if ('sender' in msg && 'receiver' in msg) {
            let f_send = true;
            if (needFilterSender) {
                f_send = _.some(sSend, v => v.sender === msg.sender && v.senderName === msg.senderName);
            }

            let f_receive = true;
            // 如果找到 sender 就不需要再找 receiver 了.
            if (needFilterReceiver && !f_send) {
                f_receive = _.some(sReceive, v => v.receiver === msg.receiver && v.receiverName === msg.receiverName);
            }
            // !!! send receive 应该是 || 而不是 && 的关系
            // sender 和 receive 都不匹配 才算不匹配
            if (!f_send && !f_receive) return false;
        }

        if (needFilterCallLog && msgCategory.isCallLog(msg)) {
            const cD = msg.$CallLog.data.duration;
            const f_duration = cD >= sDuration[0] && cD <= sDuration[1];
            if (!f_duration) return false;
        }

        return true;
    });

    return arr;
}

export function searchHandler(canSearchArr, localSearch, options = {}) {
    console.time('search');

    let { keyArrByType } = options;
    const { type, key, form } = localSearch;
    if (!keyArrByType) {
        keyArrByType = makeSearchKeyTypeArr(key);
    }
    // 先搜索关键词类容 再按类型筛选
    let arr = filterByKeyArr(keyArrByType, canSearchArr, 'content');

    if (type === CONST_SEARCH_TYPE_MSG) {
        // 如果筛选项没有变动直接使用原数组
        if (!searchFormIsSame(form)) {
            arr = filterMsgArr(arr, form);
        }
    } else if (type === CONST_SEARCH_TYPE_COMMENT) {
        // 评论不参与 form 的筛选
    } else {
        throw new Error('unknown search type');
    }
    console.timeEnd('search');
    return arr;
}

export function makeCanSearchArr(type, arr) {
    switch (type) {
        case CONST_SEARCH_TYPE_MSG:
            return arr;
        case CONST_SEARCH_TYPE_COMMENT:
            return arr.filter(v => v && v.html);
        default:
            console.log('sate.searchType', type);
            throw new Error('unknown search type');
    }
}
