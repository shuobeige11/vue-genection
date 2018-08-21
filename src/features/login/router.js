const login = resolve => {
  require.ensure(['./home'], () => {
    resolve(require('./home'))
  })
}
const routes = [
  {
    path: '/login',
    component: login
  }
]

export default () => routes
