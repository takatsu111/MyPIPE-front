export default {
  post({ data }) {
    console.log(data.movie_id)
    console.log(data.body)
    return [400]
  },
}
