const fs = require('fs-extra');
const path = require('path');

exports.clearEmptyFolder = function (dir) {
    fs.readdirSync(dir).forEach(file => {
        const pathFile = path.join(dir, file);
        if (fs.statSync(pathFile).isDirectory()) {
            const files = fs.readdirSync(pathFile);
            if (files.length === 0) {
                console.log('', '删除空文件夹', pathFile);
                fs.rmdirSync(pathFile);
            }
        }
    });
};
