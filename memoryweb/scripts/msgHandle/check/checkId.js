const { FILE_OUTPUT_JSON_MSG } = require('../../config');
const { getJSON } = require('../../utils/index');

const msgJson = getJSON(FILE_OUTPUT_JSON_MSG);

const ids = msgJson.map(v => v.id);

const uIds = Array.from(new Set(ids));

if (ids.length != uIds.length) {
    const redundant = ids.filter(v => {
        const findIndex = uIds.findIndex(uv => uv == v);
        if (findIndex == -1) {
            return true;
        } else {
            uIds[findIndex] = undefined;
            return false;
        }
    });

    console.warn('重复的 ID', Array.from(new Set(redundant)));

    throw new Error(`❌ !!!有ID重复!!! ${ids.length - uIds.length} === ${redundant.length}`);
}
