import axiosBase from 'axios';
import { MessageBox } from 'element-ui';

import { MODIFY_SERVER } from '@/config';

const axios = axiosBase.create({
    baseURL: MODIFY_SERVER,
});

// 先拦截正常
axios.interceptors.response.use(response => {
    if (response.data.code !== 200) {
        throw new Error(response.data.msg);
    } else {
        return response.data;
    }
}, null);

// 再处理异常
axios.interceptors.response.use(null, error => {
    MessageBox.alert(error.message, '错误', {
        type: 'error',
        confirmButtonText: '确定',
        dangerouslyUseHTMLString: true,
    });
    return Promise.reject(error);
});

axios.file = function (url, file, data) {
    const param = new FormData();
    param.set('file', file);
    param.set('formData', JSON.stringify(data));

    return axios({
        method: 'post',
        url,
        headers: {
            'Content-Type': 'multipart/form-data;charset=UTF-8',
        },
        data: param,
    });
};
axios.files = function (url, files, data) {
    const param = new FormData();
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        param.append('files', file);
    }
    param.set('formData', JSON.stringify(data));

    return axios({
        method: 'post',
        url,
        headers: {
            'Content-Type': 'multipart/form-data;charset=UTF-8',
        },
        data: param,
    });
};

export default axios;
