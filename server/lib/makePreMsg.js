const exec = require('child_process').execSync;

const { DIR_WEB } = require('../config');

function makePreMsg() {
    const cmdStr = `npm run makePre j_statistics j_fromServer`;
    const options = {
        cwd: DIR_WEB,
    };
    const reMsg = exec(cmdStr, options).toString();

    if (reMsg.trim().split('\n').slice(-1)[0].trim() !== 'ALL_IS_OK') {
        throw new Error(reMsg);
    }
    return reMsg;
}

// function makePreMsg() {
//     return new Promise((resolve, reject) => {

//         const cmdStr = `npm run makePre`;
//         const options = {
//             cwd: DIR_WEB,
//         };
//         exec(cmdStr, options, (err, stdout, stderr) => {
//             if (err) {
//                 reject(new Error('error:' + stderr));
//             } else {
//                 resolve(stdout);
//             }
//         });

//     });
// }

module.exports = makePreMsg;
