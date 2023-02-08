import axios from 'axios';
import _ from 'lodash';

import { CONSOLE_STYLE } from '@/utils/const';

export function fileExist(url) {
    return new Promise((resolve, reject) => {
        // 找一个小巧的 web 服务器简单
        // 但是找一个完备的小巧 web 服务器太难了
        // 很多都没有对 HEAD 方法做处理
        // 只能 hack 的方式用 get 请求 1 字节方式实现判断文件是否存在了
        axios
            .get(url, {
                headers: {
                    Range: 'bytes=0-0',
                },
                timeout: 1 * 1000,
            })
            .then(res => {
                resolve(true);
            })
            .catch(err => {
                resolve(false);
                if (!(_.get(err, 'request.status') == 404 || _.get(err, 'response.status') == 404)) {
                    CONSOLE_STYLE.danger('附件文件探测出错', err.message);
                }
            });
    });
}
