import _ from 'lodash';
import { Line } from '@antv/g2plot';

import { COLOR_PLATE } from '@/utils/const';
import { KEY_ALL } from '@/views/Statistic/const';

import { tmplTitle, tmplListItem, tmplType } from '@/views/Statistic/components/Plot/utils/g2/tmpl-tooltip.js';

import PlotWrap from '../utils/PlotWrapClass.js';

export class PlotLine extends PlotWrap {
    get configExtraDefault() {
        return {
            showDirection: true,
            columns: '',
        };
    }

    get configPlotDefault() {
        const _this = this;

        return {
            data: _this.db,
            xField: 'date',
            yField: 'count',
            seriesField: 'source',
            color: COLOR_PLATE,
            slider: {
                start: 0,
                end: 1,
            },
            height: 460,
            padding: [100, 0, 80, 50],
            interactions: [{ type: 'brush-x' }],
            // eslint-disable-next-line
            lineStyle({ source }) {
                if (source === KEY_ALL) {
                    return {
                        lineWidth: 1,
                        lineDash: [4, 5],
                        strokeOpacity: 0.7,
                        shadowColor: 'black',
                        shadowBlur: 10,
                        shadowOffsetX: 5,
                        shadowOffsetY: 5,
                    };
                }
                // 除了 KEY_ALL 其余用默认颜色
            },
            tooltip: {
                // enterable: true, // 鼠标移入会挡住
                customContent: (title, data) => {
                    const listHtml = data
                        .map(({ color, data: d }) => {
                            const d_go = _.get(d, 'direction.go', '0');
                            const d_come = _.get(d, 'direction.come', '0');
                            const d_goP = _.get(d, 'direction.goP', '-');
                            const d_comeP = _.get(d, 'direction.comeP', '-');
                            const typeHTML = d.source === KEY_ALL ? '<hr />' : _this._typeHTML(d);
                            return tmplListItem(d.source, color, d.count, d_come, d_comeP, d_go, d_goP, typeHTML);
                        })
                        .join('');

                    const moreClass = [];
                    if (_this.configExtra.columns) {
                        moreClass.push(_this.configExtra.columns);
                    } else {
                        moreClass.push(data.length <= 4 ? 'one-columns' : 'two-columns');
                    }
                    if (!_this.configExtra.showDirection) {
                        moreClass.push(`hiddenDirection`);
                    }

                    return tmplTitle(title, listHtml, {
                        moreClass: moreClass.join(' '),
                    });
                },
            },
        };
    }

    constructor(elm, db, options = {}) {
        super(elm, db, options);

        this.plot = this.init(elm);
    }

    init(elm) {
        const plot = new Line(elm, this.configPlot);

        plot.render();
        return plot;
    }

    _typeHTML(d) {
        if (!d.type) return '';
        return d.type
            .map(({ type, count, direction }) => {
                const { go, come, goP, comeP } = direction;
                return tmplType(d.source, type, count, go, goP, come, comeP);
            })
            .join('');
    }
}
