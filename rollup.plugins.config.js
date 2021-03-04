import babel from 'rollup-plugin-babel'
import { eslint } from 'rollup-plugin-eslint'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import postcss from 'rollup-plugin-postcss'
import es3 from 'rollup-plugin-es3';
import { uglify } from 'rollup-plugin-uglify'
import { terser } from 'rollup-plugin-terser'
var plugin = [
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
export default [
  {
    input: './src/configure/customized/mpaas/index.js',
    output: [{
      file: './demo/sdk/AnalysysAgent_MPAAS.min.js',
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
    },
    {
      file: './sdk/AnalysysAgent_MPAAS.min.js',
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
      file: './vue-dome/src/sdk/AnalysysAgent_MPAAS.es6.min.js',
      format: 'esm',
      name: 'Encrypt',
      plugins: [
        terser({
          mangle: {
            toplevel: true
          }
        })
      ]
    },
    {
      file: './sdk/AnalysysAgent_MPAAS.es6.min.js',
      format: 'esm',
      name: 'Encrypt',
      plugins: [
        terser({
          mangle: {
            toplevel: true
          }
        })
      ]
    },
    {
      file: './demo/sdk/AnalysysAgent_MPAAS.amd.min.js',
      format: 'amd',
      name: 'Encrypt',
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
      file: './sdk/AnalysysAgent_MPAAS.amd.min.js',
      format: 'amd',
      name: 'Encrypt',
      plugins: [
        uglify({
          mangle: {
            toplevel: true
          },
          ie8: true
        })
      ]
    }],
    plugins: plugin
  }
]
