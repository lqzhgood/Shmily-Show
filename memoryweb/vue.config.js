const path = require('path');
function resolve(dir) {
    return path.join(__dirname, dir);
}

const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
    runtimeCompiler: true,
    transpileDependencies: true,
    publicPath: './',
    productionSourceMap: false,
    chainWebpack: config => {
        config.resolve.alias.set('@', resolve('src'));
        config.resolve.alias.set('@component', resolve('src/components'));
        config.resolve.alias.set('@msg', resolve('src/assets/data/msg'));
        config.resolve.alias.set('@statistic', resolve('src/assets/data/statistic/'));

        config.plugins.delete('prefetch');
    },

    devServer: {
        compress: false,
        proxy: {
            '/data': {
                target: 'http://127.0.0.1:55988',
                changeOrigin: true,
            },
        },
        watchFiles: {
            paths: ['src/**/*', 'public/**/*'],
            options: {
                awaitWriteFinish: { stabilityThreshold: 1 * 1000 },
                ignored: [
                    /node_modules/,
                    // only public/json/slice
                    // /public\/json\/slice/,
                    // /public\/json\/comment/,
                    // /public\/json\/msg/,
                    /public\/json\/statistic/,
                    'src/assets',
                ],
            },
        },
    },
});
