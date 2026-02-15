import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingCart, CheckCircle, XCircle, TrendingUp, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import productsData from '@/data/products.json';
import ordersData from '@/data/orders.json';
import { Order, OrderStatus } from '@/types';

export default function Dashboard() {
  const stats = useMemo(() => {
    const orders = ordersData as Order[];
    
    return {
      totalProducts: productsData.length,
      totalOrders: orders.length,
      processingOrders: orders.filter(o => o.orderStatus === OrderStatus.Processing).length,
      availableOrders: orders.filter(o => o.orderStatus === OrderStatus.Available).length,
      notAvailableOrders: orders.filter(o => o.orderStatus === OrderStatus.NotAvailable).length,
      totalInventory: productsData.reduce((sum, p) => sum + p.companyOnHand, 0),
    };
  }, []);

  const recentOrders = useMemo(() => {
    return (ordersData as Order[])
      .sort((a, b) => new Date(b.createDate).getTime() - new Date(a.createDate).getTime())
      .slice(0, 5);
  }, []);

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Overview of your retail operations
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Products</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalProducts}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Package className="w-8 h-8 text-blue-600 dark:text-blue-300" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalOrders}</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <ShoppingCart className="w-8 h-8 text-purple-600 dark:text-purple-300" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Available</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.availableOrders}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-300" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Processing</p>
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{stats.processingOrders}</p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <TrendingUp className="w-8 h-8 text-yellow-600 dark:text-yellow-300" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/orders/new">
              <Button className="w-full">Create New Order</Button>
            </Link>
            <Link to="/products">
              <Button variant="outline" className="w-full">Browse Products</Button>
            </Link>
            <Link to="/inventory">
              <Button variant="outline" className="w-full">Check Inventory</Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Orders</h2>
          <Link to="/orders">
            <Button variant="ghost" size="sm">
              View All <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.orderNumber} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">{order.orderNumber}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {order.customerName} • {order.itemNumber} • Size {order.size}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  {getStatusBadge(order.orderStatus)}
                  <Link to={`/orders/${order.orderNumber}`}>
                    <Button variant="ghost" size="sm">
                      View <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
