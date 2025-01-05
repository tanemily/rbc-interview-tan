export type Customer = {
  firstName: string
  lastName: string
  phoneNumber: string
}

export type DailyMetrics = {
  totalCustomersInStore: number
  income: number
}

export type CustomerMap = { [key: string]: Customer }

export type DailyMetricsMap = { [key: number]: DailyMetrics }
