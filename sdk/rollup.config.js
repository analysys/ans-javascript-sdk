import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import {
    uglify
} from 'rollup-plugin-uglify';
import {
    terser
} from "rollup-plugin-terser";
export default [{
    input: './src/main.js',
    output: [{
        file: '../demo/sdk/AnalysysAgent_JS_SDK.min.js',
        format: 'umd',
        name: 'Ans',
        freeze: false //禁止使用Object.freeze方式加载模块
    }],
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
        uglify({
            mangle: {
                toplevel: true
            },
            ie8: true
        })

    ]
},
{
    input: './src/main_es6.js',
    output: [{
        file: '../vue-demo/src/sdk/AnalysysAgent_JS_SDK.es6.min.js',
        format: 'esm',
        name: 'Ans',
    }],
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
        }),
        // replace({
        //     ENV: JSON.stringify(process.env.NODE_ENV || 'Development'),
        // }),
        terser({
            'mangle': {
                toplevel: true
            }
        })
    ]
},
{
    input: './src/configure/customized/visual/visualShow/index.js',
    output: [{
        file: '../demo/sdk/AnalysysAgent_JS_SDK_VISUAL.min.js',
        format: 'umd',
        name: 'Ans',
        freeze: false, //禁止使用Object.freeze方式加载模块
    },
    {
        file: '../vue-demo/public/js/sdk/AnalysysAgent_JS_SDK_VISUAL.min.js',
        format: 'umd',
        name: 'Ans',
        freeze: false //禁止使用Object.freeze方式加载模块
    }],
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
    input: './src/configure/customized/heatmap/heatmapSDK/index.js', //'./src/configure/customized/heatmap/heatmapSDK/index.js',
    output: [{
        file: '../demo/sdk/AnalysysAgent_JS_SDK_HEATMAP.min.js',
        format: 'umd',
        name: 'Ans',
        freeze: false //禁止使用Object.freeze方式加载模块
    },
    {
        file: '../vue-demo/public/js/sdk/AnalysysAgent_JS_SDK_HEATMAP.min.js',
        format: 'umd',
        name: 'Ans',
        freeze: false //禁止使用Object.freeze方式加载模块
    }],
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
        // replace({
        //   ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
        // }),
        uglify({
            'mangle': {
                toplevel: true
            },
            'ie8': true
        })
    ]
}];