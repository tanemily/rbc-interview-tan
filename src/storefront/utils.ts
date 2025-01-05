import type { Customer, CustomerMap, DailyMetrics, DailyMetricsMap } from './types'
import { uniqueNamesGenerator, type Config, names } from 'unique-names-generator'
import { CountryNames, generatePhoneNumber } from 'phone-number-generator-js'

const config: Config = {
  dictionaries: [names],
}

const getCustomerUniqueId = ({ firstName, lastName, phoneNumber }: Customer) =>
  firstName + lastName + phoneNumber

export const getFormattedCustomer = ({ firstName, lastName, phoneNumber }: Customer) =>
  `${firstName} ${lastName} (${phoneNumber})`

/**
 * @param customer - A customers info used to identify them
 * @param customerWaitListMap - the customer map to update
 */
export const registerWaitListCustomer = (customer: Customer, customerWaitListMap: CustomerMap) => {
  const uniqueId = getCustomerUniqueId(customer)
  customerWaitListMap[uniqueId] = customer
}

/**
 * @param customer - A customers info used to identify them
 * @param customerMap - the customer map to update
 */
export const registerCustomer = (customer: Customer, customerMap: CustomerMap) => {
  const uniqueId = getCustomerUniqueId(customer)
  customerMap[uniqueId] = customer
}

/**
 * @desc Checks the registration status of a customer
 * @param customer - A customers info used to identify them
 * @returns true if the customer is registered, else false
 */
export const isCustomerRegistered = (customer: Customer, customerMap: CustomerMap) => {
  const uniqueId = getCustomerUniqueId(customer)
  if (customerMap[uniqueId]) {
    return true
  }
  return false
}

/**
 * @desc Creates a number of customers equal to the passed in value
 * @param numCustomers
 * @returns An array of customers with length equal to numCustomers
 */
export const createCustomers = (numCustomers: number) => {
  const customerArray: Array<Customer> = []
  for (let i = 0; i < numCustomers; i++) {
    const firstName: string = uniqueNamesGenerator(config)
    const lastName: string = uniqueNamesGenerator(config)
    const phoneNumber = generatePhoneNumber({
      countryName: CountryNames.Canada,
      withoutCountryCode: true,
    })
    customerArray.push({ firstName, lastName, phoneNumber })
  }
  return customerArray
}

/** @desc generates a random number up to the max
 * @param max - the upper bound of the random number
 */
export const getRandomNum = (max: number) => Math.floor(Math.random() * max)

/**
 * @desc Update the daily metric 'DB' with the key and value
 * @param key - This should correspond to the day
 * @param value - The metrics for that day
 * @param dailyMetricsMap - the daily metrics map to update
 */
export const updateDailyMetrics = (
  key: number,
  value: DailyMetrics,
  dailyMetricsMap: DailyMetricsMap,
) => {
  dailyMetricsMap[key] = value
}
