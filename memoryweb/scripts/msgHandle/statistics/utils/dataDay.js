const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration');
dayjs.extend(duration);

const MAX_INTERVAL_DAY = 30;

// 理论上全年都应该有数据 但是因为数据来源并不是完整的
// 所以如果相邻时间间隔超过 $MAX_INTERVAL_DAY 天视为数据断层(丢失) 不参与统计.
function countDataDay(msArr) {
    const arr = [];

    let rs = msArr[0];

    for (let i = 0; i < msArr.length; i++) {
        const e = msArr[i];

        const interval = countDay(i === 0 ? e : msArr[i - 1], e);

        if (interval > MAX_INTERVAL_DAY) {
            const re = msArr[i - 1];
            arr.push({
                range: [rs, re],
                day: countDay(rs, re),
            });
            rs = e;
        }

        // 如果是最后一个 直接作为结束点
        if (i === msArr.length - 1) {
            const re = msArr[i];
            arr.push({
                range: [rs, re],
                day: countDay(rs, re),
            });
        }
    }

    return humanize({
        range: arr,
        year: cutYearDataDay(arr),
    });
}

function cutYearDataDay(activityData) {
    const yearData = {};

    for (let i = 0; i < activityData.length; i++) {
        const { range } = activityData[i];
        const [s, e] = range;
        const sY = dayjs(s).format('YYYY');
        const eY = dayjs(e).format('YYYY');

        if (sY === eY) {
            if (!yearData[sY]) {
                yearData[sY] = { day: 0, rangeArr: [] };
            }
            yearData[sY].day += countDay(s, e);
            yearData[sY].rangeArr.push(range);
        } else {
            for (let y = sY; y <= eY; y++) {
                // 这里 sY 字符串 不能用 ===
                const rs = y == sY ? s : dayjs(`${y}/01/01 00:00:00:000`).valueOf();
                const re = y == eY ? e : dayjs(`${y}/12/31 23:59:59:999`).valueOf();

                if (!yearData[y]) {
                    yearData[y] = { day: 0, rangeArr: [] };
                }

                yearData[y].day += countDay(rs, re);
                yearData[y].rangeArr.push([rs, re]);
            }
        }
    }
    return yearData;
}

function countDay(s, e) {
    const sd = dayjs(s).format('YYYY-MM-DD');
    const ed = dayjs(e).format('YYYY-MM-DD');
    return dayjs.duration(dayjs(ed).diff(sd)).asDays() + 1;
}

function humanize(data) {
    data.range.forEach(v => {
        v.rangeH = [
            dayjs(v.range[0]).format('YYYY-MM-DD HH:mm:ss SSS'),
            dayjs(v.range[1]).format('YYYY-MM-DD HH:mm:ss SSS'),
        ];
    });
    Object.values(data.year).forEach(y => {
        y.rangeArrH = [];
        y.rangeArr.forEach(v => {
            y.rangeArrH.push([
                dayjs(v[0]).format('YYYY-MM-DD HH:mm:ss SSS'),
                dayjs(v[1]).format('YYYY-MM-DD HH:mm:ss SSS'),
            ]);
        });
    });
    return data;
}

module.exports = {
    countDataDay,
};
