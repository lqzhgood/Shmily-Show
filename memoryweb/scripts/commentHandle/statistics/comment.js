const fs = require('fs-extra');
const _ = require('lodash');
const path = require('path');
const cheerio = require('cheerio');
const filesize = require('filesize');

const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration');
dayjs.extend(duration);

const { DIR_OUTPUT_COMMENT_STATIC, DIR_OUTPUT_PUBLIC_JSON_STATISTIC, DIR_WEB_CODE } = require('../../config');
const { numToPercent } = require(path.join(DIR_WEB_CODE, './common.js'));
const {
    KEY_ALL,
    COUNT_DB_TYPE_NUM,
    COUNT_DB_TYPE_WORDS,
    SOURCE_TYPE_EDIT,
    DIRECTION_TYPE_ALL,
} = require('../../../src/views/Statistic/const.js');
const { makeDate, makeSourceData_Avg_ActivityDay } = require('../../msgHandle/statistics/utils/index.js');
const { htmlToText } = require('../utils.js');

const { COMMENT_TAGS } = require('../../user/commentTag.js');

const { commentsAll, outDir } = require('./const.js');

// eslint-disable-next-line
if (commentsAll.length === 0) return;

const outDirNum = path.join(outDir, COUNT_DB_TYPE_NUM);
const outDirWords = path.join(outDir, COUNT_DB_TYPE_WORDS);

const timeLineResCount = {
    year: makeDate(commentsAll, 'year', []),
    month: makeDate(commentsAll, 'month', []),
    day: makeDate(commentsAll, 'day', []),
};

const timeLineResWord = _.cloneDeep(timeLineResCount);

commentsAll.forEach(cV => {
    const t = dayjs(cV.ms);
    const y = t.format('YYYY');
    const m = t.format('YYYY-MM');
    const d = t.format('YYYY-MM-DD');
    const source = KEY_ALL;
    {
        const { year, month, day } = timeLineResCount;

        const len = 1;

        addItem(year, cV, v => v.date == y && v.source === source, len);
        addItem(month, cV, v => v.date == m && v.source === source, len);
        addItem(day, cV, v => v.date == d && v.source === source, len);
    }

    {
        const { year, month, day } = timeLineResWord;
        const len = htmlToText(cV.html).length;

        addItem(year, cV, v => v.date == y && v.source === source, len);
        addItem(month, cV, v => v.date == m && v.source === source, len);
        addItem(day, cV, v => v.date == d && v.source === source, len);
    }
});

function addItem(arr, cV, fn, addValue = 1) {
    let f = arr.find(fn);
    if (!f) console.warn('不应该出现这个错误,这个错误出现说明生成的数组不是连续的,空白位置没有被0填充');

    f.count += addValue;

    return f;
}

const dirTimeLineCount = path.join(outDirNum, '/timeLine/');
fs.mkdirpSync(dirTimeLineCount);
fs.writeFileSync(path.join(dirTimeLineCount, 'year.json'), JSON.stringify(timeLineResCount.year, null, 4));
fs.writeFileSync(path.join(dirTimeLineCount, 'month.json'), JSON.stringify(timeLineResCount.month, null, 4));
fs.writeFileSync(path.join(dirTimeLineCount, 'day.json'), JSON.stringify(timeLineResCount.day, null, 4));

const dirTimeLineWord = path.join(outDirWords, '/timeLine/');
fs.mkdirpSync(dirTimeLineWord);
fs.writeFileSync(path.join(dirTimeLineWord, 'year.json'), JSON.stringify(timeLineResWord.year, null, 4));
fs.writeFileSync(path.join(dirTimeLineWord, 'month.json'), JSON.stringify(timeLineResWord.month, null, 4));
fs.writeFileSync(path.join(dirTimeLineWord, 'day.json'), JSON.stringify(timeLineResWord.day, null, 4));

const dataDay = fs.readJsonSync(
    path.join(DIR_OUTPUT_PUBLIC_JSON_STATISTIC, `./${SOURCE_TYPE_EDIT}/${DIRECTION_TYPE_ALL}/comment-data-day.json`),
);

// count
const commentCountRes = timeLineResCount.year
    .map(yd => {
        const allDay = dataDay.year[yd.date] ? dataDay.year[yd.date].day : 0;

        return {
            year: yd.date,
            total: yd.count,
            max: 0,
            maxDay: [],
            activityDay: 0,
            activityDayP: 0,
            allDay,

            avg: 0,
        };
    })
    .map(y => {
        const thisYear = timeLineResCount.day.filter(v => v.date.startsWith(y.year));
        y.max = thisYear.reduce((max, v) => Math.max(max, v.count), 0);
        y.maxDay = thisYear.filter(v => v.count == y.max).map(v => ({ date: v.date, count: v.count }));

        y.activityDay = thisYear.filter(v => v.count > 0).length;
        y.activityDayP = numToPercent(y.activityDay / y.allDay);

        y.avg = numToPercent(y.total / y.activityDay);
        return y;
    });

fs.writeFileSync(path.join(outDirNum, 'comment-year-count.json'), JSON.stringify(commentCountRes, null, 4));

const commentCountWordsRes = timeLineResWord.year
    .map(yd => {
        const allDay = dataDay.year[yd.date] ? dataDay.year[yd.date].day : 0;

        return {
            year: yd.date,
            total: yd.count,
            max: 0,
            maxDay: [],
            activityDay: 0,
            activityDayP: 0,
            allDay,

            avg: 0,
        };
    })
    .map(y => {
        const thisYear = timeLineResWord.day.filter(v => v.date.startsWith(y.year));
        y.max = thisYear.reduce((max, v) => Math.max(max, v.count), 0);
        y.maxDay = thisYear.filter(v => v.count == y.max).map(v => ({ date: v.date, count: v.count }));

        y.activityDay = thisYear.filter(v => v.count > 0).length;
        y.activityDayP = numToPercent(y.activityDay / y.allDay);

        y.avg = numToPercent(y.total / y.activityDay);
        return y;
    });

fs.writeFileSync(path.join(outDirWords, 'comment-year-count.json'), JSON.stringify(commentCountWordsRes, null, 4));

const commentTypeAndCount = {
    label: '评论',
    count: commentsAll.length,
    children: [],
};

commentTypeAndCount.children.push({
    label: '🔗 外部链接',
    count: commentsAll.reduce((pre, c) => {
        const $ = cheerio.load(c.html, { decodeEntities: false }, false);
        const n = $('a:not([innerlink]):not([innersearch])').length;

        return pre + n;
    }, 0),
});

commentTypeAndCount.children.push({
    label: '🚀 内联链接',
    count: commentsAll.reduce((pre, c) => {
        const $ = cheerio.load(c.html, { decodeEntities: false }, false);
        const n = $('a[innerLink]').length;

        return pre + n;
    }, 0),
});

commentTypeAndCount.children.push({
    label: '🔎 内联搜索',
    count: commentsAll.reduce((pre, c) => {
        const $ = cheerio.load(c.html, { decodeEntities: false }, false);
        const n = $('a[innersearch]').length;

        return pre + n;
    }, 0),
});

commentTypeAndCount.children.push({
    label: '📄 附件数量',
    count: countFileNumber(DIR_OUTPUT_COMMENT_STATIC).num,
});

commentTypeAndCount.children.push({
    label: '📄 附件大小',
    count: filesize(countFileSize(DIR_OUTPUT_COMMENT_STATIC).num),
});

// fs.writeFileSync(path.join(outDirNum, 'comment-mind-typeAndCount.json'), JSON.stringify(commentTypeAndCount, null, 4));

const commentTagTypeAndCount = {
    label: '评论Tag',
    count: 0,
    children: [],
};

COMMENT_TAGS.forEach(t => {
    let f = commentTagTypeAndCount.children.find(v => v.label === t);
    if (!f) {
        f = {
            label: t,
            count: 0,
        };
        commentTagTypeAndCount.children.push(f);
    }

    f.count += commentsAll.filter(v => v.html.includes(t)).length;
});
commentTagTypeAndCount.count = commentTagTypeAndCount.children.reduce((pre, c) => pre + c.count, 0);

// fs.writeFileSync(
//     path.join(outDirNum, 'comment-tag-mind-typeAndCount.json'),
//     JSON.stringify(commentTagTypeAndCount, null, 4),
// );

const sourceCountData = {
    sourceData: commentTypeAndCount,
    maxData: commentCountRes.reduce((pre, cV) => (cV.max >= pre.max ? cV : pre)),
    ...makeSourceData_Avg_ActivityDay(commentCountRes),
};

fs.writeFileSync(path.join(outDirNum, 'comment-sourceCount.json'), JSON.stringify(sourceCountData, null, 4));

const sourceCountDataTag = {
    sourceData: commentTagTypeAndCount,
};

fs.writeFileSync(path.join(outDirNum, 'comment-tag-sourceCount.json'), JSON.stringify(sourceCountDataTag, null, 4));

const commentWordsTypeAndCount = {
    label: '评论字数',
    count: timeLineResWord.year.reduce((pre, cV) => pre + cV.count, 0),
    children: [],
};

const sourceCountDataWords = {
    sourceData: commentWordsTypeAndCount,
    maxData: commentCountWordsRes.reduce((pre, cV) => (cV.max >= pre.max ? cV : pre)),
    ...makeSourceData_Avg_ActivityDay(commentCountWordsRes),
};

fs.writeFileSync(path.join(outDirWords, 'comment-sourceCount.json'), JSON.stringify(sourceCountDataWords, null, 4));

function countFileNumber(dir, res = { num: 0 }) {
    if (!fs.statSync(dir).isDirectory()) {
        if (path.basename(dir) !== 'Thumbs.db') {
            res.num += 1;
        }
    } else {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            countFileNumber(path.join(dir, file), res);
        });
    }

    return res;
}

function countFileSize(dir, res = { num: 0 }) {
    if (!fs.statSync(dir).isDirectory()) {
        res.num += fs.statSync(dir).size;
    } else {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            countFileSize(path.join(dir, file), res);
        });
    }

    return res;
}
