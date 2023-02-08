getAll$();

function getAll$(params) {
    const json = require('../../public/json/msg/msg.json');

    const arr = json.reduce((pre, cV) => {
        const kArr = Object.keys(cV).filter(v => v.startsWith('$'));
        if (kArr.length != 0 && kArr.length != 1) throw new Error('error');
        if (kArr.length === 1) {
            pre.push(kArr[0]);
        }
        return pre;
    }, []);

    console.log(Array.from(new Set(arr)));
}
