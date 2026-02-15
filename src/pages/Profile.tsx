import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { useAuthStore } from '@/store/authStore';
import { useStoreStore } from '@/store/storeStore';
import { Store, Mail, Phone } from 'lucide-react';
import storesData from '@/data/stores.json';

export default function Profile() {
  const { user } = useAuthStore();
  const { currentStore } = useStoreStore();

  const userStore = storesData.find(s => s.storeNumber === user?.storeNumber);

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Profile
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Your account information
        </p>
      </div>

      {/* User Info */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">User Information</h2>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6 mb-6">
            <img
              src={user.avatar}
              alt={user.firstName}
              className="w-24 h-24 rounded-full"
            />
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {user.firstName} {user.lastName}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 capitalize mb-2">
                {user.role}
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Mail className="w-4 h-4" />
                {user.email}
              </div>
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm text-gray-600 dark:text-gray-400 mb-1">Username</dt>
              <dd className="font-medium text-gray-900 dark:text-white">{user.username}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-600 dark:text-gray-400 mb-1">Employee ID</dt>
              <dd className="font-medium text-gray-900 dark:text-white">{user.id}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-600 dark:text-gray-400 mb-1">Role</dt>
              <dd className="font-medium text-gray-900 dark:text-white capitalize">{user.role}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-600 dark:text-gray-400 mb-1">Home Store</dt>
              <dd className="font-medium text-gray-900 dark:text-white">Store #{user.storeNumber}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Store Info */}
      {userStore && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Home Store</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {userStore.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Store #{userStore.storeNumber}
                </p>
              </div>

              <dl className="space-y-3">
                <div>
                  <dt className="text-sm text-gray-600 dark:text-gray-400 mb-1">Address</dt>
                  <dd className="font-medium text-gray-900 dark:text-white">
                    {userStore.address}<br />
                    {userStore.city}, {userStore.state} {userStore.zip}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-600 dark:text-gray-400 mb-1">Phone</dt>
                  <dd className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {userStore.phone}
                  </dd>
                </div>
                {userStore.manager && (
                  <div>
                    <dt className="text-sm text-gray-600 dark:text-gray-400 mb-1">Store Manager</dt>
                    <dd className="font-medium text-gray-900 dark:text-white">{userStore.manager}</dd>
                  </div>
                )}
              </dl>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Store (if different) */}
      {currentStore && currentStore.storeNumber !== user.storeNumber && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Current Working Store</h2>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Store className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {currentStore.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Store #{currentStore.storeNumber}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
