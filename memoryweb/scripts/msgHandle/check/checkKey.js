const { FILE_OUTPUT_JSON_MSG } = require('../../config');
const { getJSON } = require('../../utils/index');

const msgJson = getJSON(FILE_OUTPUT_JSON_MSG);

const warnArr = [];
msgJson.forEach(v => {
    const msgSpecialKey = Object.keys(v).find(k => k.startsWith('$') && !['$Dev'].includes(k));
    if (msgSpecialKey && msgSpecialKey !== `$${v.source}`) {
        const warnStr = `${v.source}\t<-!->\t${msgSpecialKey}`;
        if (!warnArr.includes(warnStr)) warnArr.push(warnStr);
    }
});

if (warnArr.length != 0) {
    console.log('❗', 'msg.$Key is not match msg.source');
    console.log(`source\t<-!->\t$key\n----------------------\n${warnArr.join('\n')}`);
}
