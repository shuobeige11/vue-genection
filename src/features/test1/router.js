const testRoute = resolve => {
  require.ensure(['./home'], () => {
    resolve(require('./home'))
  })
}
const route2 = resolve => {
  require.ensure(['./container/test'], () => {
    resolve(require('./container/test'))
  })
}
const routes = [
  {
    path: '/test1',
    component: testRoute,
    children: [{
      path: 'test1',
      component: route2
    }]
  }
]

export default () => routes
