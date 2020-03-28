import babel from 'rollup-plugin-babel'
import eslint from 'rollup-plugin-eslint'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import postcss from 'rollup-plugin-postcss'
import { uglify } from 'rollup-plugin-uglify'
import { terser } from 'rollup-plugin-terser'
export default [
  {
    input: './src/main.js',
    output: [
      {
        file: './demo/sdk/AnalysysAgent_JS_SDK.min.js',
        format: 'umd',
        name: 'Ans',
        freeze: false,
        plugins: [
          uglify({
            mangle: {
              toplevel: true
            },
            ie8: true
          })
        ]
      },
      {
        file: './SDK/AnalysysAgent_JS_SDK.min.js',
        format: 'umd',
        name: 'Ans',
        freeze: false,
        plugins: [
          uglify({
            mangle: {
              toplevel: true
            },
            ie8: true
          })
        ]
      },
      {
        file: './vue-demo/src/sdk/AnalysysAgent_JS_SDK.es6.min.js',
        format: 'esm',
        name: 'Ans',
        plugins: [
          terser({
            mangle: {
              toplevel: true
            }
          })
        ]
      },
      {
        file: './SDK/AnalysysAgent_JS_SDK.es6.min.js',
        format: 'esm',
        name: 'Ans',
        plugins: [
          terser({
            mangle: {
              toplevel: true
            }
          })
        ]
      }
    ],
    plugins: [
      resolve({
        jsnext: true,
        main: true,
        browser: true
      }),
      postcss({
        extensions: ['.css']
      }),
      commonjs(),
      eslint({
        exclude: [
          'src/**'
        ]
      }),
      babel({
        exclude: 'node_modules/**', // 排除引入的库
        runtimeHelpers: true // 配置runtime，不设置会报错
      })
    ]
  },
  {
    input: './src/configure/customized/visual/visualShow/index.js',
    output: [
      {
        file: './demo/sdk/AnalysysAgent_JS_SDK_VISUAL.min.js',
        format: 'umd',
        name: 'Ans',
        freeze: false
      }, {
        file: './vue-dome/public/js/sdk/AnalysysAgent_JS_SDK_VISUAL.min.js',
        format: 'umd',
        name: 'Ans',
        freeze: false
      },
      {
        file: './SDK/AnalysysAgent_JS_SDK_VISUAL.min.js',
        format: 'umd',
        name: 'Ans',
        freeze: false
      }],
    plugins: [
      resolve({
        jsnext: true,
        main: true,
        browser: true
      }),
      postcss({
        extensions: ['.css']
      }),
      commonjs(),
      eslint({
        exclude: [
          'src/**'
        ]
      }),
      babel({
        exclude: 'node_modules/**',
        runtimeHelpers: true // 配置runtime，不设置会报错
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
    input: './src/configure/customized/heatmap/heatmapSDK/index.js',
    output: [
      {
        file: './demo/sdk/AnalysysAgent_JS_SDK_HEATMAP.min.js',
        format: 'umd',
        name: 'Ans',
        freeze: false
      }, {
        file: './vue-dome/public/js/sdk/AnalysysAgent_JS_SDK_HEATMAP.min.js',
        format: 'umd',
        name: 'Ans',
        freeze: false
      },
      {
        file: './SDK/AnalysysAgent_JS_SDK_HEATMAP.min.js',
        format: 'umd',
        name: 'Ans',
        freeze: false
      }],
    plugins: [
      resolve({
        jsnext: true,
        main: true,
        browser: true
      }),
      postcss({
        extensions: ['.css']
      }),
      commonjs(),
      eslint({
        exclude: [
          'src/**'
        ]
      }),
      babel({
        exclude: 'node_modules/**',
        runtimeHelpers: true
      }),
      // replace({
      //   ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
      // }),
      uglify({
        mangle: {
          toplevel: true
        },
        ie8: true
      })
    ]
  }
]
