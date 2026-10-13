import { NavLink, Outlet } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'

const navItems = [
  { to: '/', key: 'navDashboard' as const, end: true },
  { to: '/customers', key: 'navCustomers' as const, end: false },
  { to: '/add-transaction', key: 'navAdd' as const, end: false },
]

export function Layout() {
  const { t } = useLanguage()

  return (
    <div className="min-h-svh bg-emerald-50/60 text-slate-900">
      <div className="mx-auto flex min-h-svh max-w-5xl flex-col md:flex-row">
        <aside className="sticky top-0 z-10 border-b border-emerald-100 bg-white/95 px-4 py-3 backdrop-blur md:flex md:h-svh md:w-64 md:flex-col md:border-b-0 md:border-r md:px-5 md:py-6">
          <div className="flex items-center justify-between gap-3 md:block">
            <div>
              <p className="text-xl font-bold tracking-tight text-emerald-800">{t('appName')}</p>
              <p className="text-sm text-slate-500">{t('tagline')}</p>
            </div>
            <NavLink
              to="/language"
              className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800 md:mt-4 md:inline-flex"
            >
              {t('navLanguage')}
            </NavLink>
          </div>

          <nav className="mt-6 hidden flex-col gap-2 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `min-h-12 rounded-xl px-4 py-3 text-base font-semibold ${
                    isActive
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-700 hover:bg-emerald-50'
                  }`
                }
              >
                {t(item.key)}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="flex-1 px-4 py-5 pb-28 md:px-8 md:pb-8">
          <Outlet />
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-3 gap-1 border-t border-emerald-100 bg-white px-2 py-2 md:hidden">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `min-h-12 rounded-xl px-2 py-2 text-center text-sm font-semibold ${
                isActive ? 'bg-emerald-600 text-white' : 'text-slate-700'
              }`
            }
          >
            {t(item.key)}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
