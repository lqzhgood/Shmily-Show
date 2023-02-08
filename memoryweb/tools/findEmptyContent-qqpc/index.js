const fs = require('fs');

const msgArr = JSON.parse(fs.readFileSync('../../public/json/msg/msg.json', 'utf-8'));

console.log('使用 Windows Terminal 可点击链接');

for (let i = 0; i < msgArr.length; i++) {
    const m = msgArr[i];
    if (m.source !== 'QQ') continue;
    if ('content' in m && m.content.trim() === '') {
        const url = `http://127.0.0.1:8080/#/query?day=${m.ms}`;
        console.log(`${m.day} ${m.time} ${url}`);
    }
}
