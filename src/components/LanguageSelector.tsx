import { languages } from '../i18n/translations'
import { useLanguage } from '../i18n/LanguageContext'

type LanguageSelectorProps = {
  compact?: boolean
}

export function LanguageSelector({ compact = false }: LanguageSelectorProps) {
  const { language, setLanguage, t } = useLanguage()

  return (
    <section className={compact ? '' : 'space-y-4'}>
      {!compact ? (
        <>
          <h1 className="text-2xl font-semibold text-slate-900">{t('chooseLanguage')}</h1>
          <p className="text-base leading-relaxed text-slate-600">{t('languageHelp')}</p>
        </>
      ) : null}

      <div className={compact ? 'grid gap-2' : 'grid gap-3 sm:grid-cols-3'}>
        {languages.map((item) => {
          const selected = item.code === language
          return (
            <button
              key={item.code}
              type="button"
              onClick={() => setLanguage(item.code)}
              className={`min-h-14 rounded-2xl border px-4 py-3 text-left shadow-sm transition ${
                selected
                  ? 'border-emerald-600 bg-emerald-600 text-white'
                  : 'border-slate-200 bg-white text-slate-800 hover:border-emerald-400'
              }`}
            >
              <span className="block text-lg font-semibold">{item.nativeName}</span>
              <span className={`block text-sm ${selected ? 'text-emerald-50' : 'text-slate-500'}`}>
                {item.englishName}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
