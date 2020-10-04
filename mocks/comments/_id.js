const items = [
  {
    id: 1,
    avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
    name: 'Brunch this dfdfefefefefefef?',
    body:
      "<span class='text--primary'>Ali Connors</span> &mdash; I'll be in your neighborhood\n doing errands this weekend. Do you want to hang out? Do you want to hang out? Do you want to hang out? Do you want to hang out? Do you want to hang out? Do you want to hang out? Do you want to hang out? Do you want to hang out? Do you want to hang out?",
    commentOpenFlag: false,
    movie_id: 35,
  },
  {
    id: 2,
    avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
    name: 'Summer BBQ',
    body:
      "<span class='text--primary'>to Alex, Scott, Jennifer</span> &mdash; Wish I could come, but I'm out of town this weekend.",
    commentOpenFlag: false,
    movie_id: 35,
  },
  {
    id: 3,
    avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg',
    name: 'Oui oui',
    body:
      "<span class='text--primary'>Sandra Adams</span> &mdash; Do you have Paris recommendations? Have you ever been?",
    commentOpenFlag: false,
    movie_id: 37,
  },
  {
    id: 4,
    avatar: 'https://cdn.vuetifyjs.com/images/lists/4.jpg',
    titnamele: 'Birthday gift',
    body:
      "<span class='text--primary'>Trevor Hansen</span> &mdash; Have any ideas about what we should get Heidi for her birthday?",
    commentOpenFlag: false,
    movie_id: 38,
  },
  {
    id: 5,
    avatar: 'https://cdn.vuetifyjs.com/images/lists/5.jpg',
    name: 'Recipe to try',
    body:
      "<span class='text--primary'>Britta Holt</span> &mdash; We should eat this: Grate, Squash, Corn, and tomatillo Tacos.",
    commentOpenFlag: false,
    movie_id: 39,
  },
]

export default {
  get({ values }) {
    return [200, items.filter((item) => item.movie_id === values.id)]
  },
}
