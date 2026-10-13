const rupeeFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
})

export function formatRupees(amount: number): string {
  return rupeeFormatter.format(amount)
}

export function formatDate(isoDate: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(isoDate))
}

export function isSameLocalDay(isoDate: string, now = new Date()): boolean {
  const date = new Date(isoDate)
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  )
}

export function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, '')
}

export function isValidIndianPhone(phone: string): boolean {
  const digits = digitsOnly(phone)
  if (digits.length === 12 && digits.startsWith('91')) {
    return /^[6-9]\d{9}$/.test(digits.slice(2))
  }
  return /^[6-9]\d{9}$/.test(digits)
}
