import axios from 'axios'
export default (option, fn, error) => {
	let opt = Object.assign({
		method: 'get'
	}, option)
	return new Promise((resolve, reject) => {
		axios(opt).then(response => {
			let data = response.data
			if (data.code === 0) {
				fn && fn(data)
				return resolve(data)
			} else {

				// 为登录跳转登录
				if(data.code === -100) {
					window.location.href = '/login.html'
					return
				}
				
				error && error(data)
				return reject(data)
			}
		}).catch(e => {
			let obj = {
				code: -50,
				msg: e.toString()
			}
			error && error(obj)
			reject(obj)
		})
	})

}