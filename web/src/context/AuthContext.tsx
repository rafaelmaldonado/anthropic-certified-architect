// Authentication state. With Firebase configured it uses Google Sign-In;
// without it, it exposes a "local user" so you can test the UI offline.

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as fbSignOut,
  type User as FirebaseUser,
} from 'firebase/auth'
import { auth, googleProvider, isFirebaseConfigured } from '../firebase'

export interface AppUser {
  uid: string
  displayName: string | null
  email: string | null
  photoURL: string | null
}

interface AuthContextValue {
  user: AppUser | null
  loading: boolean
  /** true when running without Firebase (local demo mode). */
  localMode: boolean
  signIn: () => Promise<void>
  signOut: () => Promise<void>
}

const LOCAL_USER: AppUser = {
  uid: 'local-user',
  displayName: 'Local mode',
  email: null,
  photoURL: null,
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function toAppUser(u: FirebaseUser): AppUser {
  return { uid: u.uid, displayName: u.displayName, email: u.email, photoURL: u.photoURL }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      // No Firebase: remember whether the user "signed in" in local mode.
      const entered = localStorage.getItem('local-signed-in') === 'true'
      setUser(entered ? LOCAL_USER : null)
      setLoading(false)
      return
    }
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u ? toAppUser(u) : null)
      setLoading(false)
    })
    return unsub
  }, [])

  async function signIn() {
    if (!isFirebaseConfigured || !auth) {
      localStorage.setItem('local-signed-in', 'true')
      setUser(LOCAL_USER)
      return
    }
    await signInWithPopup(auth, googleProvider)
  }

  async function signOut() {
    if (!isFirebaseConfigured || !auth) {
      localStorage.removeItem('local-signed-in')
      setUser(null)
      return
    }
    await fbSignOut(auth)
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, localMode: !isFirebaseConfigured, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}
