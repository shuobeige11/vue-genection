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

const route1 = resolve => {
  require.ensure(['./container/test1'], () => {
    resolve(require('./container/test1'))
  })
}

const routes = [
  {
    path: '/test',
    component: testRoute,
    children: [{
      path: 'test1',
      component: route1
    }, {
      path: 'test2',
      component: route2
    }]
  }
]

export default () => routes
