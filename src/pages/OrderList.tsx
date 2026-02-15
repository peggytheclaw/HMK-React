import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ordersData from '@/data/orders.json';
import productsData from '@/data/products.json';
import { Order, OrderStatus } from '@/types';
import { formatDistanceToNow } from 'date-fns';

export default function OrderList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredOrders = useMemo(() => {
    return (ordersData as Order[]).filter(order => {
      const matchesSearch = 
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.itemNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || order.orderStatus.toString() === statusFilter;
      
      return matchesSearch && matchesStatus;
    }).sort((a, b) => new Date(b.createDate).getTime() - new Date(a.createDate).getTime());
  }, [searchTerm, statusFilter]);

  const getStatusBadge = (status: OrderStatus) => {
    const badges = {
      [OrderStatus.Processing]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      [OrderStatus.Available]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      [OrderStatus.NotAvailable]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    };
    
    const labels = {
      [OrderStatus.Processing]: 'Processing',
      [OrderStatus.Available]: 'Available',
      [OrderStatus.NotAvailable]: 'Not Available',
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badges[status as keyof typeof badges] || ''}`}>
        {labels[status as keyof typeof labels] || 'Unknown'}
      </span>
    );
  };

  const getProductInfo = (itemNumber: string) => {
    return productsData.find(p => p.itemNumber === itemNumber);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Orders
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and track all orders
          </p>
        </div>
        <Link to="/orders/new">
          <Button>
            <Plus className="w-5 h-5 mr-2" />
            Create Order
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Statuses</option>
              <option value="1">Processing</option>
              <option value="3">Available</option>
              <option value="2">Not Available</option>
            </select>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <p>Showing {filteredOrders.length} orders</p>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const product = getProductInfo(order.itemNumber);
          
          return (
            <Link key={order.orderNumber} to={`/orders/${order.orderNumber}`}>
              <Card hover>
                <CardContent className="flex items-center gap-6">
                  {product && (
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {order.orderNumber}
                      </h3>
                      {getStatusBadge(order.orderStatus)}
                      {order.isInternetOrder && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full text-xs font-medium">
                          Web Order
                        </span>
                      )}
                      {order.isLocked && (
                        <span className="px-2 py-1 bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300 rounded-full text-xs font-medium">
                          Locked
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      <span className="font-medium">{order.customerName}</span> • {order.itemNumber} • Size {order.size}
                    </p>
                    
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      From Store #{order.storeFromId} → Store #{order.storeToId} • Created by {order.createdByName}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {formatDistanceToNow(new Date(order.createDate), { addSuffix: true })}
                    </p>
                    {product && (
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        ${product.price.toFixed(2)}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {filteredOrders.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No orders found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search or filters
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
