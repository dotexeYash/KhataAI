import { useMemo, useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useLedger } from '../context/LedgerContext'
import { useLanguage } from '../i18n/LanguageContext'
import { formatRupees, isValidIndianPhone } from '../utils/format'

export function Customers() {
  const { t } = useLanguage()
  const { customers, addCustomer, getBalance } = useLedger()
  const [searchParams, setSearchParams] = useSearchParams()
  const showForm = searchParams.get('add') === '1'

  const [query, setQuery] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [nameError, setNameError] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [sessionNote, setSessionNote] = useState('')

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return customers.filter((customer) => {
      if (!needle) {
        return true
      }
      return (
        customer.name.toLowerCase().includes(needle) ||
        customer.phone.replace(/\s/g, '').includes(needle.replace(/\s/g, ''))
      )
    })
  }, [customers, query])

  function openForm() {
    setSearchParams({ add: '1' })
    setSessionNote('')
  }

  function closeForm() {
    setSearchParams({})
    setName('')
    setPhone('')
    setNameError('')
    setPhoneError('')
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextNameError = name.trim().length < 2 ? t('requiredName') : ''
    const nextPhoneError = isValidIndianPhone(phone) ? '' : t('invalidPhone')
    setNameError(nextNameError)
    setPhoneError(nextPhoneError)
    if (nextNameError || nextPhoneError) {
      return
    }

    addCustomer({ name, phone })
    closeForm()
    setSessionNote(t('sessionOnlyNotice'))
  }

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">{t('navCustomers')}</h1>
        <button
          type="button"
          onClick={openForm}
          className="min-h-12 rounded-2xl bg-emerald-600 px-4 py-3 text-base font-semibold text-white"
        >
          {t('addCustomer')}
        </button>
      </header>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">
          {t('searchCustomers')}
        </span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t('searchPlaceholder')}
          className="min-h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-base outline-none ring-emerald-500 focus:ring-2"
        />
      </label>

      {sessionNote ? (
        <p className="rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-900">{sessionNote}</p>
      ) : null}

      {showForm ? (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm"
        >
          <label className="block">
            <span className="mb-1 block text-sm font-medium">{t('customerName')}</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={t('namePlaceholder')}
              className="min-h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none ring-emerald-500 focus:ring-2"
            />
            {nameError ? <p className="mt-1 text-sm text-red-600">{nameError}</p> : null}
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">{t('phoneNumber')}</span>
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder={t('phonePlaceholder')}
              inputMode="tel"
              className="min-h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none ring-emerald-500 focus:ring-2"
            />
            <p className="mt-1 text-sm text-slate-500">{t('phoneHint')}</p>
            {phoneError ? <p className="mt-1 text-sm text-red-600">{phoneError}</p> : null}
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="submit"
              className="min-h-12 flex-1 rounded-2xl bg-emerald-600 px-4 text-base font-semibold text-white"
            >
              {t('saveCustomer')}
            </button>
            <button
              type="button"
              onClick={closeForm}
              className="min-h-12 flex-1 rounded-2xl border border-slate-200 px-4 text-base font-semibold"
            >
              {t('cancel')}
            </button>
          </div>
        </form>
      ) : null}

      {filtered.length === 0 ? (
        <p className="rounded-2xl bg-white p-4 text-slate-600">
          {customers.length === 0 ? t('noCustomers') : t('noSearchResults')}
        </p>
      ) : (
        <ul className="space-y-3">
          {filtered.map((customer) => {
            const balance = getBalance(customer.id)
            return (
              <li key={customer.id}>
                <Link
                  to={`/customers/${customer.id}`}
                  className="block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold">{customer.name}</p>
                      <p className="text-sm text-slate-500">{customer.phone}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">{t('outstandingBalance')}</p>
                      <p
                        className={`text-lg font-semibold ${
                          balance > 0 ? 'text-amber-700' : 'text-emerald-700'
                        }`}
                      >
                        {formatRupees(balance)}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-emerald-700">{t('openLedger')}</p>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
