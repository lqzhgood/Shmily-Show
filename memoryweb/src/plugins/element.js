import Vue from 'vue';
import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';
import '@/styles/element-ui.sass';

// fix 2.15.9 https://github.com/ElemeFE/element/issues/21905
// function RepairProps(cmp) {
//     (cmp.mixins || []).forEach(mixin => {
//         if (mixin.props && mixin.props.placement) {
//             const defaultValue = mixin.props.placement.default;
//             mixin.data = new Proxy(mixin.data, {
//                 apply(target, thisArg, argArray) {
//                     const res = Reflect.apply(target, thisArg, argArray);
//                     return {
//                         ...(res || {}),
//                         placement: defaultValue,
//                     };
//                 },
//             });
//             delete mixin.props.placement;
//         }
//         if (mixin.mixins && mixin.mixins.length > 0) {
//             RepairProps(mixin);
//         }
//     });
// }

// RepairProps(Element.DatePicker);
// RepairProps(Element.TimePicker);
// RepairProps(Element.TimeSelect);

Vue.use(Element, { size: 'mini', zIndex: 3000 });

Vue.component(CollapseTransition.name, CollapseTransition);
