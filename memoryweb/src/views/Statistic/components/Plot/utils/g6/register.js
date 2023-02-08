import G6 from '@antv/g6';
import { DEFAULT_AVATAR_COME, DEFAULT_AVATAR_GO } from '../../../../const.js';

import { COLOR_PLATE } from '@/utils/const';
const { numToPercent } = require('@/common.js');

// 自定义节点、边
export function TreeGraphRegister() {
    /**
     * 自定义节点
     */
    G6.registerNode(
        'flow-rect',
        {
            shapeType: 'flow-rect',
            draw(cfg, group) {
                const { id, label = '', percent, count, collapsed, icon, index, direction } = cfg;
                const color = COLOR_PLATE[index % COLOR_PLATE.length];
                const grey = '#CED4D9';
                // 逻辑不应该在这里判断
                const rectConfig = {
                    width: 270,
                    height: 60,
                    lineWidth: 1,
                    fontSize: 12,
                    fill: '#fff',
                    radius: 4,
                    stroke: grey,
                    opacity: 1,
                };

                const nodeOrigin = {
                    x: -rectConfig.width / 2,
                    y: -rectConfig.height / 2,
                };

                const textConfig = {
                    textAlign: 'left',
                    textBaseline: 'bottom',
                };
                const textRightConfig = {
                    textAlign: 'right',
                    textBaseline: 'bottom',
                };

                const rect = group.addShape('rect', {
                    attrs: {
                        x: nodeOrigin.x,
                        y: nodeOrigin.y,
                        ...rectConfig,
                    },
                });

                const rectBBox = rect.getBBox();

                // 开始画画

                // label
                group.addShape('text', {
                    attrs: {
                        ...textConfig,
                        x: 12 + 20 + 5 + nodeOrigin.x, // padding-left <-- font-width  <- padding-right  <- center
                        y: 25 + nodeOrigin.y,
                        text: label.length > 28 ? label.substr(0, 28) + '...' : label,
                        fontSize: 12,
                        opacity: 0.85,
                        fill: '#000',
                        cursor: 'pointer',
                    },
                    name: 'name-shape',
                });

                // totalCount
                // eslint-disable-next-line
                const totalCount = group.addShape('text', {
                    attrs: {
                        ...textConfig,
                        x: 12 + nodeOrigin.x,
                        y: rectBBox.maxY - 12,
                        text: count,
                        fontSize: 16,
                        fill: '#000',
                        opacity: 0.85,
                    },
                });

                //  avatar icon come
                const comeIcon = group.addShape('image', {
                    attrs: {
                        x: rectBBox.minX + 100,
                        y: 6 + nodeOrigin.y,
                        img: DEFAULT_AVATAR_COME,
                        width: 16,
                        height: 16,
                        opacity: 0.75,
                    },
                });
                group.addShape('text', {
                    attrs: {
                        ...textRightConfig,
                        x: comeIcon.getBBox().maxX + 90,
                        y: comeIcon.getBBox().maxY,
                        text: direction.come + ` / ${direction.comeP}%`,
                        fontSize: 12,
                        opacity: 0.85,
                        fill: '#F589CB',
                        cursor: 'pointer',
                    },
                    name: 'name-shape',
                });
                // avatar icon go
                const goIcon = group.addShape('image', {
                    attrs: {
                        x: rectBBox.minX + 100,
                        y: comeIcon.getBBox().maxY + 10,
                        img: DEFAULT_AVATAR_GO,
                        width: 16,
                        height: 16,
                        opacity: 0.75,
                    },
                });
                group.addShape('text', {
                    attrs: {
                        ...textRightConfig,
                        x: goIcon.getBBox().maxX + 90,
                        y: goIcon.getBBox().maxY,
                        text: direction.go + ` / ${direction.goP}%`,
                        fontSize: 12,
                        opacity: 0.85,
                        fill: '#55ADCA',
                        cursor: 'pointer',
                    },
                    name: 'name-shape',
                });
                // icon
                group.addShape('image', {
                    attrs: {
                        x: 12 + nodeOrigin.x,
                        y: 5 + nodeOrigin.y,
                        img: icon,
                        width: 20,
                        height: 20,
                        opacity: 0.75,
                    },
                });

                // totalPercent
                // eslint-disable-next-line
                const totalPercent = group.addShape('text', {
                    attrs: {
                        ...textConfig,
                        x: rectBBox.maxX - 12,
                        y: rectBBox.maxY - 12,
                        text: `${numToPercent(percent || 0, 2)}%`,
                        fontSize: 12,
                        textAlign: 'right',
                        fill: color,
                    },
                });

                // bottom line background
                // eslint-disable-next-line
                const bottomBackRect = group.addShape('rect', {
                    attrs: {
                        x: nodeOrigin.x,
                        y: rectBBox.maxY - 4,
                        width: rectConfig.width,
                        height: 4,
                        radius: [0, 0, rectConfig.radius, rectConfig.radius],
                        fill: '#E0DFE3',
                    },
                });

                // bottom percent
                // eslint-disable-next-line
                const bottomRect = group.addShape('rect', {
                    attrs: {
                        x: nodeOrigin.x,
                        y: rectBBox.maxY - 4,
                        width: percent * rectBBox.width,
                        height: 4,
                        radius: [0, 0, 0, rectConfig.radius],
                        fill: color,
                    },
                });
                // collapse rect
                if (cfg.children && cfg.children.length) {
                    group.addShape('rect', {
                        attrs: {
                            x: rectConfig.width / 2 - 8,
                            y: -8,
                            width: 16,
                            height: 16,
                            stroke: 'rgba(0, 0, 0, 0.25)',
                            cursor: 'pointer',
                            fill: '#fff',
                        },
                        name: 'collapse-back',
                        modelId: id,
                    });

                    // collpase text
                    group.addShape('text', {
                        attrs: {
                            x: rectConfig.width / 2,
                            y: -1,
                            textAlign: 'center',
                            textBaseline: 'middle',
                            text: collapsed ? '+' : '-',
                            fontSize: 16,
                            cursor: 'pointer',
                            fill: 'rgba(0, 0, 0, 0.25)',
                        },
                        name: 'collapse-text',
                        modelId: id,
                    });
                }

                this.drawLinkPoints(cfg, group);
                return rect;
            },
            update(cfg, item) {
                const group = item.getContainer();
                this.updateLinkPoints(cfg, group);
            },
            setState(name, value, item) {
                if (name === 'collapse') {
                    const group = item.getContainer();
                    const collapseText = group.find(e => e.get('name') === 'collapse-text');
                    if (collapseText) {
                        if (!value) {
                            collapseText.attr({
                                text: '-',
                            });
                        } else {
                            collapseText.attr({
                                text: '+',
                            });
                        }
                    }
                }
            },
            getAnchorPoints() {
                return [
                    [0, 0.5],
                    [1, 0.5],
                ];
            },
        },
        'rect',
    );
}
