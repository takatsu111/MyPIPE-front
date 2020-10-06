import { shallowMount } from '@vue/test-utils'
import ServerErrorMessage from '@/components/atoms/ServerErrorMessage.vue'

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
    expect(wrapper.text()).toBe('Server Error!')
  })
})
