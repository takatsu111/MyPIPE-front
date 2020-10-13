const datas = {
  play_list: {
    play_list_name: 'playlistname',
    play_list_description: 'description',
  },
  play_list_movies: [
    {
      movie_id: 5,
      movie_title: 'title5555555',
      movie_description: '5555555',
      movie_thumbnail_name: '_393740.jpg',
      order: 1,
    },
    {
      movie_id: 6,
      movie_title: 'title666666',
      movie_description: '666666',
      movie_thumbnail_name: '_392740.jpg',
      order: 2,
    },
    {
      movie_id: 7,
      movie_title: 'title777777',
      movie_description: '777777',
      movie_thumbnail_name: '_391140.jpg',
      order: 3,
    },
    {
      movie_id: 8,
      movie_title: 'title888888',
      movie_description: '888888',
      movie_thumbnail_name: '_398740.jpg',
      order: 4,
    },
  ],
}

export default {
  get({ values }) {
    return [200, datas]
  },
}
