import { linkAbsolutely } from '@/utils/index.js';

export function type_5008(data) {
    // $app $view 一一对应
    // https://github.com/lqzhgood/Shmily-Get-MobileQQ-Andriod
    // decode\typeHandle\share5008\app\index.js
    switch (data.$app) {
        case 'com.tencent.structmsg':
            return type_5008_structmsg(data);
        case 'com.tencent.qzone.albumInvite':
            return type_5008_qzone_albumInvite(data);
        default:
            return {
                title: '',
                des: '',
                appName: '',
                url: '',
                other: '',
                coverLink: '',
                appLink: '',
                appIconLocalUrl: '',
            };
    }
}

export function type_5008_structmsg(data) {
    const o = {
        title: data.title,
        des: data.desc,
        appName: data.tag,
        url: linkAbsolutely(data.jumpUrl),
        other: '',
        coverLink: linkAbsolutely(data.preview),
        appLink: linkAbsolutely(data.source_url),
        appIconLocalUrl: data.$iconLocalUrl,
    };
    switch (data.$view) {
        case 'news': {
            break;
        }
        case 'music': {
            o.url = linkAbsolutely(data.musicUrl);
            break;
        }
    }
    return o;
}

export function type_5008_qzone_albumInvite(data) {
    return {
        title: data.title,
        des: data.desc,
        appName: 'QQ空间',
        url: linkAbsolutely(data.h5Url),
        other: data.host_nick,
        coverLink: data.pics, // Array
        appLink: linkAbsolutely(data.source_url),
        appIconLocalUrl: data.$iconLocalUrl,
    };
}
