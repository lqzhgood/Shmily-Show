const fs = require('fs');
const path = require('path');

const { MATCH_ID_REG } = require(path.join(__dirname, '../../src/common.js'));

const COMMIT_DIR = path.join(__dirname, '../../../msgData/data/comments/');
const commitDirs = fs.readdirSync(COMMIT_DIR).filter(d => d !== 'face');

const idMap = require('./idMap');

for (let i = 0; i < commitDirs.length; i++) {
    const nid = commitDirs[i];
    if (MATCH_ID_REG.test(nid)) {
        const f = idMap.find(v => v.n === nid);
        if (!f) {
            console.log(i, nid);
            throw new Error('not found');
        }
        fs.renameSync(path.join(COMMIT_DIR, nid), path.join(COMMIT_DIR, f.o));
    }
}
