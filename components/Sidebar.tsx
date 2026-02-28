'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUserAction } from '@/redux/actions/auth-action/auth-action';
import type { AppDispatch, RootState } from '@/redux/store';

const NAV: Record<string, { label: string; icon: string; href: string }[]> = {
  admin: [
    { label: 'Dashboard', icon: '📊', href: '/dashboard' },
    { label: 'Patients', icon: '👥', href: '/patients' },
    { label: 'Appointments', icon: '📅', href: '/appointments' },
    { label: 'Prescriptions', icon: '💊', href: '/prescriptions' },
  ],
  doctor: [
    { label: 'Dashboard', icon: '📊', href: '/dashboard' },
    { label: 'Patients', icon: '👥', href: '/patients' },
    { label: 'Appointments', icon: '📅', href: '/appointments' },
    { label: 'Prescriptions', icon: '💊', href: '/prescriptions' },
  ],
  receptionist: [
    { label: 'Dashboard', icon: '📊', href: '/dashboard' },
    { label: 'Patients', icon: '👥', href: '/patients' },
    { label: 'Appointments', icon: '📅', href: '/appointments' },
  ],
  patient: [
    { label: 'Dashboard', icon: '📊', href: '/dashboard' },
    { label: 'My Appointments', icon: '📅', href: '/appointments' },
    { label: 'My Prescriptions', icon: '💊', href: '/prescriptions' },
  ],
};

const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-red-100 text-red-700',
  doctor: 'bg-blue-100 text-blue-700',
  receptionist: 'bg-purple-100 text-purple-700',
  patient: 'bg-green-100 text-green-700',
};

interface SidebarProps {
  role: string;
  open?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ role, open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const dispatch = useDispatch() as AppDispatch;
  const router = useRouter();
  const userData = useSelector((state: RootState) => state.user.userData);
  const loginData = useSelector((state: RootState) => state.auth.loginData);

  const navItems = NAV[role] || NAV.patient;

  const displayName = userData?.name || loginData?.displayName || loginData?.email || 'User';
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = async () => {
    await dispatch(logoutUserAction());
    router.push('/login');
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/40 z-20 md:hidden" onClick={onClose} />
      )}

      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-30 w-64 bg-[#1e2a3a] text-white
          flex flex-col shrink-0 h-screen transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center text-lg shrink-0">
            🏥
          </div>
          <div>
            <div className="font-bold text-base leading-tight">ClinicAI</div>
            <div className="text-xs text-gray-400">Medical System</div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }
                `}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold shrink-0">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium truncate">{displayName}</div>
              <span
                className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium mt-0.5 ${
                  ROLE_COLORS[role] || 'bg-gray-100 text-gray-700'
                }`}
              >
                {role}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left text-sm text-gray-400 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-colors"
          >
            🚪 Logout
          </button>
        </div>
      </aside>
    </>
  );
}
