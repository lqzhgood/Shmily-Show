import { Message } from 'element-ui';
import axiosServer from '@/plugins/axios-server';
import { TMPL_HTML_MSG_QQ_VIDEO, EXT_VIDEO, EXT_IMAGE } from '@/utils/const';

export default _this => [
    {
        label: 'qq-video',
        des: '根据 qq/video 下的文件名自动修改MSG',
        fn: async msg => {
            msg.type = '视频';

            const [err, value] = await _this.msgBoxPrompt({ title: '输入视频文件名' });
            if (err) return null;
            if (!value) {
                msg.content = '';
                msg.html = '';
                return null;
            }

            const { result: files } = await axiosServer.get(`/assets/flies/${value}`, {
                params: { source: msg.source, type: msg.type },
            });
            if (files.length === 0 || files.length >= 3) {
                Message({ type: 'error', message: `文件不存在 ${files.join(' | ')}` });
                return null;
            }

            // 后端已处理 视频排前
            let [videoFile = '', imgFile = ''] = files;
            if (!imgFile) imgFile = videoFile;

            const vExt = '.' + videoFile.split('.').pop().toLowerCase();
            if (!EXT_VIDEO.includes(vExt)) {
                Message({ type: 'error', message: `视频文件不存在 ${videoFile}` });
                videoFile = '';
            }

            const iExt = '.' + imgFile.split('.').pop().toLowerCase();
            if (!EXT_IMAGE.includes(iExt)) {
                Message({ type: 'error', message: `图片文件不存在 ${imgFile}` });
                imgFile = '';
            }

            msg.content = '[视频]';
            msg.html = TMPL_HTML_MSG_QQ_VIDEO(videoFile, imgFile);
            return msg;
        },
    },
    {
        label: 'qq-视频通话',
        fn: msg => {
            msg.type = '视频通话';
            msg.content = '已在其他设备处理';
            msg.html = '已在其他设备处理';
            return msg;
        },
    },
    {
        label: 'qq-语音',
        fn: async msg => {
            msg.type = '语音';

            // 允许不输入 所以 err 不管
            // eslint-disable-next-line no-unused-vars
            const [errInput, fileName] = await _this.msgBoxPrompt({
                title: '输入文件名',
                message: './data/qq-pc/audio/manual/',
            });

            // eslint-disable-next-line no-unused-vars
            const [errTts, tts] = await _this.msgBoxPrompt({
                title: '请输入语音内容',
            });

            const src = fileName ? `./data/qq-pc/audio/manual/${fileName}` : '';

            msg.content = '[语音消息]';
            msg.html = `<audio controls src='${src}' ></audio>`;

            if (tts) {
                msg.content += tts;
                msg.html += `<div>${tts}</div>`;
            }
            return msg;
        },
    },
];
