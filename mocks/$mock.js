/* eslint-disable */
import mockServer from 'axios-mock-server'
import mock0 from './movies/index'
import mock1 from './comments/index'
import mock2 from './comments/_id'

export default (client) => mockServer([
  {
    path: '/movies',
    methods: mock0
  },
  {
    path: '/comments',
    methods: mock1
  },
  {
    path: '/comments/_id',
    methods: mock2
  }
], client, '')
