import { Menu, Moon, Sun, Store, LogOut } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { useStoreStore } from '@/store/storeStore';

export default function Header() {
  const { theme, toggleTheme, toggleSidebar, openModal } = useUIStore();
  const { user, logout } = useAuthStore();
  const { currentStore } = useStoreStore();

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Retail Shoe Management
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Inventory Management System
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Store Selector */}
          {currentStore && (
            <button
              onClick={() => openModal('store-switcher')}
              className="flex items-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-800 transition"
            >
              <Store className="w-4 h-4" />
              <span className="font-medium">{currentStore.name}</span>
            </button>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>

          {/* User Menu */}
          <div className="flex items-center gap-3 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <img
              src={user?.avatar || 'https://i.pravatar.cc/150?img=68'}
              alt={user?.firstName}
              className="w-8 h-8 rounded-full"
            />
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {user?.role}
              </p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="p-2 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400 rounded-lg transition"
            aria-label="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
