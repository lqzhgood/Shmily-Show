const fs = require('fs-extra');

const { DIR_OUTPUT_PUBLIC_JSON, DIR_INPUT_IMPORT } = require('./config.js');

console.log('DIR_OUTPUT_PUBLIC_JSON', DIR_OUTPUT_PUBLIC_JSON);
console.log('DIR_INPUT_IMPORT', DIR_INPUT_IMPORT);
fs.removeSync(DIR_OUTPUT_PUBLIC_JSON);
fs.removeSync(DIR_INPUT_IMPORT);
