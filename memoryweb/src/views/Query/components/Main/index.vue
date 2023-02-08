<template>
    <section id="main" ref="main">
        <MsgModifySend v-if="isDev" />
        <VerticalDatePicker :day.sync="currDay" :range="VerticalDatePickerRange" class="VerticalDatePicker" />
        <el-scrollbar class="noX scrollbar" noresize ref="scroll">
            <section id="messages" ref="msgWrap" v-child-img-view>
                <div :key="v.id" class="item" v-for="(v, i) in msgPart">
                    <div class="leftContent">
                        <TimeLine :msg="v" :msgPart="msgPart" :msgPartIndex="i" />
                        <Msg
                            :beforeDestroyFn="msgBeforeDestroyFn"
                            :listIndex="listIndex(v)"
                            :mountedFN="msgMounted"
                            :msg="v"
                            :msgPart="msgPart"
                            :msgPartIndex="i"
                            class="msg"
                        />
                    </div>
                    <div class="rightContent" v-if="enableComment">
                        <Comment
                            :comment="commentAll[listIndex(v)]"
                            :listIndex="listIndex(v)"
                            :paddingYear="i === 0 || v.day !== msgPart[i - 1].day"
                            v-if="commentAll[listIndex(v)]"
                        />
                        <!-- Dev 模式 且当前位置没有评论则显示增加评论 -->
                        <template v-if="isDev">
                            <AddComment :msg="v" v-if="!commentAll[listIndex(v)]" />
                            <ModifyComment
                                :comment="commentAll[listIndex(v)]"
                                :msg="v"
                                v-if="
                                    commentAll[listIndex(v)] &&
                                    commentAll[listIndex(v)].type.includes(COMMENT_TYPE_HEADER)
                                "
                            />
                        </template>
                    </div>
                </div>
                <div class="underMax" v-if="msgIsMax">
                    <hr />
                    <div v-if="msgIsFilter">
                        <div>🎯 筛选出来的结果就这么多了哦</div>
                        <div>{{ `${msgShow.length} / ${$store.state.msgAll.length}` }}</div>
                    </div>
                    <div v-else>😥 到这里已经分手了呀</div>
                </div>
            </section>
        </el-scrollbar>
        <MainFooter />

        <!-- 手动增加
        <div class="dev" v-if="isDev">
            <button @click="scrollUp()">up</button>
            <button @click="scrollDown()">down</button>
            {{ msgPart.length }}
        </div> -->
    </section>
</template>
<script>
import dayjs from 'dayjs';
import _ from 'lodash';
import { easeInOutCubic } from '@/utils/animate.js';
import { STEP_LENGTH, STEP_MAX } from '@/config.js';
import { FORMAT_TIME_URL } from '@/utils/const.js';

import Msg from '@/components/Msg/';
import TimeLine from '@/components/TimeLine/';
import Comment from '@/components/Comment/';
import VerticalDatePicker from '@/components/VerticalDatePicker/';
import Footer from './components/Footer/';

import DateRange from '@/assets/data_pre/msg/dateRange.json';

const { COMMENT_TYPE_HEADER } = require('@/components/Comment/const.js');

// 上拉 下拉 刷新 距离边缘的触发距离
const EDGE_PADDING = 5;
// 最小不会触发的范围
const EDGE_PADDING_OFFSET = EDGE_PADDING + 2;

export default {
    name: 'Query-Main',
    mounted() {
        // 初始化子组件 这时候 for 的数组为 0  不渲染子组件
        this.initScrollEvent();
        this.initWheelEvent();
        this.initObserver();
    },
    data: () => ({
        COMMENT_TYPE_HEADER,
        observer: null, // 监控滚动子元素
        scrollEventLock: false, // 手动滚动时 Lock 不触发滚动事件
        eventFn: { initWheelEvent: null, initScrollEvent: null },
    }),
    computed: {
        enableComment() {
            return this.$store.getters['app/enableComment'];
        },
        isDev() {
            return this.$store.getters['app/isDev'];
        },
        commentAll() {
            return this.$store.state.commentAll;
        },
        VerticalDatePickerRange() {
            // const msgAll = this.$store.state.msgAll;
            // if (msgAll.length === 0) return `1991-2019`;
            // return `${dayjs(msgAll[0].ms).format('YYYY')}-${dayjs(msgAll.slice(-1)[0].ms).format('YYYY')}`;
            return DateRange;
        },
        scrollDom() {
            return this.$refs.scroll.wrap;
        },
        currDay: {
            get() {
                return this.$store.state.currDay;
            },
            async set(day) {
                await this.$store.dispatch('goToDay', { day });
            },
        },
        MSG_DEV_SLICE_S() {
            return this.$store.state.msgAll[0].index;
        },
        msgShow() {
            return this.$store.getters.msgShow;
        },
        msgPart() {
            return this.$store.getters.msgPart;
        },
        msgIsMax() {
            return this.$store.getters.msgIsMax;
        },
        msgIsFilter() {
            return this.$store.getters['query/search/msgIsFilter'];
        },
        sLength: {
            get() {
                return this.$store.state.sLength;
            },
            set(num) {
                this.$store.commit('setSLength', num);
            },
        },
        eLength: {
            get() {
                return this.$store.state.eLength;
            },
            set(num) {
                this.$store.commit('setELength', num);
            },
        },
        scrollToPosition() {
            return this.$store.state.query.scrollToPosition;
        },
    },
    watch: {
        scrollToPosition(v) {
            switch (v) {
                case 'top':
                    this.easeScroll(EDGE_PADDING_OFFSET);
                    break;
                case 'bottom':
                    this.easeScroll(-EDGE_PADDING_OFFSET);
                    break;
                default:
                    break;
            }
            this.$store.commit('query/setScrollToPosition', 'none');
            // this.immediatelyScroll(EDGE_PADDING_OFFSET);
        },
        currDay: _.debounce(function () {
            const { day } = this.$route.query;
            const currDay = dayjs(this.currDay).format(FORMAT_TIME_URL);
            if (day === currDay) return;

            localStorage.lastCurrDay = currDay;

            // 保留第一次进来的 search 这个进入 search 后会被删掉
            const query = _.pick({ ...this.$route.query, day: currDay }, ['day', 'searchKey', 'searchType']);

            this.$router.push({ query });
        }, 100),
    },
    methods: {
        listIndex(msg) {
            // 当前全部消息中的 index
            // ListIndex是裁剪后的消息（当前前台阅读的消息）,
            // msgAll 也可能被 common.js 中 MSG_SLICE 裁剪使用 那么 msg[0].index 就可能不是 0
            return msg.index - this.MSG_DEV_SLICE_S;
        },
        scrollUp() {
            // 如果是上移 那么新消息就会顶置，导致原消息不在当前视口位置。
            const lastScrollHeight = this.scrollDom.scrollHeight;
            const n = this.sLength - STEP_LENGTH;
            this.sLength = n < 0 ? 0 : n;
            this.$nextTick(() => {
                this.scrollDom.scrollTop += this.scrollDom.scrollHeight - lastScrollHeight;
                if (this.eLength - this.sLength > STEP_MAX) {
                    this.eLength = this.sLength + STEP_MAX;
                }
            });
        },
        scrollDown() {
            const n = this.eLength + STEP_LENGTH;
            this.eLength = n > this.msgShow.length ? this.msgShow.length : n;
            this.$nextTick(() => {
                if (this.eLength - this.sLength > STEP_MAX) {
                    this.sLength = this.eLength - STEP_MAX;
                }
            });
        },
        msgMounted(elm) {
            this.observer && this.observer.observe(elm);
        },
        msgBeforeDestroyFn(elm) {
            this.observer && this.observer.unobserve(elm);
        },
        initObserver() {
            const _this = this;
            // 子元素出现在 viewport 监控
            this.observer = new IntersectionObserver(
                changes => {
                    // console.group('x');
                    // changes.forEach(v => {
                    //     if (v.intersectionRect.top < 100) {
                    //         const elm = v.target;
                    //         const id = elm.dataset.id;
                    //         const currMsg = _this.msgShow.find(v => v.id === id);
                    //         console.group('i');
                    //         console.log(`${currMsg.day} ${currMsg.time} ${currMsg.content}`);
                    //         console.log(`${v.intersectionRatio} ${v.isIntersecting} ${v.isVisible}`, JSON.stringify(v.intersectionRect));
                    //         console.log('v', v);
                    //         console.groupEnd('i');
                    //     }
                    // });
                    // console.groupEnd('x');
                    // 这个是出现的, 那么往上滚动是最上面的 往下滚动会是最下面的.
                    // const obs = changes.filter(v => v.isIntersecting);

                    // 这是只算最上面的，  top===0 && bottom===0  这是 js 插入 root 中的，还没有 top bottom 这类的要过滤掉
                    // v.intersectionRect.top 是距离视窗上部的距离
                    const ELM_MAIN_TOP = this.$refs.main.getBoundingClientRect().top + 1;
                    const obs = changes.filter(
                        v =>
                            v.intersectionRect.top !== 0 &&
                            v.intersectionRect.bottom !== 0 &&
                            v.intersectionRect.top < ELM_MAIN_TOP,
                    );
                    if (obs[0]) {
                        const elm = obs[0].target;
                        const id = elm.dataset.id;
                        const currMsg = _this.msgShow.find(v => v.id === id);
                        this.$store.commit('setCurrDay', currMsg.ms);
                    }
                },
                {
                    threshold: [0.5],
                },
            );
        },
        initScrollEvent() {
            const _this = this;
            this.eventFn.initScrollEvent = _.debounce($e => {
                if (_this.scrollEventLock) return;
                const elm = $e.target;
                const { clientHeight, scrollHeight, scrollTop } = elm;
                const isTop = scrollTop <= EDGE_PADDING;
                const isBottom = clientHeight + scrollTop >= scrollHeight - EDGE_PADDING;
                if (isTop) this.scrollUp();
                if (isBottom) this.scrollDown();
                _this.$nextTick(() => {
                    _this.$refs.scroll.update();
                });
            }, 100);
            _this.scrollDom.addEventListener('scroll', this.eventFn.initScrollEvent, {
                capture: false,
                passive: true,
            });
        },
        initWheelEvent($event) {
            const _this = this;
            this.eventFn.initWheelEvent = _.debounce(() => {
                const elm_content = _this.$refs.msgWrap;
                const elm_scroll = _this.$refs.scroll.wrap;
                const innerHeight = elm_content.getBoundingClientRect().height;
                const wrapHeight = elm_scroll.getBoundingClientRect().height;
                /**
                 * @name:
                 * @description: 如果 goToMsg 到最后一条数据 由于视窗内只有一条
                 *               内容高度不会超过视口  那么就无法触发 scroll 事件
                 *               这里用鼠标滚动事件 + 判断 手动触发 scroll 的逻辑 （视为向上滚动加载更多）
                 *
                 *              截至 2020年12月11日
                 *               根据 MDN 文档， https://developer.mozilla.org/zh-CN/docs/Web/API/Element/wheel_event
                 *              注意事项： 请勿想当然依据滚轮方向（即该事件的各delta属性值）来推断文档内容的滚动方向，因标准未定义滚轮事件具体会引发什么样的行为，引发的行为实际上是各浏览器自行定义的。即便滚轮事件引发了文档内容的滚动行为，也不表示滚轮方向和文档内容的滚动方向一定相同。因而通过该滚轮事件获知文档内容滚动方向的方法并不可靠。要获取文档内容的滚动方向，可在文档内容滚动事件（scroll）中监视scrollLeft和scrollTop二值变化情况，即可推断出滚动方向了。
                 *
                 *             未保证可用性, 所以此处不对滚动的方向做处理 因此会产生 往下滚动加载上面 的异常现象
                 *
                 * @param {*} innerHeight
                 * @return {*}
                 */
                if (innerHeight < wrapHeight && _this.sLength + STEP_LENGTH > _this.msgShow.length) {
                    console.log('底部上滑强制新增');
                    _this.scrollUp();
                }
            });
            _this.scrollDom.addEventListener('wheel', this.eventFn.initWheelEvent, {
                capture: false,
                passive: true,
            });
        },
        immediatelyScroll(overValue = EDGE_PADDING_OFFSET) {
            const elm = this.$refs.scroll.wrap;
            elm.scrollTop = overValue > 0 ? overValue : elm.scrollHeight + overValue;
        },
        easeScroll(_overValue = EDGE_PADDING_OFFSET) {
            const _this = this;
            _this.scrollEventLock = true;
            // el-scrollbar 容器
            const elm = _this.$refs.scroll.wrap;
            const beginTime = Date.now();
            const beginValue = elm.scrollTop;
            const overValue = _overValue > 0 ? _overValue : elm.scrollHeight + _overValue;
            const rAF = window.requestAnimationFrame || (func => setTimeout(func, 16));
            const frameFunc = () => {
                const progress = (Date.now() - beginTime) / 500;
                if (progress < 1) {
                    if (overValue < beginTime) {
                        elm.scrollTop = beginValue * (1 - easeInOutCubic(progress));
                    } else {
                        elm.scrollTop = beginValue + (overValue - beginValue) * easeInOutCubic(progress);
                    }
                    rAF(frameFunc);
                } else {
                    elm.scrollTop = overValue;
                    _this.scrollEventLock = false;
                }
            };
            rAF(frameFunc);
        },
    },
    beforeDestroy() {
        this.observer.disconnect();
        this.scrollDom.removeEventListener('wheel', this.eventFn.initWheelEvent);
        this.scrollDom.removeEventListener('scroll', this.eventFn.initScrollEvent);
    },
    components: {
        MainFooter: Footer,
        TimeLine,
        Msg,
        Comment,
        VerticalDatePicker,
        AddComment: () => import('@/components/Dev/Comment/AddComment'),
        ModifyComment: () => import('@/components/Dev/Comment/ModifyComment'),
        MsgModifySend: () => import('@/components/Dev/Msg/MsgModifySend'),
    },
};
</script>
<style lang="sass" scoped>
@import '~@/styles/vars.module.sass'

#main
    flex-grow: 1
    height: 100%
    min-width: 300px
    background-color: #E7EDED
    display: flex
    flex-direction: column
    justify-content: space-between
    position: relative
    .currDay
        position: absolute
        top: 0
        left: 0
        width: 100%
        text-align: center
        background-image: linear-gradient(-180deg,rgba(0,0,0,.4),transparent)
        font-size: 12px
        color: #fff
        height: 20px
        z-index: 10
        cursor: pointer
    .VerticalDatePicker
        position: absolute
        top: 0
        right: -55px
        max-height: 100%
        overflow: auto
        scrollbar-width: none
        -ms-overflow-style: none
        backdrop-filter: saturate(150%) contrast(50%) blur(8px)
        // background: rgba(255,255,255,0)
        padding: 2px 4px 2px 1px
        border-top-right-radius: 5px
        border-bottom-right-radius: 5px
        &::-webkit-scrollbar
            display: none
    #messages
        // overflow: auto
        flex-grow: 2
        padding: 10px 0
        padding-top: 20px
        width: 100%
        .item
            display: flex
            .leftContent
                flex: 1 1 auto
                border-right: 1px solid #DCDFE6
                padding: 0 10px
            .rightContent
                flex: 0 0 $commentWidth
                padding-right: 10px
                position: relative
        .underMax
            text-align: center
.scrollbar
    height: 100%

.dev
    position: fixed
    bottom: 0
</style>
