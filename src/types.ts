export type TransactionType = 'credit' | 'repayment'

export type Customer = {
  id: string
  name: string
  phone: string
}

export type Transaction = {
  id: string
  customerId: string
  type: TransactionType
  amount: number
  description: string
  date: string
}
