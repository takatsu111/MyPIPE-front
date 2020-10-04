/* eslint-disable */
import mockServer from 'axios-mock-server'
import mock0 from './movies/index'

export default (client) => mockServer([
  {
    path: '/movies',
    methods: mock0
  }
], client, '')
