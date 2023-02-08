import { Pie } from '@antv/g2plot';

const { numToPercent } = require('@/common.js');
import PlotWrap from '../utils/PlotWrapClass.js';

export class PlotPie extends PlotWrap {
    get configExtraDefault() {
        return { total: null };
    }

    get configPlotDefault() {
        const _this = this;
        return {
            height: 600,
            // appendPadding: 30,
            data: _this.db,
            angleField: 'count',
            colorField: 'label',
            radius: 1,
            innerRadius: 0.64,
            meta: {
                count: {
                    alias: '数量',
                },
            },
            label: {
                type: 'inner',
                offset: '-50%',
                autoRotate: false,
                style: { textAlign: 'center' },
                formatter: ({ percent }) => `${numToPercent(percent)}%`,
            },
            legend: {
                layout: 'horizontal',
                position: 'bottom',
                flipPage: false,
                // itemWidth: 120,
                offset: 0,
                itemValue: {
                    alignRight: true,
                    formatter: (text, item, index) => {
                        const count = _this.db[index].count;
                        return `${numToPercent(count / _this.configExtra.total, 2)}%`;
                    },
                },
            },
            statistic: {
                title: {
                    offsetY: -8,
                },
                content: {
                    offsetY: -4,
                },
            },
            // 添加 中心统计文本 交互
            interactions: [
                { type: 'element-selected' },
                { type: 'element-active' },
                {
                    type: 'pie-statistic-active',
                    cfg: {
                        start: [
                            { trigger: 'element:mouseenter', action: 'pie-statistic:change' },
                            { trigger: 'legend-item:mouseenter', action: 'pie-statistic:change' },
                        ],
                        end: [
                            { trigger: 'element:mouseleave', action: 'pie-statistic:reset' },
                            { trigger: 'legend-item:mouseleave', action: 'pie-statistic:reset' },
                        ],
                    },
                },
            ],
        };
    }

    constructor(elm, db, options = {}) {
        super(elm, db, options);
        this.plot = this.init(elm);
    }

    init(elm) {
        const plot = new Pie(elm, this.configPlot);

        plot.render();
        return plot;
    }
}
