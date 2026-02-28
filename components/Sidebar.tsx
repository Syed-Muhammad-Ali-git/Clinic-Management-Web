'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { logOutUser } from '@/redux/actions/auth-action/auth-action';
import type { RootState } from '@/redux/store';

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

interface SidebarProps {
  role: string;
  open?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ role, open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const navItems = NAV[role] || NAV.patient;

  const ROLE_COLORS: Record<string, string> = {
    admin: 'bg-red-100 text-red-700',
    doctor: 'bg-blue-100 text-blue-700',
    receptionist: 'bg-purple-100 text-purple-700',
    patient: 'bg-green-100 text-green-700',
  };

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div className="fixed inset-0 bg-black/40 z-20 md:hidden" onClick={onClose} />
      )}

      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-30 flex flex-col
        transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:flex md:z-auto
      `}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-xl shadow">
            🏥
          </div>
          <div>
            <div className="font-bold text-gray-900 leading-none">ClinicAI</div>
            <div className="text-xs text-gray-400 mt-0.5">Medical Manager</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                  ${active ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
              {user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-gray-800 truncate">{user?.displayName || 'User'}</div>
              <div className="text-xs text-gray-400 truncate">{user?.email}</div>
            </div>
          </div>
          <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold capitalize mb-3 ${ROLE_COLORS[role] || 'bg-gray-100 text-gray-700'}`}>
            {role}
          </span>
          <button
            onClick={() => dispatch<any>(logOutUser())}
            className="w-full py-2 px-3 bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-600 rounded-lg text-sm font-medium transition flex items-center gap-2">
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>
    </>
  );
}
