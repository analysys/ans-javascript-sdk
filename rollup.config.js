import babel from 'rollup-plugin-babel'
import { eslint } from 'rollup-plugin-eslint'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import postcss from 'rollup-plugin-postcss'
import { uglify } from 'rollup-plugin-uglify'
import { terser } from 'rollup-plugin-terser'
import es3 from 'rollup-plugin-es3';
export default [
  {
    input: './src/main.js',
    output: [
      {
        file: './demo/sdk/AnalysysAgent_JS_SDK.min.js',
        format: 'umd',
        name: 'AnalysysAgent',
        freeze: false,
        plugins: [
          uglify({
            mangle: {
              toplevel: true
            },
            ie8: true
          })
        ],
        amd: {
          define: '{}'
        }
      },
      {
        file: './SDK/AnalysysAgent_JS_SDK.min.js',
        format: 'umd',
        name: 'AnalysysAgent',
        freeze: false,
        plugins: [
          uglify({
            mangle: {
              toplevel: true
            },
            ie8: true
          })
        ],
        amd: {
          define: '{}'
        }
      },
      {
        file: './demo/sdk/AnalysysAgent_JS_SDK.amd.min.js',
        format: 'amd',
        name: 'AnalysysAgent',
        freeze: false,
        plugins: [
          uglify({
            mangle: {
              toplevel: true
            },
            ie8: true
          })
        ]
      }, {
        file: './SDK/AnalysysAgent_JS_SDK.es6.min.js',
        format: 'esm',
        name: 'AnalysysAgent',
        plugins: [
          terser({
            mangle: {
              toplevel: true
            }
          })
        ]
      },
      {
        file: './vue-demo/src/sdk/AnalysysAgent_JS_SDK.es6.min.js',
        format: 'esm',
        name: 'AnalysysAgent',
        freeze: false,
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
        include: 'src/**',
        exclude: ['node_modules/**'],
      }),
      babel({

        babelrc: false,

        presets: [['@babel/preset-env', {
          modules: false, loose: true, "targets": {
            "ie": "6"
          }
        }]],

        include: ['src/**'],

        plugins: ['@babel/plugin-external-helpers'],

        runtimeHelpers: true

      }),

      es3({

        remove: ['defineProperty', 'freeze']

      })
    ]
  }
]
