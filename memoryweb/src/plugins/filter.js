import Vue from 'vue';

// import dayjs from 'dayjs';
// Vue.filter('day', (value, fmt = 'YYYY/MM/DD HH:mm:ss') => {
//     return dayjs(value).format(fmt);
// });

Vue.filter('Highlight', (str, keyArrByType) => {
    if (!str) return str;
    const { rKey, iKey } = keyArrByType;
    // eKey 排除的结果不会又 Highlight 所以不需要处理
    for (let i = 0; i < rKey.length; i++) {
        const reg = rKey[i];
        str = str.replace(reg, key => `<span class="Highlight">${key}</span>`);
    }

    if (iKey.length === 0) return str;
    const reg = new RegExp(`(${iKey.join('|')})`, 'gim');
    str = str.replaceAll(reg, key => `<span class="Highlight">${key}</span>`);

    return str;
});
