import G6 from '@antv/g6';
import PlotWrap from '../utils/PlotWrapClass.js';

import { TreeGraphRegister } from '../utils/g6/register.js';

TreeGraphRegister();

export class PlotTreeGraph extends PlotWrap {
    eventList = {};

    get configPlotDefault() {
        return {
            modes: {
                default: ['zoom-canvas', 'drag-canvas'],
            },
            fitView: true,
            animate: true,
            defaultNode: {
                type: 'flow-rect',
            },
            defaultEdge: {
                type: 'cubic-horizontal',
                style: {
                    stroke: '#CED4D9',
                },
            },
            layout: {
                type: 'indented',
                direction: 'LR',
                dropCap: false,
                indent: 300,
                getHeight: () => {
                    return 60;
                },
            },
            padding: [10, 10],
            defaultLevel: 3,
            defaultZoom: 0.8,
            plugins: [],
        };
    }

    constructor(elm, db, options = {}) {
        super(elm, db, options);
        this.plot = this.init(elm);
    }
    init(elm) {
        const container = elm;

        const graph = new G6.TreeGraph(
            Object.assign(this.configPlot, {
                container,
                width: container.scrollWidth,
                height: container.scrollHeight || 400,
            }),
        );

        graph.data(this.db);
        graph.render();
        // graph.zoom(config.defaultZoom || 1);
        graph.moveTo(0, 0);

        const handleCollapse = e => {
            const target = e.target;
            const id = target.get('modelId');
            const item = graph.findById(id);
            const nodeModel = item.getModel();
            nodeModel.collapsed = !nodeModel.collapsed;
            graph.layout();
            graph.setItemState(item, 'collapse', nodeModel.collapsed);
        };
        graph.on('collapse-text:click', e => {
            handleCollapse(e);
        });
        graph.on('collapse-back:click', e => {
            handleCollapse(e);
        });

        this._on('resize', () => {
            if (!graph || graph.get('destroyed')) return;
            if (!container || !container.scrollWidth || !container.scrollHeight) return;
            graph.changeSize(container.scrollWidth, container.scrollHeight);
        });

        return graph;
    }
    _on(eventName, fn) {
        if (typeof window === 'undefined') return;

        if (this.eventList[eventName]) return;
        this.eventList[eventName] = fn;
        window.addEventListener(eventName, fn, false);
    }
    _off(eventName) {
        if (!this.eventList[eventName]) return;
        const fn = this.eventList[eventName];
        window.removeEventListener(eventName, fn, false);
        delete this.eventList[eventName];
    }
    changeData(db) {
        this.db = db;
        this.plot.changeData(this.db);
        this.plot.moveTo(0, 0);
    }

    destroy() {
        this._off('resize');
        if (this.plot) this.plot.destroy();
    }
}
