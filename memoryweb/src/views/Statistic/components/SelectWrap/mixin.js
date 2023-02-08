export default {
    created() {
        // 默认值在 created 赋值
        if (this.defaultSelect) {
            this.select = this.defaultSelect;
        }
    },
    props: {
        defaultSelect: { type: String, default: '' },
        btnsStyle: { type: Object, default: () => ({}) },
        center: Boolean,
        inner: Boolean,
    },
    computed: {
        btnsStyleFinally() {
            const centerStyle = this.center ? { top: '7px', left: '50%', transform: 'translateX(-50%)' } : {};
            const innerStyle = this.inner ? { top: '5px', left: '7px' } : {};
            return Object.assign({}, centerStyle, innerStyle, this.btnsStyle);
        },
    },
};
