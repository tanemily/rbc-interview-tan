<script setup lang="ts">
import { ref } from "vue";
import type {
  Customer,
  CustomerMap,
  DailyMetricsMap,
} from "./storefront/types";
import {
  createCustomers,
  getFormattedCustomer,
  getRandomNum,
  isCustomerRegistered,
  registerCustomer,
  registerWaitListCustomer,
  updateDailyMetrics,
} from "./storefront/utils";
import { MAX_ALLOWED_IN_STORE } from "./storefront/constants";

// State
const days = ref(0);
const dailyIncome = ref(0);
const stopSimulation = ref(false);
const numCustomersInLine = ref(0);
const numCustomersInWaitList = ref(0);
const customersInStore = ref(0);
const linePos = ref(0);
const waitListPos = ref(0);
const customerWaitList = ref<Array<Customer>>([]);
const customersInLine = ref<Array<Customer>>([]);
const storeLog = ref<Array<string>>([]);
/*
These would be stored in a DB, using key-value pairs. For more security I would use
the phone number, first name, last name to generate a unique hash, for simplicity I will just use a concatenation.
*/
const CUSTOMER_MAP = ref<CustomerMap>({});
const CUSTOMER_WAIT_LIST_MAP = ref<CustomerMap>({});
const DAILY_METRICS_MAP = ref<DailyMetricsMap>({});

/**
 * @desc The shop function simulates a customer shopping in the store,
 * a random number is generated, if it's even the customer has decided to leave the store.
 */
const shop = () => {
  // generate a random num, if it's even, the customer leaves the store
  const wantsToLeave = getRandomNum(2);
  if (wantsToLeave % 2 == 0 && customersInStore.value > 0) {
    customersInStore.value = customersInStore.value - 1;
    storeLog.value.push(`Customer has left the store.`);
  }
};

/**
 * @desc Resets the simulation driver values to default
 */
const resetSimulation = () => {
  stopSimulation.value = false;
  linePos.value = 0;
  waitListPos.value = 0;
  dailyIncome.value = 0;
  storeLog.value = [];
  CUSTOMER_MAP.value = {};
};

/**
 * @desc process the store customers
 * Allows customers in line to enter into the store if the capacity has not been reached, registers them in a Customer DB.
 * Moves customers from wait list to the line, if the customer is already registered that means they were in already in line.
 * Skips customers that were both in line and on wait list.
 */
const processStoreLine = () => {
  if (
    linePos.value < customersInLine.value.length &&
    customersInStore.value !== MAX_ALLOWED_IN_STORE // Don't let anyone into the store if at capacity
  ) {
    // register the customer, if the customer already exists then they are duplicate and can be skipped over.
    const lineCustomer = customersInLine.value[linePos.value];
    registerCustomer(lineCustomer, CUSTOMER_MAP.value);
    storeLog.value.push(
      `Customer ${getFormattedCustomer(lineCustomer)} entered the store!`
    );
    customersInStore.value++;
    const moneySpent = getRandomNum(15);
    storeLog.value.push(`Customer spent $${moneySpent}!`);
    dailyIncome.value += moneySpent;
    linePos.value++;
  }
  // Update the wait list
  if (waitListPos.value < customerWaitList.value.length) {
    const waitListCustomer = customerWaitList.value[waitListPos.value];
    // If they were already registered that means they were already in line and can skip adding them to the line
    if (!isCustomerRegistered(waitListCustomer, CUSTOMER_MAP.value)) {
      registerWaitListCustomer(waitListCustomer, CUSTOMER_WAIT_LIST_MAP.value);
      storeLog.value.push(
        `Customer ${getFormattedCustomer(waitListCustomer)} moved from wait list to line.`
      );
      // Add the wait list customer to the line
      customersInLine.value.push(waitListCustomer);
    }
    waitListPos.value++;
  }
};

/**
 * Runs the store simulation
 */
const createStoreSimulation = () => {
  // reset the simulation values
  resetSimulation();
  days.value++;

  const overflow = numCustomersInLine.value - MAX_ALLOWED_IN_STORE;
  let numInLine = numCustomersInLine.value;
  let numInWaitList = numCustomersInWaitList.value;

  if (overflow > 0) {
    numInLine = MAX_ALLOWED_IN_STORE;
    numInWaitList = numCustomersInWaitList.value + overflow;
  }

  // Create customer line
  customersInLine.value = createCustomers(numInLine);
  // create customer wait list
  customerWaitList.value = createCustomers(numInWaitList);

  // Until the stop flag is reached, process the store line
  while (!stopSimulation.value) {
    processStoreLine();
    shop();
    // If the end of the line is reached and the wait list and the store is empty, then end the simulation
    if (
      customersInLine.value.length == linePos.value &&
      customersInStore.value == 0
    ) {
      stopSimulation.value = true;
    }
  }

  updateDailyMetrics(
    days.value,
    {
      income: dailyIncome.value,
      totalCustomersInStore: customersInLine.value.length,
    },
    DAILY_METRICS_MAP.value
  );
};
/**
 * @desc provide upper and lower limits to the customer and wait list inputs
 */
const limitInputs = () => {
  if (numCustomersInLine.value > 2000) {
    numCustomersInLine.value = 2000;
  }
  if (numCustomersInLine.value < 0) {
    numCustomersInLine.value = 0;
  }
  if (numCustomersInWaitList.value > 2000) {
    numCustomersInWaitList.value = 2000;
  }
  if (numCustomersInWaitList.value < 0) {
    numCustomersInWaitList.value = 0;
  }
};
</script>

<template>
  <main>
    <header>
      <h1>tiTAN the Sew</h1>
    </header>

    <div class="parameters">
      <label for="line">Customers in line</label>
      <input
        v-model="numCustomersInLine"
        id="line"
        type="number"
        @input="limitInputs"
      />
      <label for="waitlist">Customers in wait list</label>
      <input
        v-model="numCustomersInWaitList"
        id="waitlist"
        min="0"
        max="2500"
        type="number"
        @input="limitInputs"
      />
      <button type="button" @click="createStoreSimulation">
        Simulate Store
      </button>
    </div>
    <h2>Storefront Stats</h2>
    <div>
      <table>
        <caption>
          Olivia's Daily Metrics
        </caption>
        <thead>
          <tr>
            <th scope="col">Day</th>
            <th scope="col">Customers served</th>
            <th scope="col">Income Generated</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(dailyMetrics, index) in Object.values(DAILY_METRICS_MAP)"
            :key="index"
          >
            <td>{{ index + 1 }}</td>
            <td :data-test="`customersInStore-${index}`">
              {{ dailyMetrics.totalCustomersInStore }}
            </td>
            <td>${{ dailyMetrics.income }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <h2>Storefront Log</h2>
    <div class="storefront">
      <p v-for="(storeLogEntry, index) in storeLog" :key="index">
        {{ storeLogEntry }}
      </p>
    </div>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

header {
  text-align: center;
  width: 400px;
}

table {
  border-collapse: collapse;
  border: 2px solid pink;
  letter-spacing: 1px;
}
th,
td {
  border: 1px solid pink;
  padding: 8px 10px;
}

button {
  margin-top: 8px;
  border-radius: 3px;
  background-color: pink;
  border-color: white;
  border-style: solid;
  cursor: pointer;
  color: white;
  padding: 12px;
  font-size: 16px;
}

label {
  font-weight: bold;
  font-size: 18px;
}

input {
  padding: 12px;
  font-size: 16px;
  border-radius: 3px;
  border-style: solid;
  border-color: pink;
}

.storefront {
  border: solid 2px pink;
  border-radius: 3px;
  padding: 12px;
  width: 50%;
  height: 250px;
  overflow-y: scroll;
}

.parameters {
  display: flex;
  flex-direction: column;
  width: 25%;
}
</style>
