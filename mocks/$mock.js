/* eslint-disable */
import mockServer from 'axios-mock-server'
import mock0 from './mymovies/index'
import mock1 from './movies/index'
import mock2 from './comments/index'
import mock3 from './comments/_id'
import mock4 from './auth/api/v1/play-list-items/index'

export default (client) => mockServer([
  {
    path: '/mymovies',
    methods: mock0
  },
  {
    path: '/movies',
    methods: mock1
  },
  {
    path: '/comments',
    methods: mock2
  },
  {
    path: '/comments/_id',
    methods: mock3
  },
  {
    path: '/auth/api/v1/play-list-items',
    methods: mock4
  }
], client, '')
