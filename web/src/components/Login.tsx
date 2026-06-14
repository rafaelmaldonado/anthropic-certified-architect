import { useAuth } from '../context/AuthContext'
import { CERT } from '../config'

export function Login() {
  const { signIn, localMode } = useAuth()

  return (
    <div className="grid min-h-dvh place-items-center px-6">
      <div className="w-full max-w-sm rounded-apple bg-white/80 p-8 text-center shadow-apple backdrop-blur dark:bg-white/5">
        <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-accent text-2xl text-white">
          ◇
        </div>
        <h1 className="text-xl font-semibold">{CERT.appName}</h1>
        <p className="mt-2 text-sm text-black/55 dark:text-white/55">{CERT.tagline}</p>
        <button
          onClick={() => void signIn()}
          className="mt-6 w-full rounded-full bg-accent px-6 py-3 font-medium text-white transition hover:opacity-90"
        >
          {localMode ? 'Enter (local mode)' : 'Continue with Google'}
        </button>
        {localMode && (
          <p className="mt-4 text-xs text-amber-600 dark:text-amber-400">
            Firebase not configured: data is stored on this device only.
          </p>
        )}
      </div>
    </div>
  )
}
