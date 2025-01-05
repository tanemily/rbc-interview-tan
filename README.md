# Interview Round 2 Solution

This solution simulates Olivia's storefront - tiTAN the Sew. The concept of the site is to simulate a day at the store, with inputs (both limited at 2000 for simplicity) for the number of customers in line as well as the number on the wait list. For each day that is simulated, Olivia can see the store metrics - how many customers were served, and how much income was generated. Below the stats are the store's logs, which show the customers coming into the store, leaving, and how much money was spent for the current simulated day.

To access the static site, please see: https://effortless-zabaione-02519f.netlify.app/

## App.vue

The `App.vue` file contains most of the logic for the solution. The structure of the file is as follows:

- imports
- variables:
  - `CUSTOMER_MAP`: a map of all the customers that have entered the store.
  - `CUSTOMER_WAIT_LIST_MAP`: a map of all the non duplicated customers that were on the wait list.
  - `DAILY_METRICS_MAP`: a map of the all the metrics for each simulated day.
- methods:
  - `shop()`: simulates when the customer leaves after being in the store. To simulate randomness, a random number is generated. If the random number generated is an even number, the customer leaves the store. This updates the count of the number of customers in the store and adds the message (Customer has left the store.) to the store logs.
  - `resetSimulation()`: resets all key variables to default values
  - `processStoreLine()`: simulates the customers entering the store.
    - Checks if there are any customers in line, and also if the store is not at max capacity. If so, register the customer (see explanation for `registerCustomer()` under utils) by adding them to the `CUSTOMER_MAP`. Indicate that the customer has entered the store in the store logs. Increment the number of customers in the store by 1. Generate another random number to indicate how much money that customer has spent in the store.
    - Checks if there are any customers in the wait list. If the customer has already been registered, that means they have already entered the store and are a duplicate. They need not be registered again. If they aren't registered, they are added to the `CUSTOMER_WAIT_LIST_MAP` and are allowed in the customer line.
  - `createStoreSimulation()`: starts the simulation of the store. Reset the simulation to start with blank state. Increment the days as this will be a new day.
    - Check for any overflow of the customers in the line, add them to the waitlist if over the max storefront capacity. Create the customer line (see explanation for `createCustomers()` under utils).
    - Create the wait list line (same method, `createCustomers()`, used).
    - In a while loop (stops when the end of the line is reached and there are no customers in the store), the customer lines are processed (`processStoreLine()`), and customers potentially leave (`shop()`).
    - Finally, once the while loop is executed, the `DAILY_METRICS_MAP` is updated with the day of the simulation and its corresponding number of customers, and income generated.
  - `limitInputs()`: only allow inputs for the lines (customer and waitlist) between 0 and 2000 (inclusive)
- template containing all the html

## types.ts

Each `Customer` has first name, last name, and phone number.
The `DailyMetrics` has the total number of customers in store, and the income.
`CustomerMap` contains a unique identifier (concatenation of first name, last name, and phone number) as keys and `Customer` as values.
`DailyMetricsMap` contains the day of the simulation as keys and DailyMetrics as values.

## utils.ts

Contains all helper methods.

- `getCustomerUniqueId()`: takes the given customer's properties and concates them to return a unique identifier.
- `getFormattedCustomer()`: formats the customer's info to display in the store logs.
- `registerWaitListCustomer()`: add the customer to the provided wait list map using the unique identifier created for that customer.
- `registerCustomer()`: add the customer to the provided customer map using the unique identifier created for that customer.
- `isCustomerRegistered()`: checks if the customer is already in the customer map, indicating that they are already registered and have entered the store.
- `createCustomers()`: using external libraries, generate names and phone numbers for each customer and add them to the array of customers.
- `getRandomNum()`: get a random whole number up to the given maximum.
- `updateDailyMetrics()`: update the metrics map with the provided day of the simulation and values (`DailyMetrics`).

## storefront.test.ts

A few basic unit tests can be found in this file. Tests were created using vitest and vue test utils.

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
