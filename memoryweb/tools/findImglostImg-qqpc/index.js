const fs = require('fs');
const path = require('path');

const json = require('../../public/json/msg/msg.json');

for (let i = 1; i < json.length; i++) {
    const m = json[i];
    const { source, html, id, ms } = m;
    if (source !== 'QQ') continue;
    if (html && html.includes('src="lostImg')) {
        const url = `http://127.0.0.1:8080/#/query?day=${m.ms}`;
        console.log(`${m.day} ${m.time} ${url}`);
    }
}
