export default defineEventHandler(event => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        hello: 'world'
      })
    }, 2000)
  })
})