// 一些浏览器废弃 Api 的 polyfill

// directive -> child-img-view -> $event.path
// docs: https://chromestatus.com/feature/5726124632965120

// if (!Event.prototype.hasOwnProperty('path')) {
//     Object.defineProperty(Event.prototype, 'path', {
//         get() {
//             return this.composedPath();
//         },
//     });
// }
