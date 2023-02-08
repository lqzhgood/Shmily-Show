const fs = require('fs-extra');
const path = require('path');

const { FILE_OUTPUT_JSON_MSG, DIR_OUTPUT_PUBLIC_STATIC } = require('../../config');
const { getJSON } = require('../../utils/index');

const msgJson = getJSON(FILE_OUTPUT_JSON_MSG);

const sourceTypeArr = [];
const deviceArr = [];

msgJson.forEach(m => {
    const { source, type, device } = m;
    const f = sourceTypeArr.find(v => v.source === source && v.type === type);
    if (!f) {
        sourceTypeArr.push({ source, type });
        const sourceFile = path.join(DIR_OUTPUT_PUBLIC_STATIC, 'icon/source', `${source}-${type}.png`);
        if (!fs.existsSync(sourceFile)) logNotFound(sourceFile);
        const typeFile = path.join(DIR_OUTPUT_PUBLIC_STATIC, 'icon/type', `${source}-${type}.png`);
        if (!fs.existsSync(typeFile)) logNotFound(typeFile);
    }

    // const d = deviceArr.find(v=>v.device === device);
    // if (!d){
    //     deviceArr.push(device);

    // }
});

function logNotFound(f) {
    console.log('❌', '未找到文件', f);
}
