// vue.config.js
module.exports = {
	publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
	pages: {
		index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    }
	},
	devServer: {
		proxy: 'http://127.0.0.1:7001'
	},
	productionSourceMap: false,
	css: {
		extract: true
	},
	configureWebpack: {
		externals: {
			'dayjs':'dayjs'
		}
	}
}