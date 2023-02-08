import { Loading } from 'element-ui';

export function getObjectByLocalStorage(field) {
    const s = localStorage[field];
    if (!s) return null;
    try {
        return JSON.parse(s);
    } catch (error) {
        return null;
    }
}

/**
 * 格式化秒
 * @param result
 * @returns {string}
 */
export function formatSecond(result) {
    const d = Math.floor(result / 3600 / 24);
    const h = Math.floor((result / 3600) % 24);
    const m = Math.floor((result / 60) % 60);
    const s = Math.floor(result % 60);
    let hm;
    if (d > 0) {
        hm = `${d}天${h}小时${m}分钟${s}秒`;
    } else if (h > 0) {
        hm = `${h}小时${m}分钟${s}秒`;
    } else if (m > 0) {
        hm = `${m}分钟${s}秒`;
    } else {
        hm = s + '秒';
    }
    return hm;
}

export function deepFreeze(obj) {
    // 取回定义在obj上的属性名
    const propNames = Object.getOwnPropertyNames(obj);

    // 在冻结自身之前冻结属性
    propNames.forEach(name => {
        const prop = obj[name];

        // 如果prop是个对象，冻结它
        if (typeof prop == 'object' && prop !== null) deepFreeze(prop);
    });

    // 冻结自身(no-op if already frozen)
    return Object.freeze(obj);
}

let loadingInstance = null;
export function loading(on_off) {
    if (on_off) {
        console.group('loading');
        loadingInstance = Loading.service({
            fullscreen: true,
            lock: true,
            text: '拼命加载中',
            background: 'rgba(0, 0, 0, 0.8)',
        });
    } else {
        if (loadingInstance) loadingInstance.close();
        console.groupEnd('loading');
    }
}

export async function getClipboardContents(defaultText = '') {
    try {
        const text = await navigator.clipboard.readText();
        return text;
    } catch (err) {
        return defaultText;
    }
}

export function copyText(text, succ, err) {
    try {
        if (navigator.clipboard) {
            // clipboard api 复制
            navigator.clipboard.writeText(text);
        } else {
            const copyDom = document.createElement('textarea');
            copyDom.setAttribute('readonly', 'readonly');
            copyDom.setAttribute('value', text);
            copyDom.value = text;
            copyDom.readonly = 'readonly';
            document.body.appendChild(copyDom);
            // 隐藏此输入框
            copyDom.style.position = 'fixed';
            copyDom.style.clip = 'rect(0 0 0 0)';
            copyDom.style.top = '10px';
            // 赋值
            copyDom.value = text;
            // 选中
            copyDom.select();
            // ios 部分设备不支持 select();
            copyDom.setSelectionRange(0, copyDom.value.length);
            // 复制
            document.execCommand('copy', true);
            // 移除输入框
            document.body.removeChild(copyDom);
            copyDom.remove();
        }
        succ && succ(`复制成功 ${text}`);
    } catch (error) {
        err && err(`复制失败 ${error.message}`);
    }
}

export function GpsToNum(gpsStr) {
    const res = gpsStr.trim().match(/^(\d+(\.\d+){0,1}) deg (\d+(\.\d+){0,1})' (\d+(\.\d+){0,1})" [a-zA-Z]$/i);
    if (!res) throw new Error('Gps format unknown');
    const [, j, , f, , m] = res;
    let n = j * 1 + (f / 60) * 1 + (m / 3600) * 1;

    const d = gpsStr.trim().slice(-1).toUpperCase();

    if (d === 'S' || d === 'W') {
        n = n * -1;
    } // Don't do anything for N or E
    return n;
}

export function colorPercentage(c1, c2, p) {
    const [r1, g1, b1] = colorToRGB(c1);
    const [r2, g2, b2] = colorToRGB(c2);
    return colorToHex([getPNumber(r1, r2, p), getPNumber(g1, g2, p), getPNumber(b1, b2, p)]);
}

function getPNumber(n1, n2, p = 0.5) {
    if (n1 <= n2) {
        return Math.round(n1 + (n2 - n1) * p);
    } else {
        // if (n1 > n2)
        return Math.round(n1 - (n1 - n2) * p);
    }
}

function colorToRGB(c) {
    if (Array.isArray(c)) return c;
    if (typeof c == 'string' && !c.startsWith('#')) throw new Error('color not Hex');
    return [parseInt('0x' + c.slice(1, 3), 16), parseInt('0x' + c.slice(3, 5), 16), parseInt('0x' + c.slice(5, 7), 16)];
}

function colorToHex(c) {
    if (typeof c == 'string' && c.startsWith('#')) return c;
    if (!Array.isArray(c)) throw new Error('color not Rgb');
    const [r, g, b] = c;
    let hex = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    return hex;
}

export function openWin(link) {
    // 主要为了 clear sessionStorage
    const w = window.open();
    w.sessionStorage.clear();
    w.location.href = link;
}
export function openWinQueryById(id) {
    const path = location.href.split('?')[0];
    const url = `${path}?id=${encodeURIComponent(id)}`;
    openWin(url);
}

// 将字符串中特殊字符（正则控制字符） 替换
// 将用户输入转义为正则表达式中的一个字面字符串, 可以通过简单的替换来实现：
// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_Expressions
export function replaceSpecialKeyInStrToRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function htmlToText(html) {
    html = html.replace(/(\r\n|\r|\n)/gim, '<br/>');

    const div = document.createElement('div');
    div.innerHTML = html;

    Array.from(div.querySelectorAll('img')).forEach(img => {
        const alt = img.getAttribute('alt') || '图';
        img.outerHTML = `<span>[${alt}]</span>`;
    });

    // 替换空行  因为 div 未插入 document，所以 innerText 也不会转换成 \n
    Array.from(div.querySelectorAll('br')).forEach(br => {
        br.outerHTML = `\n`;
    });

    return div.innerText;
}

export function linkAbsolutely(url, protocol = 'http') {
    if (!url) return url;
    return url.startsWith(protocol) ? url : `${protocol}://${url}`;
}
