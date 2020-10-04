import { shallowMount } from '@vue/test-utils'
import ServerErrorMessage from '@/components/atoms/ServerErrorMessage.vue'
import IndexMovieName from '@/components/atoms/IndexMovieName.vue'

describe('Page', () => {
  test('ServerErrorMessage', () => {
    const wrapper = shallowMount(ServerErrorMessage, {
      propsData: {
        message: 'Server Error!',
        color: 'blue',
      },
    })
    expect(wrapper.vm.$props.message).toBe('Server Error!')
    expect(wrapper.vm.$props.color).toBe('blue')
  })

  test('IndexMovieName', () => {
    const wrapper = shallowMount(IndexMovieName, {
      propsData: {
        movieName: "MyGreatMovie"
      },
    })
    expect(wrapper.vm.$props.movieName).toBe('MyGreatMovie')
  })
})
