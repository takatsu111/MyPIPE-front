const movies = [
  {
    id: 35,
    name: '宮古・神の島のさざな',
    description: 'この動画は宮古島の神の島、大神島で撮影した波の音の映像です。',
    thumbNail: 'https://cdn.vuetifyjs.com/images/cards/sunshine.jpg',
    category: '旅行とイベント',
  },
  {
    id: 36,
    name: '山買いました…3年後どうなったのか…',
    description:
      '買った山(1,500坪)を開拓してます。造成してもらい、家を建てる土地と畑が出来ました。',
    thumbNail: 'https://cdn.vuetifyjs.com/images/cards/sunshine.jpg',
    category: '旅行とイベント',
  },
  {
    id: 37,
    name: '宮古・神の島のさざなみ',
    description: 'この動画は宮古島の神の島、大神島で撮影した波の音の映像です。',
    thumbNail: 'https://cdn.vuetifyjs.com/images/cards/sunshine.jpg',
    category: '旅行とイベント',
  },
  {
    id: 38,
    name: '山買いました…3年後どうなったのか…',
    description:
      '買った山(1,500坪)を開拓してます。造成してもらい、家を建てる土地と畑が出来ました。',
    thumbNail: 'https://cdn.vuetifyjs.com/images/cards/sunshine.jpg',
    category: '旅行とイベント',
  },
  {
    id: 39,
    name: '宮古・神の島のさざなみ',
    description: 'この動画は宮古島の神の島、大神島で撮影した波の音の映像です。',
    thumbNail: 'https://cdn.vuetifyjs.com/images/cards/sunshine.jpg',
    category: '旅行とイベント',
  },
  {
    id: 5,
    name: '山買いました…3年後どうなったのか…',
    description:
      '買った山(1,500坪)を開拓してます。造成してもらい、家を建てる土地と畑が出来ました。',
    thumbNail: 'https://cdn.vuetifyjs.com/images/cards/sunshine.jpg',
    category: '旅行とイベント',
  },
]

export default {
  get({ values }) {
    return [200, movies]
  },
}
