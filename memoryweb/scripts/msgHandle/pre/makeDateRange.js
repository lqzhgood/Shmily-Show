const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');

const { FILE_OUTPUT_JSON_MSG, DIR_OUTPUT_IMPORT_MSG } = require('../../config');
const { getJSON, setJSON, makerOrderArr } = require('../../utils/index');

const msgJson = getJSON(FILE_OUTPUT_JSON_MSG);

const dateRange = msgJson.reduce((pre, cV) => {
    const y = dayjs(cV.ms).year();
    const m = dayjs(cV.ms).month() + 1;

    let fy = pre.find(t => t.year == y);
    if (!fy) {
        fy = {
            year: y,
            months: makerOrderArr(1, 12).map(n => ({
                month: n,
                disable: true,
            })),
        };
        pre.push(fy);
    }

    const fm = fy.months.find(s => s.month == m);
    if (fm) delete fm.disable;

    return pre;
}, []);

const dateRageSort = dateRange.sort((a, b) => a.year - b.year);

// fs.writeFileSync(path.join(DIR_OUTPUT_IMPORT_MSG, 'dateRange.json'), JSON.stringify(dateRageSort));
setJSON(path.join(DIR_OUTPUT_IMPORT_MSG, 'dateRange.json'), dateRageSort);
