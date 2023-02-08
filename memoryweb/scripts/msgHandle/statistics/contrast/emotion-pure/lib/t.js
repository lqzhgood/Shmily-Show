const { countPureEmotionMsg } = require('./utils.js');

const a = `[emoji-飞吻]😗😙[emoji-羞涩亲亲]`;

const res = countPureEmotionMsg(a);
console.log('res', res);

const aa = {
    count: 0,
    c() {
        this.count++;
    },
};

aa.c();
console.log('aa', aa);
