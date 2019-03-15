import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import uglify from 'rollup-plugin-uglify';
export default [

    {
        input: './src/main.js',
        output: {
            file: './test/web/sdk/AnalysysAgent_JS_SDK.min.js',
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
            uglify({
                mangle: {
                    toplevel: true
                },
                ie8: true
            })
        ]
    }
];