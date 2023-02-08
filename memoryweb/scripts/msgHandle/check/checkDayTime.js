const dayjs = require('dayjs');
const { FILE_OUTPUT_JSON_MSG } = require('../../config');
const { getJSON } = require('../../utils/index');
const { makeDayTime } = require('../../utils/index');

const msgJson = getJSON(FILE_OUTPUT_JSON_MSG);

msgJson.forEach(v => {
    const t = dayjs(Number(v.ms)).format('YYYY-MM-DD HH:mm:ss');

    const msT = `${v.day} ${v.time}`;

    if (t !== msT) {
        console.warn('❌', '时间不一致', v);
    }
});

makeDayTime(msgJson);
