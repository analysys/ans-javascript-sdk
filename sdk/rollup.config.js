import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import replace from 'rollup-plugin-replace'
import uglify from 'rollup-plugin-uglify';
export default [
    {
        input: './src/main.js',
        output: {
            file: './demo/sdk/AnalysysAgent_JS_SDK.min.js',
            format: 'umd',
            name: 'Ans',
            freeze: false //禁止使用Object.freeze方式加载模块
        },
        plugins: [
            resolve({
                jsnext: true,
                main: true,
                browser: true,
            }),
            postcss({

                extensions: ['.css']
            }),
            commonjs(),
            eslint({
                exclude: [
                    'src/**',
                ]
            }),
            babel({
                exclude: 'node_modules/**', // 排除引入的库
                runtimeHelpers: true, // 配置runtime，不设置会报错
            }),
            replace({
              ENV: JSON.stringify(process.env.NODE_ENV || 'Development'),
            }),
            uglify({
                mangle: {
                    toplevel: true
                },
                ie8: true
            })
        ]
    },
    {
        input: './src/configure/customized/visual/visualShow/index.js',
        output: {
            file: './demo/sdk/AnalysysAgent_JS_SDK_VISUAL.min.js',
            format: 'umd',
            name: 'Ans',
            freeze: false //禁止使用Object.freeze方式加载模块
        },
        plugins: [
            resolve({
                jsnext: true,
                main: true,
                browser: true,
            }),
            postcss({

                extensions: ['.css']
            }),
            commonjs(),
            eslint({
                exclude: [
                    'src/**',
                ]
            }),
            babel({
                exclude: 'node_modules/**',
                runtimeHelpers: true // 配置runtime，不设置会报错
            }),
            uglify({
                'mangle': {
                    toplevel: true
                },
                'ie8': true
            })
        ]
    },
    {
        input: './src/configure/customized/heatmap/heatmapSDK/index.js',
        output: {
            file: './demo/sdk/AnalysysAgent_JS_SDK_HEATMAP.min.js',
            format: 'umd',
            name: 'Ans',
            freeze: false //禁止使用Object.freeze方式加载模块
        },
        plugins: [
            resolve({
                jsnext: true,
                main: true,
                browser: true,
            }),
            postcss({

                extensions: ['.css']
            }),
            commonjs(),
            eslint({
                exclude: [
                    'src/**',
                ]
            }),
            babel({
                exclude: 'node_modules/**',
                runtimeHelpers: true // 配置runtime，不设置会报错
            }),
            uglify({
                'mangle': {
                    toplevel: true
                },
                'ie8': true
            })
        ]
    }
];
