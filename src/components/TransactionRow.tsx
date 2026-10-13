import type { Customer, Transaction } from '../types'
import { useLanguage } from '../i18n/LanguageContext'
import { formatDate, formatRupees } from '../utils/format'

type TransactionRowProps = {
  transaction: Transaction
  customerName?: Customer['name']
}

export function TransactionRow({ transaction, customerName }: TransactionRowProps) {
  const { t, locale } = useLanguage()
  const isCredit = transaction.type === 'credit'

  return (
    <article className="flex items-start justify-between gap-3 border-b border-slate-100 py-3 last:border-b-0">
      <div className="min-w-0">
        {customerName ? (
          <p className="truncate text-base font-semibold text-slate-900">{customerName}</p>
        ) : null}
        <p className="text-sm text-slate-600">{transaction.description}</p>
        <p className="mt-1 text-xs text-slate-500">
          {formatDate(transaction.date, locale)} · {isCredit ? t('creditPurchase') : t('repayment')}
        </p>
      </div>
      <p
        className={`shrink-0 text-base font-semibold ${
          isCredit ? 'text-amber-700' : 'text-emerald-700'
        }`}
      >
        {isCredit ? '+' : '−'}
        {formatRupees(transaction.amount)}
      </p>
    </article>
  )
}
