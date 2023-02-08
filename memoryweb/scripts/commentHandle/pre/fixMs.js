const fs = require('fs');

const { FILE_INPUT_COMMENTS, FILE_OUTPUT_JSON_MSG } = require('../../config');

const { getJSON } = require('../../utils/index');

const msgAll = getJSON(FILE_OUTPUT_JSON_MSG);
const cArr = getJSON(FILE_INPUT_COMMENTS);

cArr.forEach(c => {
    const sm = msgAll.find(m => m.id === c.sId);
    if (sm.ms != c.sMs) {
        console.log('评论ID时间不正确 sId', c.sId, c.sMs, sm.ms);
        c.sMs = sm.ms;
    }

    const em = msgAll.find(m => m.id === c.eId);
    if (em.ms != c.eMs) {
        console.log('评论ID时间不正确 sId', c.eId, c.eMs, em.ms);
        c.eMs = em.ms;
    }
});

fs.writeFileSync(FILE_INPUT_COMMENTS, JSON.stringify(cArr, null, 4));
