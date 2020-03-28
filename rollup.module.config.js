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
  input: './src/configure/customized/encrypt/lib/encrypt.js',
  output: [{
    file: './demo/sdk/AnalysysAgent_Encrypt.min.js',
    format: 'umd',
    name: 'Encrypt',
    freeze: false, //禁止使用Object.freeze方式加载模块
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
    format: 'umd',
    name: 'Encrypt',
    freeze: false, //禁止使用Object.freeze方式加载模块
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
        'mangle': {
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
        'mangle': {
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
    })
  ]
},
{
  input: './src/configure/customized/decodeGBK/lib/decodeGBK.js',
  output: [{
    file: './demo/sdk/AnalysysAgent_GBK.min.js',
    format: 'umd',
    name: 'DecodeGBK',
    freeze: false, //禁止使用Object.freeze方式加载模块
    plugins: [
      uglify({
        mangle: {
          toplevel: true
        },
        ie8: true
      })
    ]
  }, {
    file: './SDK/AnalysysAgent_GBK.min.js',
    format: 'umd',
    name: 'DecodeGBK',
    freeze: false, //禁止使用Object.freeze方式加载模块
    plugins: [
      uglify({
        mangle: {
          toplevel: true
        },
        ie8: true
      })
    ]
  }, {
    file: './vue-demo/src/sdk/AnalysysAgent_GBK.es6.min.js',
    format: 'esm',
    name: 'Encrypt',
    plugins: [
      terser({
        'mangle': {
          toplevel: true
        }
      })
    ]
  }, {
    file: './SDK/sdk/AnalysysAgent_GBK.es6.min.js',
    format: 'esm',
    name: 'Encrypt',
    plugins: [
      terser({
        'mangle': {
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
    })

  ]
},
{
  input: './src/configure/customized/pageClose/index.js',
  output: [{
    file: './demo/sdk/AnalysysAgent_PageViewStayTime.min.js',
    format: 'umd',
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
    file: './SDK/AnalysysAgent_PageViewStayTime.min.js',
    format: 'umd',
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
    file: './vue-demo/src/sdk/AnalysysAgent_PageViewStayTime.es6.min.js',
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
    file: './SDK/AnalysysAgent_PageViewStayTime.es6.min.js',
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
      exclude: 'node_modules/**', // 排除引入的库
      runtimeHelpers: true // 配置runtime，不设置会报错
    })

  ]
}
];