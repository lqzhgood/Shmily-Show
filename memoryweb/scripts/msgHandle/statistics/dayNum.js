const fs = require('fs');
const path = require('path');
const { FILE_OUTPUT_JSON_MSG, DIR_OUTPUT_IMPORT_MSG } = require('../../config.js');

const { getJSON } = require('../../utils/index');

const msgJson = getJSON(FILE_OUTPUT_JSON_MSG);

const dayData = msgJson.reduce((pre, cV) => {
    const { day } = cV;
    if (!pre[day]) {
        pre[day] = 0;
    }
    pre[day]++;
    return pre;
}, {});

const xx = {
    ...statistics(dayData),
    data: dayData,
};

fs.writeFileSync(path.join(DIR_OUTPUT_IMPORT_MSG, 'dayNum.json'), JSON.stringify(xx, null, 4));

function statistics(data) {
    const days = Object.keys(data);
    const values = Object.values(data);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const sum = values.reduce((pre, cV) => pre + cV, 0);
    const day = days.length;
    const avg = sum / day;

    return { max, min, sum, day, avg };
}
