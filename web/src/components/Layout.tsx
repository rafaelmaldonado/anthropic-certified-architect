import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { CERT } from '../config'

const navItems = [
  { to: '/', label: 'Overview', end: true },
  { to: '/syllabus', label: 'Syllabus', end: false },
]

export function Layout() {
  const { user, signOut } = useAuth()

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-10 border-b border-black/[0.06] bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-black/50">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-5 py-3">
          <div className="flex items-center gap-2 font-semibold">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-accent text-sm text-white">
              ◇
            </span>
            <span className="hidden sm:inline">{CERT.appName}</span>
          </div>
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `rounded-full px-4 py-1.5 text-sm font-medium transition ${
                    isActive
                      ? 'bg-black/[0.07] dark:bg-white/15'
                      : 'text-black/55 hover:text-black dark:text-white/55 dark:hover:text-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="" className="h-8 w-8 rounded-full" />
            ) : (
              <div className="grid h-8 w-8 place-items-center rounded-full bg-black/10 text-xs dark:bg-white/15">
                {(user?.displayName ?? '?').charAt(0)}
              </div>
            )}
            <button
              onClick={() => void signOut()}
              className="text-sm text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-5 py-8">
        <Outlet />
      </main>
    </div>
  )
}
