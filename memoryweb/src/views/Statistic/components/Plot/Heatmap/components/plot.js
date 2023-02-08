import { Heatmap } from '@antv/g2plot';
import _ from 'lodash';

import { colorPercentage } from '@/utils/index';
import { CONFIG_YEAR, CONFIG_WEEK, CONFIG_DAY } from '../config.js';
import {
    SOURCE_TYPE_TOTAL,
    HEATMAP_DB_TYPE_YEAR,
    HEATMAP_DB_TYPE_WEEK,
    HEATMAP_DB_TYPE_DAY,
} from '@/views/Statistic/const.js';

import { tmplTitle, tmplListItem, tmplType } from '@/views/Statistic/components/Plot/utils/g2/tmpl-tooltip.js';

import PlotWrap from '../../utils/PlotWrapClass.js';

import { HeatmapRegister } from '../../utils/g2/register';

HeatmapRegister();

export class PlotHeatmap extends PlotWrap {
    get configExtraDefault() {
        return {
            type: null, // [year week day]
            sourceType: null,
            maxTypeIsAll: null,
            showDirection: true,
            columns: '',
        };
    }

    get configTmpl() {
        switch (this.configExtra.type) {
            case HEATMAP_DB_TYPE_YEAR:
                return CONFIG_YEAR;
            case HEATMAP_DB_TYPE_WEEK:
                return CONFIG_WEEK;
            case HEATMAP_DB_TYPE_DAY:
                return CONFIG_DAY;
            default:
                throw new Error('heatmap type error');
        }
    }
    get max() {
        const { type, maxTypeIsAll } = this.configExtra;
        const db = this.db;

        if (type === HEATMAP_DB_TYPE_YEAR) return db.max;
        return maxTypeIsAll ? db.max : db.data.max;
    }
    get data() {
        const { type } = this.configExtra;

        if (type === HEATMAP_DB_TYPE_YEAR) {
            return this.db.data;
        } else {
            return this.db.data.data;
        }
    }

    get configPlotDefault() {
        const _this = this;

        return {
            data: _this.data,
            colorField: 'count',
            // color: ['#BAE7FF', '#1890FF', '#0050B3'],
            color: ({ count: c }) => {
                // colorField 对应的值
                if (c == 0) return '#D9D9D9';
                const p = c / _this.max;
                return getColor(p);
            },
            reflect: 'y',
            tooltip: {
                title: 'date',
                showMarkers: false,
                // enterable: true, // 鼠标移入会挡住
                customContent: (title, boxData) => {
                    if (boxData.length == 0) return '';
                    boxData = boxData[0];

                    const data_all = boxData.data;
                    const allHtml = () => {
                        const go = _.get(data_all, 'direction.go', 0);
                        const come = _.get(data_all, 'direction.come', 0);
                        const goP = _.get(data_all, 'direction.goP', '-');
                        const comeP = _.get(data_all, 'direction.comeP', '-');

                        return tmplListItem(
                            data_all.source,
                            boxData.color,
                            data_all.count,
                            come,
                            comeP,
                            go,
                            goP,
                            '<hr />',
                        );
                    };
                    const data_source = data_all.type;

                    let sourceHTML;
                    if (_this.configExtra.sourceType === SOURCE_TYPE_TOTAL) {
                        sourceHTML = data_source
                            .map(({ source, direction: direction_s, count: count_s, type: types }) => {
                                const typeHTML = types
                                    .map(({ type, count: count_t, direction: direction_t }) => {
                                        const { go, come, goP, comeP } = direction_t;
                                        return tmplType(source, type, count_t, go, goP, come, comeP);
                                    })
                                    .join('');

                                const { go, come, goP, comeP } = direction_s;

                                const p = count_s / _this.max;
                                const color = getColor(p);

                                return tmplListItem(source, color, count_s, come, comeP, go, goP, typeHTML);
                            })
                            .join('');
                    } else {
                        const { source } = data_all;
                        sourceHTML = data_source
                            .map(({ direction: direction_t, count: count_t, type }) => {
                                const { go, come, goP, comeP } = direction_t;
                                const typeHTML = tmplType(source, type, count_t, go, goP, come, comeP);
                                return `<div class="list-item ${source}">${typeHTML}</div>`;
                            })
                            .join('');
                    }

                    const moreClass = [];
                    if (_this.configExtra.columns) {
                        moreClass.push(_this.configExtra.columns);
                    } else {
                        moreClass.push(data_source.length <= 4 ? 'one-columns' : 'two-columns');
                    }
                    if (!_this.configExtra.showDirection) {
                        moreClass.push(`hiddenDirection`);
                    }

                    return tmplTitle(title, `${allHtml()}${sourceHTML}`, {
                        moreClass: moreClass.join(' '),
                    });
                },
            },
            interactions: [{ type: 'element-active' }],
        };
    }

    constructor(elm, db, options = {}) {
        super(elm, db, options);

        this.plot = this.init(elm);
    }
    init(elm) {
        const plot = new Heatmap(elm, Object.assign(this.configPlot, this.configTmpl));

        plot.render();
        return plot;
    }

    changeMaxTypeIsAll(v) {
        this.changeData(this.db, { extra: { maxTypeIsAll: v } });
    }

    changeData(db, options = {}) {
        this.db = db;

        this.configPlot = options.plot;
        this.configExtra = options.extra;

        this.plot.changeData(this.data);
    }
}

function getColor(p) {
    return p <= 0.5 ? colorPercentage('#BAE7FF', '#1890FF', p) : colorPercentage('#1890FF', '#0050B3', p);
}
