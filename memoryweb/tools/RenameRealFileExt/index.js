const fs = require('fs');
const path = require('path');
const FileType = require('file-type');

const files = fs.readdirSync('./input');

(async () => {
    for (let i = 0; i < files.length; i++) {
        const f = files[i];
        const { base, name, ext } = path.parse(f);

        const { ext: _ext_l } = await FileType.fromFile('input/' + f);
        const ext_l = ('.' + _ext_l).toLowerCase();
        if (ext.toLowerCase() !== ext_l) {
            fs.renameSync('input/' + f, 'input/' + name + ext_l);
        }
    }
})();
