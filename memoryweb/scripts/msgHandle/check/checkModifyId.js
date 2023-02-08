const { getJSON } = require('../../utils/index');
const { FILE_OUTPUT_JSON_MSG, FILE_OUTPUT_JSON_MSG_ORIGINAL, FILE_INPUT_MSG_MODIFY } = require('../../config');

const msgJsonOriginal = getJSON(FILE_OUTPUT_JSON_MSG_ORIGINAL);
const msgJson = getJSON(FILE_OUTPUT_JSON_MSG);

const modifyJson = getJSON(FILE_INPUT_MSG_MODIFY);

for (let i = 0; i < modifyJson.length; i++) {
    const modify = modifyJson[i];
    const { type, oMsg, nMsg } = modify;

    if (oMsg) {
        const findOldId = msgJsonOriginal.find(m => m.id === oMsg.id);
        if (!findOldId) {
            console.log('modify oMsg id 不正确', modify);
        }
    }

    if (nMsg) {
        // delete 的 msgJson 里面没有
        const arr = type === 'modify' ? msgJson : msgJsonOriginal;
        if (type === 'modify') {
            const findNewId = arr.find(m => m.id === nMsg.id);
            if (!findNewId) {
                console.log('modify nMsg id 不正确', modify);
            }
        }
    }
}
