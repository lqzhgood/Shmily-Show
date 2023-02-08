const fs = require('fs');

const { FILE_OUTPUT_JSON_MSG } = require('../../config');
const { getJSON, setJSON } = require('../../utils/index');

const msgJson = getJSON(FILE_OUTPUT_JSON_MSG);

clear(msgJson);

// fs.writeFileSync(FILE_OUTPUT_JSON_MSG, JSON.stringify(msgJson));
setJSON(FILE_OUTPUT_JSON_MSG, msgJson);

function clear(arr) {
    arr.forEach(v => {
        delete v.forcedMerger;
        delete v.msAccuracy;
    });
}
