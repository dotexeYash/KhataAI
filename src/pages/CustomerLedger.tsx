import { Link, useParams } from 'react-router-dom'
import { TransactionRow } from '../components/TransactionRow'
import { useLedger } from '../context/LedgerContext'
import { useLanguage } from '../i18n/LanguageContext'
import { formatRupees } from '../utils/format'

export function CustomerLedger() {
  const { customerId } = useParams()
  const { t } = useLanguage()
  const { getCustomer, getBalance, getCustomerTransactions } = useLedger()

  const customer = customerId ? getCustomer(customerId) : undefined

  if (!customer) {
    return (
      <div className="space-y-4">
        <p className="text-lg">{t('noCustomerFound')}</p>
        <Link to="/customers" className="inline-flex min-h-12 items-center font-semibold text-emerald-700">
          {t('backToCustomers')}
        </Link>
      </div>
    )
  }

  const balance = getBalance(customer.id)
  const history = getCustomerTransactions(customer.id)

  return (
    <div className="space-y-5">
      <Link to="/customers" className="inline-flex text-sm font-semibold text-emerald-700">
        ← {t('backToCustomers')}
      </Link>

      <header className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
        <h1 className="text-2xl font-semibold">{customer.name}</h1>
        <p className="text-slate-500">{customer.phone}</p>
        <p className="mt-4 text-sm text-slate-500">{t('currentBalance')}</p>
        <p className={`text-3xl font-semibold ${balance > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
          {formatRupees(balance)}
        </p>
        <Link
          to={`/add-transaction?customerId=${customer.id}`}
          className="mt-4 inline-flex min-h-12 items-center rounded-2xl bg-emerald-600 px-4 font-semibold text-white"
        >
          {t('addTransaction')}
        </Link>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold">{t('transactionHistory')}</h2>
        {history.length === 0 ? (
          <p className="mt-3 text-slate-600">{t('noTransactions')}</p>
        ) : (
          <div className="mt-2">
            {history.map((transaction) => (
              <TransactionRow key={transaction.id} transaction={transaction} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
