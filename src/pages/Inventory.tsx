import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import productsData from '@/data/products.json';
import storesData from '@/data/stores.json';
import { Product } from '@/types';

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStore, setSelectedStore] = useState<string>('all');

  const filteredProducts = useMemo(() => {
    return (productsData as Product[]).filter(product => 
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.itemNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const getStoreInventory = (product: Product, storeNumber: string) => {
    return product.inventory.find(inv => inv.storeNumber === storeNumber);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Inventory Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track inventory levels across all stores
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <select
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Stores</option>
              {storesData.map(store => (
                <option key={store.storeNumber} value={store.storeNumber}>
                  {store.name}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Inventory Levels
          </h2>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">Product</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">Item #</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">Company Total</th>
                  {(selectedStore === 'all' ? storesData : storesData.filter(s => s.storeNumber === selectedStore)).map(store => (
                    <th key={store.storeNumber} className="text-center py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                      Store {store.storeNumber}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.itemNumber} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img src={product.imageUrl} alt={product.title} className="w-10 h-10 object-cover rounded" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{product.title}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{product.color}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-sm text-gray-600 dark:text-gray-400">{product.itemNumber}</td>
                    <td className="py-3 px-4 text-center font-bold text-gray-900 dark:text-white">{product.companyOnHand}</td>
                    {(selectedStore === 'all' ? storesData : storesData.filter(s => s.storeNumber === selectedStore)).map(store => {
                      const inventory = getStoreInventory(product, store.storeNumber);
                      return (
                        <td key={store.storeNumber} className="py-3 px-4 text-center">
                          {inventory ? (
                            <span className={`font-medium ${inventory.quantity > 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
                              {inventory.quantity}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
