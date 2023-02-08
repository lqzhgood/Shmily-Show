import axiosBase from 'axios';
import { MessageBox } from 'element-ui';

const axios = axiosBase.create({
    baseURL: './json/',
    timeout: 3600 * 1000,
});

axios.interceptors.response.use(
    response => {
        return response.data;
    },
    error => {
        const { config } = error.response;
        MessageBox.alert(
            `无法获取数据 <br /> 请尝试访问 <a href="./json/${config.url}" target="_blank">./json/${config.url}</a>  是否有数据`,
            '错误',
            {
                type: 'error',
                confirmButtonText: '刷新',
                dangerouslyUseHTMLString: true,
            },
        );
        return Promise.reject(error);
    },
);

export default axios;
