const myMovies = [
  {
    id: 1,
    title: 'Frozen Yogurt',
    description: 'first',
    thumbnail: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
    progress: 0,
    postedDay: '2000/01/01',
  },
  {
    id: 2,
    title: 'Ice cream sandwich',
    description: 'second',
    thumbnail: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
    progress: 0,
    postedDay: '2000/01/01',
  },
  {
    id: 3,
    title: 'Eclair',
    description: 'third',
    thumbnail: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
    progress: 0,
    postedDay: '2000/01/01',
  },
  {
    id: 4,
    title: 'Cupcake',
    description: 'forth',
    thumbnail: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
    progress: 1,
    postedDay: '2000/01/01',
  },
  {
    id: 5,
    title: 'Gingerbread',
    description: 'fifth',
    thumbnail: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
    progress: 2,
    postedDay: '2000/01/01',
  },
]

export default {
  get({ values }) {
    return [200, myMovies]
  },

  post({ values }) {
    return [
      200,
      {
        id: 5,
        title: 'Gingerbread',
        description: 'fifth',
        thumbnail: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
        progress: 1,
        postedDay: '2000/01/01',
      },
    ]
  },

  put({ values }) {
    return [200, myMovies]
  },
}
