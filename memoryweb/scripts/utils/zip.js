// 便于 DEV 的缘故, JSON输出都是易读的, build 后需要去掉空格 压缩 JSON 文件

const fs = require('fs-extra');
const path = require('path');
const { DIR_OUTPUT_PUBLIC_JSON, DIR_INPUT_IMPORT } = require('../config.js');

zip(DIR_OUTPUT_PUBLIC_JSON);
zip(DIR_INPUT_IMPORT);

function zip(d) {
    const files = fs.readdirSync(d);
    for (let i = 0; i < files.length; i++) {
        const f = path.join(d, files[i]);

        if (fs.statSync(f).isDirectory()) {
            zip(f);
        } else {
            if (f.toLocaleLowerCase().endsWith('.json')) {
                const json = fs.readJsonSync(f);
                fs.writeFileSync(f, JSON.stringify(json));
            }
        }
    }
}
