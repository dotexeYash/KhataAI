import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { LedgerProvider } from './context/LedgerContext'
import { LanguageProvider } from './i18n/LanguageContext'
import { AddTransaction } from './pages/AddTransaction'
import { CustomerLedger } from './pages/CustomerLedger'
import { Customers } from './pages/Customers'
import { Dashboard } from './pages/Dashboard'
import { LanguagePage } from './pages/LanguagePage'

function App() {
  return (
    <LanguageProvider>
      <LedgerProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/customers/:customerId" element={<CustomerLedger />} />
              <Route path="/add-transaction" element={<AddTransaction />} />
              <Route path="/language" element={<LanguagePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </LedgerProvider>
    </LanguageProvider>
  )
}

export default App
