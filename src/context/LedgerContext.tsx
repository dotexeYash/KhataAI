import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { mockCustomers, mockTransactions } from '../data/mockData'
import type { Customer, Transaction, TransactionType } from '../types'
import { createId, isSameLocalDay } from '../utils/format'

type NewCustomer = {
  name: string
  phone: string
}

type NewTransaction = {
  customerId: string
  type: TransactionType
  amount: number
  description: string
}

type LedgerContextValue = {
  customers: Customer[]
  transactions: Transaction[]
  addCustomer: (input: NewCustomer) => Customer
  addTransaction: (input: NewTransaction) => Transaction
  getCustomer: (id: string) => Customer | undefined
  getBalance: (customerId: string) => number
  getCustomerTransactions: (customerId: string) => Transaction[]
  totalOutstanding: number
  paymentsToday: number
}

const LedgerContext = createContext<LedgerContextValue | null>(null)

export function getTransactionBalanceChange(
  type: TransactionType,
  amount: number,
): number {
  return type === 'credit' ? amount : -amount
}

export function LedgerProvider({ children }: { children: ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers)
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions)

  const value = useMemo<LedgerContextValue>(() => {
    const getCustomerTransactions = (customerId: string) =>
      transactions
        .filter((transaction) => transaction.customerId === customerId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    const getBalance = (customerId: string) =>
      transactions
        .filter((transaction) => transaction.customerId === customerId)
        .reduce(
          (sum, transaction) =>
            sum + getTransactionBalanceChange(transaction.type, transaction.amount),
          0,
        )

    return {
      customers,
      transactions,
      addCustomer: (input) => {
        const customer: Customer = {
          id: createId('cust'),
          name: input.name.trim(),
          phone: input.phone.trim(),
        }
        setCustomers((current) => [customer, ...current])
        return customer
      },
      addTransaction: (input) => {
        const transaction: Transaction = {
          id: createId('txn'),
          customerId: input.customerId,
          type: input.type,
          amount: input.amount,
          description: input.description.trim(),
          date: new Date().toISOString(),
        }
        setTransactions((current) => [transaction, ...current])
        return transaction
      },
      getCustomer: (id) => customers.find((customer) => customer.id === id),
      getBalance,
      getCustomerTransactions,
      totalOutstanding: customers.reduce(
        (sum, customer) => sum + Math.max(0, getBalance(customer.id)),
        0,
      ),
      paymentsToday: transactions
        .filter(
          (transaction) =>
            transaction.type === 'repayment' && isSameLocalDay(transaction.date),
        )
        .reduce((sum, transaction) => sum + transaction.amount, 0),
    }
  }, [customers, transactions])

  return <LedgerContext.Provider value={value}>{children}</LedgerContext.Provider>
}

export function useLedger() {
  const context = useContext(LedgerContext)
  if (!context) {
    throw new Error('useLedger must be used inside LedgerProvider')
  }
  return context
}
