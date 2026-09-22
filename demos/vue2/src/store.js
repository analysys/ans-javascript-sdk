import Vue from 'vue'
import Vuex from 'vuex'
import io from '@/js/io.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
		userInfo: null,

  	goodType: {
  		list: [],
  		mapList: {}
		},

		brand: {
			list: [],
			mapList: {}
		}
  },
  mutations: {
		
  },
  actions: {
		
		// 获取商品分类id
  	get ({ commit, state }) {
	    return new Promise((resolve, reject) => {
	      io({url: '/stock/api/goodsType'}, o => {
	        let data = o.data
					if (data.length > 0) {
						state.goodType.list = data
						data.forEach(o => {state.goodType.mapList[o.id] = o})
					}
	        return resolve(data)
	      }, e => {
	        return reject(e)
	      })
	    })
		},

		// 获取品牌结果
		getBrand ({commit, state}) {
			return new Promise((resolve, reject) => {
	      io({url: '/stock/api/brand'}, o => {
	        let data = o.data
					if (data.length > 0) {
						state.brand.list = data
						data.forEach(o => {state.brand.mapList[o.id] = o})
					}
	        return resolve(data)
	      }, e => {
	        return reject(e)
	      })
	    })
		}
  }
})
