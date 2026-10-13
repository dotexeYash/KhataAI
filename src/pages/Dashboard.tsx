import { Link } from 'react-router-dom'
import { StatCard } from '../components/StatCard'
import { TransactionRow } from '../components/TransactionRow'
import { useLedger } from '../context/LedgerContext'
import { useLanguage } from '../i18n/LanguageContext'
import { formatRupees } from '../utils/format'

export function Dashboard() {
  const { t } = useLanguage()
  const { customers, transactions, totalOutstanding, paymentsToday } = useLedger()

  const recent = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6)

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">{t('navDashboard')}</h1>
        <p className="mt-1 text-sm text-slate-600">{t('sampleShop')}</p>
        <p className="mt-2 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-900">
          {t('sampleDataNotice')}
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-3">
        <StatCard label={t('outstandingCredit')} value={formatRupees(totalOutstanding)} />
        <StatCard label={t('paymentsToday')} value={formatRupees(paymentsToday)} />
        <StatCard label={t('customerCount')} value={String(customers.length)} />
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">{t('quickActions')}</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <Link
            to="/add-transaction"
            className="flex min-h-14 items-center justify-center rounded-2xl bg-emerald-600 px-4 py-3 text-center text-base font-semibold text-white"
          >
            {t('addTransaction')}
          </Link>
          <Link
            to="/customers"
            className="flex min-h-14 items-center justify-center rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-center text-base font-semibold text-emerald-800"
          >
            {t('viewCustomers')}
          </Link>
          <Link
            to="/customers?add=1"
            className="flex min-h-14 items-center justify-center rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-center text-base font-semibold text-emerald-800"
          >
            {t('addCustomer')}
          </Link>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold">{t('recentTransactions')}</h2>
        <div className="mt-2">
          {recent.map((transaction) => {
            const customer = customers.find((item) => item.id === transaction.customerId)
            return (
              <TransactionRow
                key={transaction.id}
                transaction={transaction}
                customerName={customer?.name}
              />
            )
          })}
        </div>
      </section>
    </div>
  )
}
