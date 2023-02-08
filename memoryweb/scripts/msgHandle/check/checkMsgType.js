const fs = require('fs-extra');
const path = require('path');
const _ = require('lodash');

const { DIR_WEB_CODE, DIR_OUTPUT_IMPORT_MSG } = require('../../config');

const dict = fs.readJsonSync(path.join(DIR_OUTPUT_IMPORT_MSG, './msgDict.json'));
const dict_source = dict.source;

const rootDir = path.join(DIR_WEB_CODE, `./components/Msg/source/`);

for (let i = 0; i < dict_source.length; i++) {
    const { label: source, type: typeArr, os: osArr } = dict_source[i];
    let p;
    if (osArr.length !== 0) {
        for (let j = 0; j < osArr.length; j++) {
            const { label: osLabel, type: osTypeArr } = osArr[j];
            p = path.join(rootDir, `./${source}/os/${osLabel}/types.js`);
            const allTypesObj = require(p);

            const allKeys = Object.keys(allTypesObj);
            const keys = osTypeArr.map(t => `${source}_${osLabel}_type_${t}`);
            const diffK = _.difference(keys, allKeys);
            if (diffK.length !== 0) {
                console.log('❌', 'not found components in web type | key', source, osLabel);
                console.log(p);
                console.log('all', allKeys);
                console.log('curr', keys);
                console.log('diffK', diffK);
            }

            const allTypes = Object.values(allTypesObj);
            const diffV = _.difference(osTypeArr, allTypes);
            if (diffV.length !== 0) {
                console.log(p);
                console.log('❌', 'not found components in web type | value', source, osLabel, diffV);
                console.log('all', allTypes);
                console.log('curr', osTypeArr);
                console.log('diffK', diffV);
            }
        }
    } else {
        p = path.join(rootDir, `./${source}/types.js`);
        const allTypesObj = require(p);

        const allKeys = Object.keys(allTypesObj);
        const keys = typeArr.map(t => `${source}_type_${t}`);
        const diffK = _.difference(keys, allKeys);
        if (diffK.length !== 0) {
            console.log('❌', 'not found components in web type | key', source, diffK);
            console.log(p);
            console.log('all', allKeys);
            console.log('curr', keys);
            console.log('diffK', diffK);
        }

        const allTypes = Object.values(allTypesObj);
        const diffV = _.difference(typeArr, allTypes);
        if (diffV.length !== 0) {
            console.log('❌', 'not found components in web type | value', source, diffV);
            console.log(p);
            console.log('all', allTypes);
            console.log('curr', typeArr);
            console.log('diffK', diffV);
        }
    }
}
