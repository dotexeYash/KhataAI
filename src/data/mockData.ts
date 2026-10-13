import type { Customer, Transaction } from '../types'

function daysAgo(days: number, hours = 10, minutes = 15): string {
  const date = new Date()
  date.setHours(hours, minutes, 0, 0)
  date.setDate(date.getDate() - days)
  return date.toISOString()
}

export const mockCustomers: Customer[] = [
  { id: 'cust-1', name: 'Anil Reddy', phone: '9876543210' },
  { id: 'cust-2', name: 'Fatima Begum', phone: '9123456780' },
  { id: 'cust-3', name: 'Suresh Patel', phone: '9988776655' },
  { id: 'cust-4', name: 'Meena Iyer', phone: '9012345678' },
  { id: 'cust-5', name: 'Vikram Singh', phone: '9765432109' },
  { id: 'cust-6', name: 'Priya Sharma', phone: '8899001122' },
]

export const mockTransactions: Transaction[] = [
  {
    id: 'txn-1',
    customerId: 'cust-1',
    type: 'credit',
    amount: 2450,
    description: 'Rice, oil and sugar',
    date: daysAgo(12, 9, 20),
  },
  {
    id: 'txn-2',
    customerId: 'cust-1',
    type: 'repayment',
    amount: 1000,
    description: 'Partial payment',
    date: daysAgo(6, 16, 40),
  },
  {
    id: 'txn-3',
    customerId: 'cust-1',
    type: 'credit',
    amount: 780,
    description: 'Tea, biscuits and soap',
    date: daysAgo(0, 9, 10),
  },
  {
    id: 'txn-4',
    customerId: 'cust-2',
    type: 'credit',
    amount: 5200,
    description: 'Monthly grocery khata',
    date: daysAgo(18, 11, 5),
  },
  {
    id: 'txn-5',
    customerId: 'cust-2',
    type: 'repayment',
    amount: 2000,
    description: 'Cash repayment',
    date: daysAgo(0, 11, 45),
  },
  {
    id: 'txn-6',
    customerId: 'cust-3',
    type: 'credit',
    amount: 1850,
    description: 'Atta, dal and spices',
    date: daysAgo(4, 14, 0),
  },
  {
    id: 'txn-7',
    customerId: 'cust-3',
    type: 'repayment',
    amount: 1850,
    description: 'Full settlement',
    date: daysAgo(1, 18, 20),
  },
  {
    id: 'txn-8',
    customerId: 'cust-4',
    type: 'credit',
    amount: 640,
    description: 'Milk and bread',
    date: daysAgo(2, 8, 30),
  },
  {
    id: 'txn-9',
    customerId: 'cust-5',
    type: 'credit',
    amount: 3100,
    description: 'Festival items',
    date: daysAgo(9, 12, 15),
  },
  {
    id: 'txn-10',
    customerId: 'cust-5',
    type: 'repayment',
    amount: 1500,
    description: 'UPI repayment',
    date: daysAgo(3, 19, 50),
  },
  {
    id: 'txn-11',
    customerId: 'cust-6',
    type: 'credit',
    amount: 920,
    description: 'Cleaning supplies',
    date: daysAgo(0, 15, 5),
  },
  {
    id: 'txn-12',
    customerId: 'cust-4',
    type: 'repayment',
    amount: 200,
    description: 'Small cash payment',
    date: daysAgo(0, 17, 25),
  },
]
