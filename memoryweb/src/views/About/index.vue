<template>
    <div id="AboutPage">
        <div class="top">
            <div class="logo">
                <a href="https://github.com/lqzhgood/Shmily" target="_blank">
                    <img alt="github" src="./assets/logo-github.png" />
                </a>
            </div>
            <div class="panel">
                <div class="title">
                    <span class="bar"></span>
                    <h4 ref="shmily" @click="w"></h4>
                    <span class="typed-cursor typed-cursor--blink" aria-hidden="true">_</span>
                </div>
                <div class="content">
                    <p>好像应该说点什么，但我又不知该说些什么。</p>
                    <p>In case I don't see you, Good afternoon, Good evening, and Good night!</p>
                    <p
                        style="text-align: right; font-size: 12px; cursor: pointer"
                        @click="openWin(`/#/query?id=msg-qq_s60.json_2010-02-24_10-48-45_c_d9377d_1`)"
                    >
                        ~2008/12/18 - 2019/09/13 > 3921天
                    </p>
                </div>
            </div>
        </div>
        <div class="bottom">
            <div class="panel">
                <div class="img-holder" @click="rotate = !rotate" :class="{ rotate: rotate }">
                    <div class="img-border">
                        <img src="./assets/cover-front.jpg" class="cover front" />
                        <img src="./assets/cover-back.png" class="cover back" />
                    </div>
                </div>
                <div class="content">
                    <h4>My Love</h4>
                    <p v-for="(t, i) in loadingTexts" :key="i">{{ t }}</p>

                    <div class="love">
                        Made by lqzh, Powered by
                        <span class="heart">♥</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Typing from './typing.js';
import { openWin } from '@/utils/index.js';
import { loadingTexts } from '@/config.js';

export default {
    name: 'View-About',
    async mounted() {
        this.$store.commit('app/setInitOk');

        await this.$nextTick();

        this.typing = new Typing(this.$refs.shmily, { speed: 80 });
        await this.w();
    },
    data: () => ({
        loadingTexts,
        typing: null,
        rotate: false,
    }),
    methods: {
        async w() {
            if (this.typing.working) return;

            let i = this.$refs.shmily.dataset.index || 0;
            const sArr = ['SHMILY', 'See How Much I Love You~ ', 'She History, Much In Leave Years. '];

            await this.typing.w(sArr[i]);

            i++;
            if (i > sArr.length - 1) {
                i = 0;
            }
            this.$refs.shmily.dataset.index = i;
        },
        openWin,
    },
};
</script>

<style lang="sass" scoped>
#AboutPage
    width: 100%
    height: 100%
    background: #F5F5F5
    display: flex
    flex-direction: column
    overflow: auto
    background: radial-gradient(rgba(0,0,0,0), rgba(0, 0, 0, 0.2))
    font-family: 'Source Han Sans SC', 'Roboto', sans-serif
    p
        margin: 0
        padding: 0
    @media screen and (min-width: 960px)
        overflow: hidden
    .top
        position: relative
        .logo
            position: absolute
            top: 20px
            right: 20px
            max-width: 48px
            max-height: 48px
            img
                max-width: 100%
                max-height: 100%
        .panel
            width: 100%
            padding: 7vw 10vw 7vw
            box-sizing: border-box
            display: flex
            justify-content: space-between
            @media screen and (max-width: 768px)
                flex-direction: column
                padding-top: 64px
            @media screen and (min-width: 1280px)
                padding: 7vw 15vw 7vw
            .title
                width: 50%
                vertical-align: baseline
                font-size: 16px
                @media screen and (max-width: 768px)
                    width: 100%
                    margin-bottom: 24px
                h4
                    display: inline-block
                    letter-spacing: 2px
                    margin: 0
                    white-space: nowrap
                    font-size: 16px
                    @media screen and (max-width: 768px)
                        font-size: 14px
                    @media screen and (min-width: 1280px)
                        font-size: calc(16px + 3 * ((100vw - 1280px) / 1280))
                    @media screen and (min-width: 2560px)
                        font-size: 19px

                .bar
                    border-radius: 1px
                    display: block
                    margin: -24px 0 24px
                    height: 4px
                    width: 44px
                    background: linear-gradient(90deg, #DE645E,#B43B8B)
                .typed-cursor
                    opacity: 1
                .typed-cursor.typed-cursor--blink
                    animation: typedBlink 0.7s infinite
            .content
                width: 50%
                @media screen and (max-width: 768px)
                    margin-top: 32px
                    width: 100%
                    margin-bottom: 24px
                p
                    color: #3d4040
                    line-height: 1.56em
                    @media screen and (min-width: 1280px)
                        font-size: calc(17px + 14 * ((100vw - 1280px) / 1280))
                    @media screen and (min-width: 1280px)
                        font-size: 17px
                    @media screen and (min-width: 1280px) and (min-width: 2560px)
                        font-size: 31px
    .bottom
        background: #F0F0F0
        .panel
            display: grid
            grid-template-columns: 1fr
            padding: 10vw 10vw 0 10vw
            position: relative
            z-index: 4
            @media screen and (min-width: 960px)
                grid-template-columns: 1fr 1fr
            @media screen and (min-width: 1280px)
                padding: 10vw 15vw 10vw
            .img-holder
                margin-bottom: 10vw
                position: relative
                margin-left: -5vw
                height: 60vw
                width: 90vw
                perspective: 600px
                @media screen and (min-width: 960px)
                    margin-left: 0
                    width: 35vw
                    height: 40vw
                    margin-top: -14vw
                    margin-left: -5vw
                &.rotate
                    .img-border
                        animation: rotate 1.2s cubic-bezier(.49,-0.4,.19,1.42) forwards
                .img-border
                    border-radius: 2px
                    position: relative
                    height: 100%
                    width: 100%
                    z-index: 1
                    animation: rotate-reverse 1.2s cubic-bezier(.49,-0.4,.19,1.42) forwards
                    transform-style: preserve-3d
                    cursor: pointer
                    .cover
                        display: block
                        position: absolute
                        top: 0
                        left: 0
                        bottom:0
                        right: 0
                        margin: 0 auto
                        backface-visibility: hidden
                        max-width: 100%
                        max-height: 100%
                        object-fit: cover
                        object-position: center
                        box-shadow: 30px 30px 10px 0px rgba(25,26,26,0.18)
                        &.back
                            transform: rotateY(180deg)
            .content
                margin-bottom: 96px
                padding-right: 5vw
                width: 100%
                @media screen and (min-width: 960px)
                    margin-bottom: 8vw
                h4
                    color: #1d1f1f
                    letter-spacing: .15em
                    margin: 0 0 2.5em
                    position: relative
                    width: 100%
                    line-height: 1.48em
                    @media screen and (min-width: 1280px)
                        font-size: calc(16px + 5 * ((100vw - 1280px) / 1280))
                    @media screen and (min-width: 2560px)
                        font-size: 21px
                p
                    color: #626666
                    letter-spacing: 0
                    line-height: 1.56em
                    padding-right: 2vw
                    transition-delay: .15s
                    font-size: 18px
                    @media screen and (min-width: 1280px)
                        font-size: min(calc(18px + 8 * (100vw - 1280px) / 640), 18px)
    .love
        margin-top: 100px
        text-align: right
        font-size: 12px
        .heart
            color: red

@keyframes typedBlink
    0%
        opacity: 1
    50%
        opacity: 0
    100%
        opacity: 1

@keyframes rotate
    0%
        transform: rotateY(0deg)

    100%
        transform: rotateY(180deg)

@keyframes rotate-reverse
    0%
        transform: rotateY(180deg)

    100%
        transform: rotateY(0deg)
</style>
