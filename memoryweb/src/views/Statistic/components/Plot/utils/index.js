import ALL_SOURCE from '@/assets/data_pre/statistic/Msg/ALL_SOURCE';
import { KEY_ALL } from '../../../const.js';
import { COLOR_PLATE, CONSOLE_STYLE } from '@/utils/const.js';

import STYLE_VARS from '@/styles/vars.module.sass';
const { color_direction_go, color_direction_come } = STYLE_VARS;

const ALL_SOURCE_COLOR_MAP = [KEY_ALL, ...ALL_SOURCE].reduce((pre, s, i) => {
    pre[s] = COLOR_PLATE[i];
    return pre;
}, {});

const ALL_COLOR_MAP = Object.assign({}, ALL_SOURCE_COLOR_MAP, {
    come: color_direction_come,
    go: color_direction_go,
});

export const PLOT_COLOR_MAP = new Proxy(ALL_COLOR_MAP, {
    get(target, key) {
        if (!target[key]) {
            // 没有颜色就把字符串 ASCII 叠加后和 COLOR_PLATE 长度取余, 从 COLOR_PLATE 取一个
            const n = stringToNum(key) % COLOR_PLATE.length;
            const c = COLOR_PLATE[n];
            CONSOLE_STYLE.danger(`没有 ${key} 对应的颜色 ${n}`);
            console.log(`%c 随机颜色为 ${c}`, `color:${c}`);
            return c;
        } else {
            return target[key];
        }
    },
});

export const CONST_USE_COLOR_MAP = 'CONST_USE_COLOR_MAP';

function stringToNum(str) {
    let n = 0;
    for (let i = 0; i < str.length; i++) {
        n += str.charCodeAt(i);
    }

    return n;
}
