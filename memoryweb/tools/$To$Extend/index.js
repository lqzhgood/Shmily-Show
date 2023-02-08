const path = require('path');
const fs = require('fs');

const DIR = path.join(__dirname, '../../src/assets/data/');

fix$(DIR);

function fix$(d) {
    const files = fs.readdirSync(d);
    for (let i = 0; i < files.length; i++) {
        const f = path.join(d, files[i]);

        if (fs.statSync(f).isDirectory()) {
            fix$(f);
        }

        if (f.endsWith('.json')) {
            console.log('-', f);
            const json = JSON.parse(fs.readFileSync(f));
            if (json[0].sId && json[0].eId) continue; // comment

            json.forEach(m => {
                if (m.oMsg || m.nMsg) {
                    if (m.oMsg) {
                        fixMsg$(m.oMsg);
                    }
                    if (m.nMsg) {
                        fixMsg$(m.nMsg);
                    }
                } else {
                    fixMsg$(m);
                }
            });

            fs.writeFileSync(f, JSON.stringify(json, null, 4));
        }
    }
}

function fixMsg$(m) {
    if (!m.source || !m.type) {
        console.log('m', m);
        throw new Error('非 Msg 结构');
    }

    //!!! replace $xxx - > $Extend
    // const kArr = Object.keys(m).filter(k => k.startsWith('$'));
    // if (kArr.length != 0 && kArr.length != 1) throw new Error('have more $ key');
    // const k = kArr[0];
    // m.$Extend = m[k];
    // delete m[k];

    // if (m.$CAMERA) {
    //     m.$Camera = m.$CAMERA;
    //     delete m.$CAMERA;
    //     console.count('m.$CAMERA');
    // }

    // if (m.source === 'CAMERA') {
    //     m.source = 'Camera';
    //     console.count(`m.source = 'Camera'`);
    // }

    if (m.source === 'MobileQQ' && !m.$MobileQQ.type) {
        m.$MobileQQ.type = 's60v3';
        console.count(`m.$MobileQQ.type = 's60v3'`);
    }

    // if (m.source === 'MobileQQ' && !m.$MobileQQ) {
    //     m.$MobileQQ = m.$mobileQQ;
    //     delete m.$mobileQQ;
    //     console.count('m.$mobileQQ');
    // }
}
