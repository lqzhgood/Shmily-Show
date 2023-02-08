import { PLOT_COLOR_MAP, CONST_USE_COLOR_MAP } from './index.js';

class PlotWrap {
    plot = null; // 图表实例
    db = null;

    // 额外的配置
    _options = {
        plot: {},
        extra: {},
    };
    set configPlot(v) {
        this._options.plot = Object.assign({}, this._options.plot, v);
    }
    set configExtra(v) {
        this._options.extra = Object.assign({}, this._options.extra, v);
    }

    get configPlotGlobal() {
        return {};
    }
    get configExtraGlobal() {
        return {};
    }

    get configPlot() {
        const config = Object.assign({}, this.configPlotGlobal, this.configPlotDefault, this._options.plot);
        const field = config.colorField || config.seriesField;

        if (config.color === CONST_USE_COLOR_MAP) {
            config.color = function (typeData) {
                return PLOT_COLOR_MAP[typeData[field]];
            };
        }

        return config;
    }

    get configExtra() {
        return Object.assign({}, this.configExtraGlobal, this.configExtraDefault, this._options.extra);
    }

    constructor(elm, db, options = {}) {
        this.db = db;

        this.configPlot = options.plot;
        this.configExtra = options.extra;
    }

    changeData(db, options = {}) {
        this.db = db;

        this.configPlot = options.plot;
        this.configExtra = options.extra;

        this.plot.changeData(this.db);
    }

    destroy() {
        if (this.plot) this.plot.destroy();
    }
}

export default PlotWrap;
