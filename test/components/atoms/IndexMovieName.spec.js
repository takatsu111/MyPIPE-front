import { shallowMount } from '@vue/test-utils'
import IndexMovieName from '@/components/atoms/IndexMovieName.vue'

describe('Page', () => {
  test('IndexMovieName', () => {
    const wrapper = shallowMount(IndexMovieName, {
      propsData: {
        movieName: 'MyGreatMovie',
      },
    })
    expect(wrapper.vm.$props.movieName).toBe('MyGreatMovie')
    expect(wrapper.text()).toBe('MyGreatMovie')
  })
})
