import { mount } from '@vue/test-utils'
import { test, expect, describe, vi } from 'vitest'
import App from '../App.vue'
import * as StorefrontUtils from '../storefront/utils'

const renderComponent = () => {
  return mount(App, {
    props: {},
  })
}

const customersInLine = [
  { firstName: 'Emily', lastName: 'Tan', phoneNumber: '1123345678' },
  { firstName: 'Joe', lastName: 'Smith', phoneNumber: '1453345678' },
]

describe('Storefront', () => {
  test('loads for the user', () => {
    const wrapper = renderComponent()
    expect(wrapper.text()).toContain('tiTAN the Sew')
  })

  test('can add customers to only line', async () => {
    const wrapper = renderComponent()
    const lineInput = wrapper.find('#line')
    lineInput.setValue(100)

    const runButton = wrapper.find('button')
    await runButton.trigger('click')

    const customersInStoreCell = wrapper.find('[data-test="customersInStore-0"]')
    expect(customersInStoreCell.text()).toContain('100')
  })

  test('can add customers to only wait list', async () => {
    const wrapper = renderComponent()
    const waitListInput = wrapper.find('#waitlist')
    waitListInput.setValue(100)

    const runButton = wrapper.find('button')
    await runButton.trigger('click')

    const customersInStoreCell = wrapper.find('[data-test="customersInStore-0"]')
    expect(customersInStoreCell.text()).toContain('100')
  })

  test('can add to wait list and line', async () => {
    const wrapper = renderComponent()
    const lineInput = wrapper.find('#line')
    lineInput.setValue(100)
    const waitListInput = wrapper.find('#waitlist')
    waitListInput.setValue(100)

    const runButton = wrapper.find('button')
    await runButton.trigger('click')

    const customersInStoreCell = wrapper.find('[data-test="customersInStore-0"]')
    expect(customersInStoreCell.text()).toContain('200')
  })

  test('duplicate customers only enter the store once', async () => {
    const wrapper = renderComponent()
    const lineInput = wrapper.find('#line')
    lineInput.setValue(2)
    const waitListInput = wrapper.find('#waitlist')
    waitListInput.setValue(2)

    const spyCreateCustomers = vi.spyOn(StorefrontUtils, 'createCustomers')
    spyCreateCustomers.mockImplementation(() => customersInLine)

    const runButton = wrapper.find('button')
    await runButton.trigger('click')

    const customersInStoreCell = wrapper.find('[data-test="customersInStore-0"]')
    expect(customersInStoreCell.text()).toContain('2')
  })
})
