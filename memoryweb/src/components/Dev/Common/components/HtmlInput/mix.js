import { MessageBox, Message } from 'element-ui';

import { REPLACE_KEY } from '@/utils/const';
import { insertText } from '@/components/Dev/Common/utils';

import Snippets from './Snippets';
import Input from './Input';

export default {
    props: {
        msg: Object,
        show: Boolean,
        text: {
            require: true,
            type: String,
        },
        canDel: {
            require: true,
            type: Boolean,
        },
    },
    data: () => ({
        replaceKey: REPLACE_KEY,
    }),
    computed: {
        textDefault() {
            return '';
        },
        textInner: {
            get() {
                return this.text;
            },
            set(v) {
                this.$emit('update:text', v);
            },
        },
        inputElm() {
            return this.$refs.input.getInput();
        },
    },
    watch: {
        show: {
            immediate: true,
            handler(v) {
                if (!v) return;
                this.focus();
            },
        },
    },
    methods: {
        async msgBoxPrompt(config = {}) {
            const { message = '', title = '' } = config;
            const customClass = `msg-box-prompt-${Date.now()}`;
            const instance = MessageBox.prompt(message, title, {
                inputValue: '',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                customClass,
                ...config,
            })
                .then(({ action, value }) => {
                    return [null, value.trim()];
                })
                .catch(err => {
                    Message({ type: 'info', message: '取消输入' + err.message });
                    return [err];
                });

            // 阻止冒泡 防止关闭下层的 el-Popover
            await this.$nextTick();
            const elm = document.querySelector('.' + customClass);
            elm.onclick = function (event) {
                event.stopPropagation();
            };

            return instance;
        },
        insertSnippet(str, position) {
            // 这里 forces 以后会触发光标选中规则
            //  position 的默认值就变成 inputElm.selectionStart 了
            this.focus();
            this.textInner = insertText(this.inputElm, str, this.textInner, position);
        },
        focus() {
            this.$nextTick(() => {
                const hasFocus = this.inputElm === document.activeElement;
                if (hasFocus) {
                    this.moveCursor();
                } else {
                    this.$refs.input.focus();
                }
            });
        },
        /**
         * @name: 输入框内按 Tab || 点击输入框后 的快捷执行
         * @description: 按顺序执行
         * @param {*}
         * @return {*}
         */
        moveCursor() {
            const elm = this.inputElm;
            // 如果输入框为空 赋予默认值
            if (!this.textInner.trim()) this.textInner = this.textDefault;

            this.$nextTick(() => {
                const currCursor = elm.selectionStart;
                const textInner = this.textInner;

                // <div>test<span>xxx|</span></div> 如果光标在Elm结束标签边缘（|）按 Tab 则跳过结束标签 --> <div>test<span>xxx</span>|</div>
                const nextText = textInner.substr(currCursor);
                const matchElmEnd = nextText.match(/^<\/[a-zA-Z]{1,7}>/); // </picture> 应该是最长的 Elm 了吧
                if (matchElmEnd) {
                    const s = currCursor + matchElmEnd[0].length;
                    const e = s;
                    elm.setSelectionRange(s, e);
                    return;
                }

                // 看看下半句是否有 模板替换词(replaceKey)
                const nextTextReplaceKeyPosition = nextText.indexOf(this.replaceKey);
                if (nextTextReplaceKeyPosition !== -1) {
                    const s = textInner.length - nextText.length + nextTextReplaceKeyPosition;
                    const e = s + this.replaceKey.length;
                    elm.setSelectionRange(s, e);
                    return;
                }

                // 查看整句是否有 模板替换词(replaceKey)
                const allTextReplaceKeyPosition = textInner.indexOf(this.replaceKey);
                if (allTextReplaceKeyPosition !== -1) {
                    const e = allTextReplaceKeyPosition + this.replaceKey.length;
                    elm.setSelectionRange(allTextReplaceKeyPosition, e);
                    return;
                }
            });
        },

        simpleElm(n) {
            return `<${n}>${this.replaceKey}</${n}>`;
        },
    },
    components: {
        Snippets,
        Input,
    },
};
