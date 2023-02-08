const fs = require('fs');

const j1 = require('./input/modify-3w2');
const j2 = require('./input/modify');
const j3 = require('./input/modify-385219308');

const f = [].concat(j1, j2, j3);

fs.writeFileSync('./dist/modify.json', JSON.stringify(f, null, 4));

const c1 = require('./input/comments-3w2');
const c2 = require('./input/comments');

const c = [].concat(c1, c2);

fs.writeFileSync('./dist/comments.json', JSON.stringify(c, null, 4));
