// !!! 因为是读取的 countYear 和 Total 的数据 所以必须放到最后

const fs = require('fs-extra');
const path = require('path');
const _ = require('lodash');

const { sortByArr } = require('../utils/index.js');
const { DIR_OUTPUT_PUBLIC_JSON_STATISTIC, DIR_WEB_CODE } = require('../../../config.js');

const {
    KEY_ALL,
    SOURCE_TYPE_CONTRAST,
    DIRECTION_TYPE_ALL,
    DIRECTION_TYPE_COME,
    DIRECTION_TYPE_GO,
    COUNT_DB_TYPE_WORDS,
    DEFAULT_AVATAR_COME,
    DEFAULT_AVATAR_GO,
} = require('../../../../src/views/Statistic/const.js');
const { numToPercent } = require(path.join(DIR_WEB_CODE, './common.js'));

const { makeSourceData_Avg_ActivityDay } = require('../utils/index.js');

calc(DIRECTION_TYPE_ALL);

function calc(directionType) {
    const countYearData = fs.readJsonSync(
        path.join(
            DIR_OUTPUT_PUBLIC_JSON_STATISTIC,
            `./${SOURCE_TYPE_CONTRAST}/${directionType}/${COUNT_DB_TYPE_WORDS}/year-count.json`,
        ),
    );
    const maxData = countYearData.reduce((pre, cV) => (cV.max >= pre.max ? cV : pre));

    const TimeLineYearData = fs.readJsonSync(
        path.join(
            DIR_OUTPUT_PUBLIC_JSON_STATISTIC,
            `./${SOURCE_TYPE_CONTRAST}/${DIRECTION_TYPE_ALL}/${COUNT_DB_TYPE_WORDS}/timeLine-words/year.json`,
        ),
    );
    // typeAndCountData.children = typeAndCountData.children.filter(v => v.count > 0);
    // const sourceData = typeAndCountData;

    let sourceDataChildren = [];
    const groupYearData = _.groupBy(TimeLineYearData, 'source');
    Object.entries(groupYearData).forEach(([s, arr]) => {
        const o = {
            label: s,
            count: 0,
            direction: {
                go: 0,
                come: 0,
                goP: 0,
                comeP: 0,
            },
        };
        arr.forEach(v => {
            o.count += v.count;
            if (v.direction){
                o.direction.go += v.direction.go;
                o.direction.come += v.direction.come;
            }
        });

        const d_p = o.direction.go + o.direction.come;
        o.direction.goP = numToPercent(o.direction.go / d_p);
        o.direction.comeP = numToPercent(o.direction.come / d_p);

        if (s === DIRECTION_TYPE_COME) {
            o.icon = DEFAULT_AVATAR_COME;
        } else if (s === DIRECTION_TYPE_GO) {
            o.icon = DEFAULT_AVATAR_GO;
        }

        sourceDataChildren.push(o);
    });

    let sourceData = {
        label: '',
        count: 0,
        direction: {
            go: 0,
            come: 0,
            goP: '0',
            comeP: '0',
        },
        children: [],
    };

    if (directionType === DIRECTION_TYPE_ALL) {
        sourceData = _.remove(sourceDataChildren, v => v.label === KEY_ALL)[0];
        // sourceData 是右下角排序的
        sourceData.children = sortByArr(sourceDataChildren, [DIRECTION_TYPE_GO, DIRECTION_TYPE_COME], 'label');
    } else if (directionType === DIRECTION_TYPE_COME) {
        sourceData = _.remove(sourceDataChildren, v => v.label === DIRECTION_TYPE_COME)[0];
    } else if (directionType === DIRECTION_TYPE_GO) {
        sourceData = _.remove(sourceDataChildren, v => v.label === DIRECTION_TYPE_GO)[0];
    }

    const { avgData, activityDayData } = makeSourceData_Avg_ActivityDay(countYearData, sourceData.direction);

    fs.writeFileSync(
        path.join(
            DIR_OUTPUT_PUBLIC_JSON_STATISTIC,
            `./${SOURCE_TYPE_CONTRAST}/${directionType}/${COUNT_DB_TYPE_WORDS}/sourceCount.json`,
        ),
        JSON.stringify({ sourceData, maxData, avgData, activityDayData }, null, 4),
    );
}
