import Vue from 'vue';

Vue.directive('outerHTML', {
    inserted(el, binding) {
        el.outerHTML = binding.value;
    },
});

Vue.directive('img-error', {
    bind(el, binding, vnode) {
        el.onerror = function () {
            el.onerror = null;
            el.src = binding.value;
        };

        const src = el.dataset.src || el.src || 'srcIsNull';
        if (el.src != src) el.src = src;
    },
    unbind(el) {
        el.onerror = null;
    },
});

/**
 * @name: 点击图片可以预览  含 msg 和 comment
 * @description: 采用事件委托的方式直接绑定到 msgWrap 最顶层目录
 *               img 可以用 no-img-view 属性禁止
 * @param {*}
 * @return {*}
 */
Vue.directive('child-img-view', {
    bind(el, binding, vnode) {
        el.onclick = function ($event) {
            const elm = $event.target;
            // 必须是 Img 元素
            if (elm.nodeName.toUpperCase() !== 'IMG') return;
            // 有 no-img-view 的 IMG 不处理
            if (elm.hasAttribute('no-img-view')) return;
            // msg_inner 这个是 Msg 组件下  content 的 class [msg_inner]
            // 保证仅对 msg 内容的图片进行处理

            // msg 路径上的 node class 白名单
            if (
                !$event.path.some(
                    n => n.classList && Array.from(n.classList).some(v => ['msg_inner', 'commentWrap'].includes(v)),
                )
            ) {
                return;
            }

            // 对于剩下的 img 执行预览
            vnode.context.$hevueImgPreview({ url: elm.src });
        };
    },
    unbind(el) {
        el.onclick = null;
    },
});

/**
 * @name: img 属性增强
 * @description: - 补全 alt <- -> title 主要是为了 Emoji 表情
 *               - loading = 'lazy'
 * @return {*}
 */
Vue.directive('img-attr-extra', {
    bind(el, binding, vnode, oldVnode) {
        const imgs = el.querySelectorAll('img');
        for (let i = 0; i < imgs.length; i++) {
            const img = imgs[i];
            // lazy-loading
            img.setAttribute('loading', 'lazy');
            // alt -> title
            const title = img.getAttribute('title');
            const alt = img.getAttribute('alt');
            if (title || !alt) continue;
            // 如果有预设的 title 或者没有 alt 就跳过
            img.setAttribute('title', alt);
            console.log('！！！有Alt 没 Title！！！', img);
        }
    },
});

Vue.directive('img-is-face', {
    bind(el, binding, vnode, oldVnode) {
        const { value: facePath } = binding;
        const imgs = el.querySelectorAll('img');

        for (let i = 0; i < imgs.length; i++) {
            const img = imgs[i];
            const src = img.getAttribute('src');
            if (!src || !src.includes(facePath)) continue;
            img.setAttribute('data-is-face', '');
        }
    },
});
