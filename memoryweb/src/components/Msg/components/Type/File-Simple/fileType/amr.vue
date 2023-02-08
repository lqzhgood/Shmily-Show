<template>
    <div class="amr">
        <button @click="play()">播放</button>
        <button @click="stop()">停止</button>
    </div>
</template>
<script>
/*global  BenzAMRRecorder*/
// https://github.com/BenzLeung/benz-amr-recorder
import BenzAMRRecorder from 'benz-amr-recorder';

export default {
    name: 'fileType-amr',
    props: {
        url: {
            type: String,
            require: true,
        },
    },
    data: () => ({
        amr: null,
    }),
    methods: {
        init() {
            const _this = this;
            _this.amr = new BenzAMRRecorder();
            _this.amr
                .initWithUrl(this.url)
                .then(() => {
                    _this.amr.playOrPauseOrResume();
                })
                .catch(err => {
                    console.error('amr err', err.message);
                    _this.$message({
                        type: 'error',
                        dangerouslyUseHTMLString: true,
                        message: `<p>文件不存在或读取失败</p><p>请点击链接下载后,使用本地音乐播放器播放</p><p>${err.message}</p>`,
                        duration: 10 * 1000,
                    });
                    _this.amr = null;
                });
        },
        play() {
            if (!this.amr) {
                this.init();
            } else {
                this.amr.playOrPauseOrResume();
            }
        },
        stop() {
            if (!this.amr) {
                this.init();
            } else {
                this.amr.stop();
            }
        },
    },
    beforeDestroy() {
        if (this.amr) this.amr.destroy();
    },
};
</script>
<style lang="sass" scoped></style>
