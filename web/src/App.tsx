import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ProgressProvider } from './context/ProgressContext'
import { Layout } from './components/Layout'
import { Login } from './components/Login'
import { Dashboard } from './pages/Dashboard'
import { Syllabus } from './pages/Syllabus'
import { QuizPage } from './pages/QuizPage'
import { CERT } from './config'

function Gate() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="grid min-h-dvh place-items-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    )
  }

  if (!user) return <Login />

  return (
    <ProgressProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="syllabus" element={<Syllabus />} />
            <Route path="quiz/:domainId" element={<QuizPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ProgressProvider>
  )
}

export default function App() {
  useEffect(() => {
    document.title = `${CERT.appName} · ${CERT.certName}`
  }, [])
  return (
    <AuthProvider>
      <Gate />
    </AuthProvider>
  )
}
