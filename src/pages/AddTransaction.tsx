import { useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { getTransactionBalanceChange, useLedger } from '../context/LedgerContext'
import { useLanguage } from '../i18n/LanguageContext'
import type { TransactionType } from '../types'
import { formatRupees } from '../utils/format'

type Draft = {
  customerId: string
  type: TransactionType
  amount: string
  description: string
}

const emptyDraft: Draft = {
  customerId: '',
  type: 'credit',
  amount: '',
  description: '',
}

export function AddTransaction() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { customers, addTransaction, getBalance, getCustomer } = useLedger()

  const [step, setStep] = useState<'form' | 'review' | 'done'>('form')
  const [draft, setDraft] = useState<Draft>({
    ...emptyDraft,
    customerId: searchParams.get('customerId') ?? '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof Draft, string>>>({})

  const amountValue = Number(draft.amount)
  const selectedCustomer = getCustomer(draft.customerId)
  const currentBalance = selectedCustomer ? getBalance(selectedCustomer.id) : 0
  const nextBalance = useMemo(() => {
    if (!selectedCustomer || !Number.isFinite(amountValue) || amountValue <= 0) {
      return currentBalance
    }
    return currentBalance + getTransactionBalanceChange(draft.type, amountValue)
  }, [amountValue, currentBalance, draft.type, selectedCustomer])

  function validate(): boolean {
    const nextErrors: Partial<Record<keyof Draft, string>> = {}
    if (!draft.customerId) {
      nextErrors.customerId = t('requiredCustomer')
    }
    if (!Number.isFinite(amountValue) || amountValue <= 0) {
      nextErrors.amount = t('invalidAmount')
    }
    if (draft.description.trim().length < 2) {
      nextErrors.description = t('requiredDescription')
    }
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function handleContinue(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (validate()) {
      setStep('review')
    }
  }

  function handleConfirm() {
    if (!validate()) {
      setStep('form')
      return
    }
    addTransaction({
      customerId: draft.customerId,
      type: draft.type,
      amount: amountValue,
      description: draft.description,
    })
    setStep('done')
  }

  if (step === 'done' && selectedCustomer) {
    return (
      <div className="space-y-5">
        <h1 className="text-2xl font-semibold">{t('savedInSession')}</h1>
        <p className="rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-900">
          {t('afterSaveHint')}
        </p>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="font-semibold">{selectedCustomer.name}</p>
          <p className="text-slate-600">
            {draft.type === 'credit' ? t('creditPurchase') : t('repayment')} · {formatRupees(amountValue)}
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => navigate(`/customers/${selectedCustomer.id}`)}
            className="min-h-12 rounded-2xl bg-emerald-600 font-semibold text-white"
          >
            {t('openLedger')}
          </button>
          <button
            type="button"
            onClick={() => {
              setDraft({ ...emptyDraft, customerId: selectedCustomer.id })
              setStep('form')
            }}
            className="min-h-12 rounded-2xl border border-slate-200 font-semibold"
          >
            {t('continue')}
          </button>
        </div>
      </div>
    )
  }

  if (step === 'review') {
    return (
      <div className="space-y-5">
        <h1 className="text-2xl font-semibold">{t('reviewTitle')}</h1>
        <p className="text-slate-600">{t('reviewHint')}</p>
        <dl className="space-y-3 rounded-2xl bg-white p-4 shadow-sm">
          <div>
            <dt className="text-sm text-slate-500">{t('selectCustomer')}</dt>
            <dd className="text-lg font-semibold">{selectedCustomer?.name}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-500">{t('type')}</dt>
            <dd className="text-lg font-semibold">
              {draft.type === 'credit' ? t('creditPurchase') : t('repayment')}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-slate-500">{t('amount')}</dt>
            <dd className="text-lg font-semibold">{formatRupees(amountValue)}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-500">{t('description')}</dt>
            <dd className="text-lg">{draft.description}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-500">{t('newBalance')}</dt>
            <dd className="text-lg font-semibold">{formatRupees(nextBalance)}</dd>
          </div>
        </dl>
        <p className="text-sm text-slate-500">{t('sessionOnlyNotice')}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={handleConfirm}
            className="min-h-12 rounded-2xl bg-emerald-600 font-semibold text-white"
          >
            {t('confirmSave')}
          </button>
          <button
            type="button"
            onClick={() => setStep('form')}
            className="min-h-12 rounded-2xl border border-slate-200 font-semibold"
          >
            {t('back')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold">{t('addTransaction')}</h1>
      <form onSubmit={handleContinue} className="space-y-4 rounded-2xl bg-white p-4 shadow-sm">
        <label className="block">
          <span className="mb-1 block text-sm font-medium">{t('selectCustomer')}</span>
          <select
            value={draft.customerId}
            onChange={(event) => setDraft((current) => ({ ...current, customerId: event.target.value }))}
            className="min-h-12 w-full rounded-2xl border border-slate-200 bg-white px-3 outline-none ring-emerald-500 focus:ring-2"
          >
            <option value="">{t('selectCustomer')}</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name} · {customer.phone}
              </option>
            ))}
          </select>
          {errors.customerId ? <p className="mt-1 text-sm text-red-600">{errors.customerId}</p> : null}
        </label>

        <fieldset>
          <legend className="mb-2 text-sm font-medium">{t('type')}</legend>
          <div className="grid grid-cols-2 gap-2">
            {(['credit', 'repayment'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setDraft((current) => ({ ...current, type }))}
                className={`min-h-12 rounded-2xl border px-3 font-semibold ${
                  draft.type === type
                    ? 'border-emerald-600 bg-emerald-600 text-white'
                    : 'border-slate-200 bg-slate-50'
                }`}
              >
                {type === 'credit' ? t('creditPurchase') : t('repayment')}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="block">
          <span className="mb-1 block text-sm font-medium">{t('amount')}</span>
          <input
            value={draft.amount}
            onChange={(event) => setDraft((current) => ({ ...current, amount: event.target.value }))}
            placeholder={t('amountPlaceholder')}
            inputMode="decimal"
            className="min-h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none ring-emerald-500 focus:ring-2"
          />
          {errors.amount ? <p className="mt-1 text-sm text-red-600">{errors.amount}</p> : null}
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium">{t('description')}</span>
          <input
            value={draft.description}
            onChange={(event) =>
              setDraft((current) => ({ ...current, description: event.target.value }))
            }
            placeholder={t('descriptionPlaceholder')}
            className="min-h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none ring-emerald-500 focus:ring-2"
          />
          <p className="mt-1 text-sm text-slate-500">{t('descriptionHint')}</p>
          {errors.description ? (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          ) : null}
        </label>

        <button
          type="submit"
          className="min-h-12 w-full rounded-2xl bg-emerald-600 text-base font-semibold text-white"
        >
          {t('review')}
        </button>
      </form>

      {customers.length === 0 ? (
        <p className="text-slate-600">
          {t('noCustomers')}{' '}
          <Link to="/customers?add=1" className="font-semibold text-emerald-700">
            {t('addCustomer')}
          </Link>
        </p>
      ) : null}
    </div>
  )
}
