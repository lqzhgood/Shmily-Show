import { WordCloud } from '@antv/g2plot';
import PlotWrap from '../utils/PlotWrapClass.js';

export class PlotWordCloud extends PlotWrap {
    get configPlotDefault() {
        const _this = this;

        return {
            data: _this.db,
            timeInterval: 10 * 1000,
            wordField: 'w',
            weightField: 'n',
            colorField: 'w',
            random: () => 0.5,
            spiral: 'rectangular',
            wordStyle: {
                rotation: 0,
            },
            legend: {
                // title: {
                //     text: '次数 排名',
                //     style: {
                //         fontSize: 14,
                //         fontWeight: 'bold',
                //         textAlign: 'right', //bug
                //     },
                // },
                position: 'right',
                itemHeight: 14,
                itemValue: {
                    alignRight: true,
                    formatter: (text, item, index) => {
                        const v = _this.db.find(({ w }) => w === text);
                        return v.n + String(v.i).padStart(8, ' ');
                    },
                },
            },
            tooltip: {
                formatter: ({ text }) => {
                    const v = _this.db.find(({ w }) => w === text);
                    return { name: v.w, value: `次数 ${v.n} / 排名 ${v.i}` };
                },
            },
            // 设置交互类型
            interactions: [{ type: 'element-active' }, { type: 'element-single-selected' }],
        };
    }
    constructor(elm, data, options = {}) {
        super(elm, data, options);
        this.plot = this.init(elm);
    }
    init(elm) {
        const plot = new WordCloud(elm, this.configPlot);

        plot.render();
        return plot;
    }
}
