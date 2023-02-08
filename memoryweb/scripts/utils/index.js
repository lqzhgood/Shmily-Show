const fs = require('fs');
const crypto = require('crypto');
const dayjs = require('dayjs');

const { FILE_INPUT_MSG_MODIFY, FILE_OUTPUT_JSON_MSG_ORIGINAL, FILE_INPUT_COMMENTS } = require('../config');

const FILES_CACHE = {}; 

exports.getJSON = function (p, defaultValue = []) {
    let json;
    if (p in FILES_CACHE) {
        json = FILES_CACHE[p];
    } else {
        if (fs.existsSync(p)) {
            // console.time(`📖 ${p}`);
            const txt = fs.readFileSync(p, 'utf-8');
            json = JSON.parse(txt);
            // console.timeEnd(`📖 ${p}`);
            FILES_CACHE[p] = json;
        } else {
            console.warn('❌', 'getJSON not found file', p);
            json = defaultValue;
        }
    }
    return json;
};

exports.setJSON = function (p, json, type = 'ram') {
    if (type === 'ram') {
        FILES_CACHE[p] = json;
    } else if (type === 'file') {
        delete FILES_CACHE[p];
        fs.writeFileSync(p, JSON.stringify(json, null, 4));
    } else {
        throw new Error('setJSON type error');
    }
};

// 仅读取不修改源文件的文件
const NOT_WRITE = [FILE_INPUT_COMMENTS, FILE_INPUT_MSG_MODIFY];
// 仅需在内存中过度的文件,不需要写文件
const ONLY_IN_RAM_FILE = [FILE_OUTPUT_JSON_MSG_ORIGINAL];

exports.clearCache = function (jump) {
    // console.log('write json to file', JSON.stringify(Object.keys(FILES_CACHE), null, 4));

    Object.keys(FILES_CACHE).forEach(p => {
        // _ 开头的都是内存中共享的数据 忽略
        if (p.startsWith('_')) return;

        const v = FILES_CACHE[p];

        const blackList = jump.includes('j_fromServer') ? [].concat(NOT_WRITE, ONLY_IN_RAM_FILE) : NOT_WRITE;

        if (!blackList.includes(p)) {
            console.time(`✍️  ${p}`);
            // fs.writeFileSync(p, JSON.stringify(v));
            fs.writeFileSync(p, JSON.stringify(v, null, 4));
            console.timeEnd(`✍️  ${p}`);
        }

        delete FILES_CACHE[p];
    });
};

exports.makerOrderArr = function (s, e) {
    if (s > e) {
        // 2020 - 2010
        return Array.from(new Array(s + 1).keys())
            .slice(e)
            .reverse();
    } else {
        // 2010 - 2020
        return Array.from(new Array(e + 1).keys()).slice(s);
    }
};

/**
 * @name:
 * @description: 有些是从 ms->day 有些是 day->ms 但是不管哪样 ms->day 都是准确的
 * @param {*} arr
 * @return {*}
 */
exports.makeDayTime = function (arr) {
    arr.forEach(v => {
        v.day = dayjs(Number(v.ms)).format('YYYY-MM-DD');
        v.time = dayjs(Number(v.ms)).format('HH:mm:ss');
    });
};

exports.md5 = function (str = 'undefined', length) {
    const md5 = crypto.createHash('md5');
    const v = md5.update(str).digest('hex');
    return length ? v.slice(0, length) : v;
};
