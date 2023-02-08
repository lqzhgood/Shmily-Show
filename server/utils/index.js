const fs = require('fs');
const crypto = require('crypto');
const cheerio = require('cheerio');
const FileType = require('file-type');
const exec = require('child_process').execSync;

exports.getJSON = function (p, defaultValue = []) {
    if (fs.existsSync(p)) {
        const t = fs.readFileSync(p, 'utf-8');
        return JSON.parse(t);
    } else {
        return defaultValue;
    }
};

exports.sleep = function (t = 1000) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, t);
    });
};

exports.md5ByBuffer = function (buff, cut) {
    const hash = crypto.createHash('md5');
    hash.update(buff, 'utf8');
    const md5 = hash.digest('hex');
    return cut ? md5.slice(0, 6) : md5;
};

exports.getExtByBuff = async function (buff) {
    try {
        const res = await FileType.fromBuffer(buff);
        let ext = res.ext ? '.' + res.ext : null;
        return ext;
    } catch (error) {
        console.log('error.message', error.message);
        return null;
    }
};

exports.getUrlString = function (...p) {
    const fileName = p.pop();
    return `/data/${p.join('/')}/${encodeURIComponent(fileName)}`;
};

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

exports.openFolder = function (p, cwd) {
    if (!fs.existsSync(p)) {
        exec(`mkdir ${p}`, { cwd }).toString();
    }
    try {
        exec(`explorer ${p}`, { cwd }).toString();
    } catch (error) {
        // 正确的返回也不为 0 所以这里强制忽略错误
    }
};

exports.htmlCover = function (html) {
    const $ = cheerio.load(html, { decodeEntities: false }, false);
    return $.html().replaceAll('<p></p>', '');
};
