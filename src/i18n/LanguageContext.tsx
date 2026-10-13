import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  isLanguageCode,
  languages,
  translations,
  type LanguageCode,
  type TranslationKey,
} from './translations'

type LanguageContextValue = {
  language: LanguageCode
  locale: string
  setLanguage: (code: LanguageCode) => void
  t: (key: TranslationKey) => string
}

const STORAGE_KEY = 'khataai-language'
const LanguageContext = createContext<LanguageContextValue | null>(null)

function readStoredLanguage(): LanguageCode {
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored && isLanguageCode(stored)) {
    return stored
  }
  return 'en'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(readStoredLanguage)

  const value = useMemo<LanguageContextValue>(() => {
    const current = languages.find((item) => item.code === language) ?? languages[0]

    return {
      language,
      locale: current.locale,
      setLanguage: (code: LanguageCode) => {
        setLanguageState(code)
        window.localStorage.setItem(STORAGE_KEY, code)
      },
      t: (key: TranslationKey) => translations[language][key],
    }
  }, [language])

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used inside LanguageProvider')
  }
  return context
}
