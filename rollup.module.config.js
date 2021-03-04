import babel from 'rollup-plugin-babel'
import { eslint } from 'rollup-plugin-eslint'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import postcss from 'rollup-plugin-postcss'
import es3 from 'rollup-plugin-es3';
import { uglify } from 'rollup-plugin-uglify'
import { terser } from 'rollup-plugin-terser'
export default [
  {
    input: './src/configure/customized/encrypt/lib/encrypt.js',
    output: [{
      file: './demo/sdk/AnalysysAgent_Encrypt.min.js',
      format: 'iife',
      name: 'Encrypt',
      freeze: false, // 禁止使用Object.freeze方式加载模块
      plugins: [
        uglify({
          mangle: {
            toplevel: true
          },
          ie8: true
        })
      ]
    }, {
      file: './demo/sdk/AnalysysAgent_Encrypt.amd.min.js',
      format: 'amd',
      name: 'Encrypt',
      freeze: false, // 禁止使用Object.freeze方式加载模块
      plugins: [
        uglify({
          mangle: {
            toplevel: true
          },
          ie8: true
        })
      ]
    }, {
      file: './SDK/AnalysysAgent_Encrypt.min.js',
      format: 'iife',
      name: 'Encrypt',
      freeze: false, // 禁止使用Object.freeze方式加载模块
      plugins: [
        uglify({
          mangle: {
            toplevel: true
          },
          ie8: true
        })
      ]
    }, {
      file: './SDK/AnalysysAgent_Encrypt.amd.min.js',
      format: 'amd',
      name: 'Encrypt',
      freeze: false, // 禁止使用Object.freeze方式加载模块
      plugins: [
        uglify({
          mangle: {
            toplevel: true
          },
          ie8: true
        })
      ]
    }, {
      file: './vue-demo/src/sdk/AnalysysAgent_Encrypt.es6.min.js',
      format: 'esm',
      name: 'Encrypt',
      plugins: [
        terser({
          mangle: {
            toplevel: true
          }
        })
      ]
    }, {
      file: './SDK/AnalysysAgent_Encrypt.es6.min.js',
      format: 'esm',
      name: 'Encrypt',
      plugins: [
        terser({
          mangle: {
            toplevel: true
          }
        })
      ]
    }],
    plugins: [
      resolve({
        jsnext: true,
        main: true,
        browser: true,
        preferredBuiltins: false,
        preferBuiltins: false
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

        babelrc: false,

        presets: [['@babel/preset-env', {
          "modules": false,
          "targets": {
            "browsers": [
              "defaults"
            ]
          },

        }

        ]],

        // include: ['src/**'],
        exclude: 'node_modules/**', // 排除引入的库

        plugins: [
          "@babel/plugin-transform-runtime",
          "transform-member-expression-literals",
          "transform-property-literals",
          "@babel/plugin-transform-reserved-words",
          [
            "@babel/plugin-proposal-decorators",
            {
              "legacy": true
            }
          ],
          "@babel/plugin-proposal-function-sent",
          "@babel/plugin-proposal-export-namespace-from",
          "@babel/plugin-proposal-numeric-separator",
          "@babel/plugin-proposal-throw-expressions",
          // Stage 3
          "@babel/plugin-syntax-dynamic-import",
          "@babel/plugin-syntax-import-meta",
          [
            "@babel/plugin-proposal-class-properties",
            {
              "loose": true
            }
          ],
          "@babel/plugin-proposal-json-strings",
          "@babel/plugin-external-helpers"

        ],
        runtimeHelpers: true

      }),

      es3({

        remove: ['defineProperty', 'freeze']

      })
    ]
  },
  {
    input: './src/configure/customized/decodeGBK/lib/decodeGBK.js',
    output: [{
      file: './demo/sdk/AnalysysAgent_GBK.min.js',
      format: 'iife',
      name: 'DecodeGBK',
      freeze: false, // 禁止使用Object.freeze方式加载模块
      plugins: [
        uglify({
          mangle: {
            toplevel: true
          },
          ie8: true
        })
      ]
    }, {
      file: './demo/sdk/AnalysysAgent_GBK.amd.min.js',
      format: 'amd',
      name: 'DecodeGBK',
      freeze: false, // 禁止使用Object.freeze方式加载模块
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
      file: './vue-demo/src/sdk/AnalysysAgent_GBK.es6.min.js',
      format: 'esm',
      name: 'DecodeGBK',
      plugins: [
        terser({
          mangle: {
            toplevel: true
          }
        })
      ]
    }, {
      file: './SDK/AnalysysAgent_GBK.min.js',
      format: 'iife',
      name: 'DecodeGBK',
      freeze: false, // 禁止使用Object.freeze方式加载模块
      plugins: [
        uglify({
          mangle: {
            toplevel: true
          },
          ie8: true
        })
      ]
    }, {
      file: './SDK/AnalysysAgent_GBK.amd.min.js',
      format: 'amd',
      name: 'DecodeGBK',
      freeze: false, // 禁止使用Object.freeze方式加载模块
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
      file: './SDK/AnalysysAgent_GBK.es6.min.js',
      format: 'esm',
      name: 'DecodeGBK',
      plugins: [
        terser({
          mangle: {
            toplevel: true
          }
        })
      ]
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
  },
  {
    input: './src/configure/customized/pageClose/index.js',
    output: [{
      file: './demo/sdk/AnalysysAgent_PageViewStayTime.min.js',
      format: 'iife',
      name: 'PageViewStayTime',
      freeze: false, // 禁止使用Object.freeze方式加载模块
      plugins: [
        uglify({
          mangle: {
            toplevel: true
          },
          ie8: true
        })
      ]
    }, {
      file: './demo/sdk/AnalysysAgent_PageViewStayTime.amd.min.js',
      format: 'amd',
      name: 'PageViewStayTime',
      freeze: false, // 禁止使用Object.freeze方式加载模块
      plugins: [
        uglify({
          mangle: {
            toplevel: true
          },
          ie8: true
        })
      ]
    }, {
      file: './vue-demo/src/sdk/AnalysysAgent_PageViewStayTime.es6.min.js',
      format: 'esm',
      name: 'Encrypt',
      plugins: [
        terser({
          mangle: {
            toplevel: true
          }
        })
      ]
    }, {
      file: './SDK/AnalysysAgent_PageViewStayTime.min.js',
      format: 'iife',
      name: 'PageViewStayTime',
      freeze: false, // 禁止使用Object.freeze方式加载模块
      plugins: [
        uglify({
          mangle: {
            toplevel: true
          },
          ie8: true
        })
      ]
    }, {
      file: './SDK/AnalysysAgent_PageViewStayTime.amd.min.js',
      format: 'amd',
      name: 'PageViewStayTime',
      freeze: false, // 禁止使用Object.freeze方式加载模块
      plugins: [
        uglify({
          mangle: {
            toplevel: true
          },
          ie8: true
        })
      ]
    }, {
      file: './SDK/AnalysysAgent_PageViewStayTime.es6.min.js',
      format: 'esm',
      name: 'Encrypt',
      plugins: [
        terser({
          mangle: {
            toplevel: true
          }
        })
      ]
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
  },
  {
    input: './src/configure/customized/heatmap/heatmapSDK/index.js',
    output: [
      {
        file: './demo/sdk/AnalysysAgent_JS_SDK_HEATMAP.min.js',
        format: 'iife',
        name: 'Ans',
        freeze: false
      },
      {
        file: './vue-demo/public/AnalysysAgent_JS_SDK_HEATMAP.min.js',
        format: 'iife',
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
