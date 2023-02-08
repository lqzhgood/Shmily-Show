import { G2 } from '@antv/g2plot';

// 全局性的一些设置
export function HeatmapRegister() {
    G2.registerShape('polygon', 'week-boundary-polygon', {
        draw(cfg, container) {
            const group = container.addGroup();
            const attrs = {
                stroke: '#fff',
                lineWidth: 1,
                fill: cfg.color,
                path: [],
            };
            const points = cfg.points;
            const path = [
                ['M', points[0].x, points[0].y],
                ['L', points[1].x, points[1].y],
                ['L', points[2].x, points[2].y],
                ['L', points[3].x, points[3].y],
                ['Z'],
            ];
            // @ts-ignore
            attrs.path = this.parsePath(path);
            group.addShape('path', {
                attrs,
            });

            if (cfg.data.lastWeek) {
                const linePath = [
                    ['M', points[2].x, points[2].y],
                    ['L', points[3].x, points[3].y],
                ];
                // 最后一周的多边形添加右侧边框
                group.addShape('path', {
                    attrs: {
                        path: this.parsePath(linePath),
                        lineWidth: 3,
                        stroke: '#404040',
                    },
                });
                if (cfg.data.lastDay) {
                    group.addShape('path', {
                        attrs: {
                            path: this.parsePath([
                                ['M', points[1].x, points[1].y],
                                ['L', points[2].x, points[2].y],
                            ]),
                            lineWidth: 3,
                            stroke: '#404040',
                        },
                    });
                }
            }
            return group;
        },
    });

    G2.registerShape('polygon', 'day-boundary-polygon', {
        draw(cfg, container) {
            const group = container.addGroup();
            const attrs = {
                stroke: '#fff',
                lineWidth: 0,
                fill: cfg.color,
                path: [],
            };
            const points = cfg.points;
            const path = [
                ['M', points[0].x, points[0].y],
                ['L', points[1].x, points[1].y],
                ['L', points[2].x, points[2].y],
                ['L', points[3].x, points[3].y],
                ['Z'],
            ];
            // @ts-ignore
            attrs.path = this.parsePath(path);
            group.addShape('path', {
                attrs,
            });

            if (cfg.data.lastWeek) {
                const linePath = [
                    ['M', points[2].x, points[2].y],
                    ['L', points[3].x, points[3].y],
                ];
                // 最后一周的多边形添加右侧边框
                group.addShape('path', {
                    attrs: {
                        path: this.parsePath(linePath),
                        lineWidth: 1,
                        stroke: '#404040',
                        // stroke: '#ff0000',
                    },
                });
                if (cfg.data.lastDay) {
                    group.addShape('path', {
                        attrs: {
                            path: this.parsePath([
                                ['M', points[1].x, points[1].y],
                                ['L', points[2].x, points[2].y],
                            ]),
                            lineWidth: 1,
                            stroke: '#404040',
                            // stroke: '#ff0000',
                        },
                    });
                }
            }
            return group;
        },
    });
}
